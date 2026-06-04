import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  isTextUIPart,
  stepCountIs,
  streamText,
  UIMessage,
} from "ai";
import {
  createRecipeTool,
  deleteRecipeTool,
  getRecipeByIdTool,
  getRecipesMetadataTool,
  renderRecipeSuggestionTool,
  updateRecipeTool,
} from "@/lib/ai/tools/tools";
import { compileAssistantPrompt } from "@/lib/ai/prompts/assistant";
import { appContextSchema, ResolvedAppContext } from "@/lib/ai/app-context";
import { getCurrentUserId } from "@/lib/auth/get-current-user-id";
import { chatLimiter } from "@/lib/rate-limiter";
import { MAX_USER_MESSAGE_LENGTH } from "@/lib/constants/app_validation";
import { getUserDietaryPreferences } from "@/lib/data-access/preferences";
import { getRecipeById } from "@/lib/data-access/recipe";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = (await req.json()) as { messages: UIMessage[]; appContext: unknown };

  const appContextParsed = appContextSchema.safeParse(body.appContext);
  if (!appContextParsed.success) {
    return new Response("Invalid appContext", { status: 400 });
  }
  const appContext = appContextParsed.data;
  const { messages } = body;

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

  const [{ success }, preferences, recipe] = await Promise.all([
    chatLimiter.limit(userId),
    getUserDietaryPreferences({ userId }),
    appContext.kind === "recipeView"
      ? getRecipeById({ id: appContext.recipeId, userId }).catch(() => null)
      : Promise.resolve(null),
  ]);

  if (!success) return new Response("Rate Limit Exceeded", { status: 429 });

  let resolvedAppContext: ResolvedAppContext;
  if (appContext.kind === "recipeView") {
    if (!recipe) return new Response("Recipe not found", { status: 404 });
    resolvedAppContext = { kind: "recipeView", recipe };
  } else {
    resolvedAppContext = { kind: "mainAssistant" };
  }

  const result = streamText({
    model: openai.responses("gpt-5.4-nano"),
    providerOptions: { openai: { parallelToolCalls: false, store: false } },
    system: compileAssistantPrompt({
      appContext: resolvedAppContext,
      userDietaryPreferences: preferences?.preferences ?? null,
    }),
    stopWhen: stepCountIs(10),
    messages: await convertToModelMessages(messages),
    tools: {
      webSearch: openai.tools.webSearch({}),
      getRecipesMetadataTool,
      createRecipeTool,
      updateRecipeTool,
      getRecipeByIdTool,
      renderRecipeSuggestionTool,
      deleteRecipeTool: { ...deleteRecipeTool, execute: undefined },
    },
  });

  return result.toUIMessageStreamResponse({ originalMessages: messages });
}
