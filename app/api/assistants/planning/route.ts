import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import {
  createRecipeTool,
  deleteRecipeTool,
  renderRecipeSuggestionTool,
  getRecipesMetadataTool,
  updateRecipeTool,
  getRecipeByIdTool,
  getPlannedMealsMetadataTool,
  createPlannedMealTool,
  updatePlannedMealTool,
  deletePlannedMealTool,
  getPlannedMealByIdTool,
  getPlannedMealsTool,
  enterCookingModeTool,
} from "@/lib/ai/tools/tools";
import { getPrompt } from "@/lib/ai/prompts";
import { validateAssistantsRequest } from "@/app/api/assistants/validate-assistant-request";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, userDietaryPreferences } = await req.json();

  const { error } = await validateAssistantsRequest(messages);
  if (error) {
    return error;
  }

  const prompt = await getPrompt({
    promptName: "planning-assistant",
    promptVars: {
      date: new Date().toISOString(),
      user_dietary_preferences: userDietaryPreferences ?? "No preferences.",
    },
  });

  const result = streamText({
    model: openai.chat("gpt-5.4-nano"),
    providerOptions: { openai: { parallelToolCalls: false } },
    system: prompt[0].content,
    stopWhen: stepCountIs(10),
    messages: await convertToModelMessages(messages),
    tools: {
      getRecipesMetadataTool,
      createRecipeTool,
      updateRecipeTool,
      deleteRecipeTool,
      getRecipeByIdTool,

      renderRecipeSuggestionTool,

      getPlannedMealsMetadataTool,
      getPlannedMealsTool,
      createPlannedMealTool,
      updatePlannedMealTool,
      deletePlannedMealTool,
      getPlannedMealByIdTool,

      enterCookingModeTool,
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return result.toUIMessageStreamResponse({ originalMessages: messages });
}
