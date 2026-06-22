import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  isTextUIPart,
  safeValidateUIMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { v7 as uuidv7 } from "uuid";
import { buildAssistantTools } from "@/lib/ai/tools/tools";
import { compileAssistantPrompt } from "@/lib/ai/prompts/assistant";
import { truncateMessagesToTokenLimit } from "@/lib/ai/truncate-messages";
import {
  appContextSchema,
  type ResolvedAppContext,
} from "@/lib/ai/app-context";
import { getLocale } from "next-intl/server";
import { getCurrentUserId } from "@/lib/auth/get-current-user-id";
import { DENIAL_STATUS } from "@/lib/api/denial";
import {
  getLimits,
  incrementMessageCount,
  incrementSearchCount,
} from "@/lib/rate-limiter";
import {
  MAX_ASSISTANT_STEPS,
  MAX_CONTEXT_TOKENS,
  MAX_SEARCHES_PER_DAY,
  MAX_USER_MESSAGE_LENGTH,
} from "@/lib/constants/app_validation";
import { getLatestUserProfileRevision } from "@/lib/data-access/user-profile";
import { getRecipeById } from "@/lib/data-access/recipe";
import {
  getThreadWithMessages,
  saveThreadMessages,
  updateThreadTitle,
} from "@/lib/data-access/chat-thread";
import generateThreadTitle from "@/lib/ai/generate-thread-title";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = (await req.json()) as {
    message: UIMessage;
    appContext: unknown;
    threadId: string;
  };

  const appContextParsed = appContextSchema.safeParse(body.appContext);
  if (!appContextParsed.success) {
    return new Response("Invalid appContext", { status: 400 });
  }
  const appContext = appContextParsed.data;
  const { threadId } = body;
  if (!threadId) return new Response("Missing threadId", { status: 400 });

  // Validate the inbound turn (SDK schema) and require a user role.
  const validation = await safeValidateUIMessages({ messages: [body.message] });
  if (!validation.success) {
    return new Response("Invalid message", { status: 400 });
  }
  const [message] = validation.data;
  if (message?.role !== "user") {
    return new Response("Invalid message", { status: 400 });
  }

  const recipeId =
    appContext.kind === "recipeView" ? appContext.recipeId : null;

  const lastMessageText = message.parts
    .filter(isTextUIPart)
    .map((p) => p.text)
    .join("");
  if (lastMessageText.length > MAX_USER_MESSAGE_LENGTH) {
    return new Response(
      `Message too long: max ${MAX_USER_MESSAGE_LENGTH} characters, got ${lastMessageText.length}.`,
      { status: 400 }
    );
  }

  const userId = await getCurrentUserId();
  if (!userId)
    return new Response("Unauthorized", { status: DENIAL_STATUS.unauthorized });

  const [limits, profileRevision, recipe, thread] = await Promise.all([
    getLimits(userId),
    getLatestUserProfileRevision({ userId }),
    appContext.kind === "recipeView"
      ? getRecipeById({ id: appContext.recipeId, userId }).catch(() => null)
      : Promise.resolve(null),
    getThreadWithMessages({ threadId }),
  ]);

  if (thread && thread.userId !== userId) {
    return new Response("Forbidden", { status: DENIAL_STATUS.forbidden });
  }

  if (limits.messageLimitReached) {
    return new Response("Rate Limit Exceeded", { status: 429 });
  }

  // Server-authoritative: client posts only the new turn; prior history comes
  // from the DB.
  const messages = [...(thread?.messages ?? []), message];

  let resolvedAppContext: ResolvedAppContext;
  if (appContext.kind === "recipeView") {
    if (!recipe) return new Response("Recipe not found", { status: 404 });
    resolvedAppContext = { kind: "recipeView", recipe };
  } else {
    resolvedAppContext = { kind: "mainAssistant" };
  }

  // Chats stay short in practice; 100k is a generous ceiling with headroom for
  // system prompt, tools, and model output.
  const modelMessages = truncateMessagesToTokenLimit(
    messages,
    MAX_CONTEXT_TOKENS
  );
  if (messages.length > 0 && modelMessages.length === 0) {
    return new Response("Conversation exceeds token limit.", { status: 400 });
  }

  // Save the user turn before answering: history is server-authoritative, so a
  // turn we can't store must fail loudly (500) rather than diverge. Retries
  // upsert on the stable id.
  try {
    await saveThreadMessages({
      userId,
      threadId,
      recipeId,
      messages: [message],
    });
  } catch (error) {
    console.error("[assistant] failed to persist user message", error);
    return new Response("Failed to save message", { status: 500 });
  }

  // Committed to answering: record the message against today's quota.
  await incrementMessageCount(userId);

  // Web search is the dominant per-user cost. Free users get a daily budget;
  // `prepareStep` drops the tool once the remaining budget is spent, so a
  // multi-step turn can't exceed the cap. "low" context keeps each search lean.
  const searchBudget = Math.max(0, MAX_SEARCHES_PER_DAY - limits.searchCount);

  const assistantTools = buildAssistantTools(userId);
  const tools = {
    webSearch: openai.tools.webSearch({ searchContextSize: "low" }),
    ...assistantTools,
  };
  const nonSearchTools = Object.keys(assistantTools) as (keyof typeof tools)[];

  const result = streamText({
    model: openai.responses("gpt-5.4-nano"),
    providerOptions: { openai: { parallelToolCalls: false, store: false } },
    system: compileAssistantPrompt({
      appContext: resolvedAppContext,
      userProfile: profileRevision?.content ?? null,
      locale: await getLocale(),
    }),
    stopWhen: stepCountIs(MAX_ASSISTANT_STEPS),
    messages: await convertToModelMessages(modelMessages),
    tools,
    // Provider-executed searches don't each get their own step, so this can't
    // gate within a step — but once prior steps have spent the budget, it stops
    // any further searching. onFinish records the real total.
    prepareStep: ({ steps }) => {
      const used = steps.reduce(
        (n, step) =>
          n + step.toolCalls.filter((c) => c.toolName === "webSearch").length,
        0
      );
      return used >= searchBudget ? { activeTools: nonSearchTools } : undefined;
    },
  });

  // Drain server-side to remove backpressure so generation runs to completion
  // and onFinish fires even without the client pulling the stream. This is
  // best-effort against client disconnects, not a guarantee: the platform can
  // still tear the function down on a hard disconnect (see vercel/ai#6632).
  // onError catches failures in the drain itself, per the no-silent-failures policy.
  result.consumeStream({
    onError: (error) => {
      console.error("[assistant] stream drain error", error);
    },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: uuidv7,
    // Assistant save is best-effort but loud: it's post-stream so it can't 500,
    // and a reload reconciles from the DB. Title is cosmetic, self-heals.
    onFinish: async ({ responseMessage }) => {
      const searchCalls = responseMessage.parts.filter(
        (p) =>
          p.type === "tool-webSearch" &&
          "state" in p &&
          p.state === "output-available"
      ).length;
      try {
        await incrementSearchCount(userId, searchCalls);
        await saveThreadMessages({
          userId,
          threadId,
          recipeId,
          messages: [responseMessage],
        });
        if (!thread?.title && lastMessageText) {
          const title = await generateThreadTitle({
            messages: [...messages, responseMessage],
          });
          if (title) await updateThreadTitle({ threadId, userId, title });
        }
      } catch (error) {
        console.error("[assistant] failed to persist assistant turn", error);
      }
    },
  });
}
