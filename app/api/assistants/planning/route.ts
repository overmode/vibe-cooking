import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
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

// Allow streaming responses up to 30 seconds
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
    model: openai("gpt-4.1", { parallelToolCalls: false }),
    system: prompt[0].content,
    maxSteps: 10,
    messages,
    tools: {
      // Recipe crud operations
      getRecipesMetadataTool: getRecipesMetadataTool,
      createRecipeTool: createRecipeTool,
      updateRecipeTool: updateRecipeTool,
      deleteRecipeTool: deleteRecipeTool,
      getRecipeByIdTool: getRecipeByIdTool,

      // Recipe suggestion
      renderRecipeSuggestionTool: renderRecipeSuggestionTool,

      // planned meal crud operations
      getPlannedMealsMetadataTool: getPlannedMealsMetadataTool,
      getPlannedMealsTool: getPlannedMealsTool,
      createPlannedMealTool: createPlannedMealTool,
      updatePlannedMealTool: updatePlannedMealTool,
      deletePlannedMealTool: deletePlannedMealTool,
      getPlannedMealByIdTool: getPlannedMealByIdTool,

      // Cooking mode
      enterCookingModeTool: enterCookingModeTool,
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return result.toDataStreamResponse();
}
