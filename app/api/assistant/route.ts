import { after } from "next/server";
import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  isTextUIPart,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { v7 as uuidv7 } from "uuid";
import {
  createRecipeTool,
  deleteRecipeTool,
  getRecipeByIdTool,
  getRecipesMetadataTool,
  renderRecipeSuggestionTool,
  updateRecipeTool,
  updateUserProfileTool,
} from "@/lib/ai/tools/tools";
import { compileAssistantPrompt } from "@/lib/ai/prompts/assistant";
import { truncateMessagesToTokenLimit } from "@/lib/ai/truncate-messages";
import { appContextSchema, type ResolvedAppContext } from "@/lib/ai/app-context";
import { getCurrentUserId } from "@/lib/auth/get-current-user-id";
import { chatLimiter } from "@/lib/rate-limiter";
import { MAX_USER_MESSAGE_LENGTH } from "@/lib/constants/app_validation";
import { getLatestUserProfileRevision } from "@/lib/data-access/user-profile";
import { getRecipeById } from "@/lib/data-access/recipe";
import {
  getThreadById,
  saveThreadMessages,
  updateThreadTitle,
} from "@/lib/data-access/chat-thread";
import generateThreadTitle from "@/lib/ai/generate-thread-title";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = (await req.json()) as {
    messages: UIMessage[];
    appContext: unknown;
    threadId: string;
  };

  const appContextParsed = appContextSchema.safeParse(body.appContext);
  if (!appContextParsed.success) {
    return new Response("Invalid appContext", { status: 400 });
  }
  const appContext = appContextParsed.data;
  const { messages, threadId } = body;
  if (!threadId) return new Response("Missing threadId", { status: 400 });
  const recipeId =
    appContext.kind === "recipeView" ? appContext.recipeId : null;

  const lastMessageText =
    messages.at(-1)?.parts.filter(isTextUIPart).map((p) => p.text).join("") ??
    "";
  if (lastMessageText.length > MAX_USER_MESSAGE_LENGTH) {
    return new Response(
      `Message too long: max ${MAX_USER_MESSAGE_LENGTH} characters, got ${lastMessageText.length}.`,
      { status: 400 }
    );
  }

  const userId = await getCurrentUserId();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const [{ success }, profileRevision, recipe, thread] = await Promise.all([
    chatLimiter.limit(userId),
    getLatestUserProfileRevision({ userId }),
    appContext.kind === "recipeView"
      ? getRecipeById({ id: appContext.recipeId, userId }).catch(() => null)
      : Promise.resolve(null),
    getThreadById({ threadId }),
  ]);

  if (thread && thread.userId !== userId) {
    return new Response("Forbidden", { status: 403 });
  }

  if (!success) return new Response("Rate Limit Exceeded", { status: 429 });

  let resolvedAppContext: ResolvedAppContext;
  if (appContext.kind === "recipeView") {
    if (!recipe) return new Response("Recipe not found", { status: 404 });
    resolvedAppContext = { kind: "recipeView", recipe };
  } else {
    resolvedAppContext = { kind: "mainAssistant" };
  }

  // Chats stay short in practice; 100k is a generous ceiling with headroom for
  // system prompt, tools, and model output.
  const modelMessages = truncateMessagesToTokenLimit(messages, 100_000);
  if (messages.length > 0 && modelMessages.length === 0) {
    return new Response("Conversation exceeds token limit.", { status: 400 });
  }

  const result = streamText({
    model: openai.responses("gpt-5.4-nano"),
    providerOptions: { openai: { parallelToolCalls: false, store: false } },
    system: compileAssistantPrompt({
      appContext: resolvedAppContext,
      userProfile: profileRevision?.content ?? null,
    }),
    stopWhen: stepCountIs(10),
    messages: await convertToModelMessages(modelMessages),
    tools: {
      webSearch: openai.tools.webSearch({}),
      getRecipesMetadataTool,
      createRecipeTool,
      updateRecipeTool,
      updateUserProfileTool,
      getRecipeByIdTool,
      renderRecipeSuggestionTool,
      deleteRecipeTool: { ...deleteRecipeTool, execute: undefined },
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

  let assistantMessage: UIMessage | undefined;
  const response = result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: uuidv7,
    onFinish: ({ responseMessage }) => {
      assistantMessage = responseMessage;
    },
  });

  // Persist after the response so the DB round trips never delay streaming.
  // Best-effort: failures are logged in the data layer, never surfaced. Two
  // sequential saves keep user.createdAt < assistant.createdAt (CURRENT_TIMESTAMP
  // is constant within a transaction, so a single tx would tie them).
  after(async () => {
    const userMessage = messages.at(-1);
    if (userMessage?.role === "user") {
      await saveThreadMessages({
        userId,
        threadId,
        recipeId,
        messages: [userMessage],
      }).catch((error) => {
        console.error("[assistant] failed to persist user message", error);
      });
    }
    if (assistantMessage) {
      await saveThreadMessages({
        userId,
        threadId,
        recipeId,
        messages: [assistantMessage],
      }).catch((error) => {
        console.error(
          "[assistant] failed to persist assistant message",
          error
        );
      });
    }

    // Label the thread once, from the full conversation. Null title covers both
    // a brand-new thread and a prior generation that failed, so it self-heals.
    if (!thread?.title && lastMessageText) {
      const title = await generateThreadTitle({
        messages: assistantMessage ? [...messages, assistantMessage] : messages,
      });
      if (title) {
        await updateThreadTitle({ threadId, userId, title }).catch((error) => {
          console.error("[assistant] failed to persist thread title", error);
        });
      }
    }
  });

  return response;
}
