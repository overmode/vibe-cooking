import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { deleteRecipeTool, updateRecipeTool } from "@/lib/ai/tools/tools";
import { getPrompt } from "@/lib/ai/prompts";
import { validateAssistantsRequest } from "@/app/api/assistants/validate-assistant-request";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, recipe, userDietaryPreferences } = await req.json();

  const { error } = await validateAssistantsRequest(messages);
  if (error) {
    return error;
  }

  if (!recipe) {
    return new Response("Invalid payload: recipe is required", {
      status: 400,
    });
  }

  const prompt = await getPrompt({
    promptName: "recipe-assistant",
    promptVars: {
      date: new Date().toISOString(),
      recipe: JSON.stringify(recipe),
      user_dietary_preferences: userDietaryPreferences ?? "No preferences.",
    },
  });

  const result = streamText({
    model: openai("gpt-4.1", {
      parallelToolCalls: false,
    }),
    system: prompt[0].content,
    maxSteps: 5,
    messages,
    tools: {
      updateRecipeTool: updateRecipeTool,
      // We make the deleteRecipeTool available to the model, but it's not
      // automatically executed.
      //
      // This is because we want to detect when the user deletes a recipe and
      // navigate back to the recipes list.
      //
      // If the tool was automatically executed, we wouldn't be able to detect
      // that a recipe was deleted.
      deleteRecipeTool: {
        ...deleteRecipeTool,
        execute: undefined,
      },
    },
  });

  return result.toDataStreamResponse();
}
