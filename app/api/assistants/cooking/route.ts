import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { updatePlannedMealTool } from "@/lib/ai/tools/tools";
import { getPrompt } from "@/lib/ai/prompts";
import { validateAssistantsRequest } from "@/app/api/assistants/validate-assistant-request";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, plannedMealWithRecipe, userDietaryPreferences } =
    await req.json();

  const { error } = await validateAssistantsRequest(messages);
  if (error) {
    return error;
  }

  if (!plannedMealWithRecipe) {
    return new Response("Invalid payload: plannedMealWithRecipe is required", {
      status: 400,
    });
  }

  const prompt = await getPrompt({
    promptName: "cooking-assistant",
    promptVars: {
      date: new Date().toISOString(),
      plannedMealWithRecipe: JSON.stringify(plannedMealWithRecipe),
      user_dietary_preferences: userDietaryPreferences ?? "No preferences.",
    },
  });

  const result = streamText({
    model: openai("gpt-4.1", { parallelToolCalls: false }),
    system: prompt[0].content,
    maxSteps: 10,
    messages,
    tools: {
      updatePlannedMealTool: updatePlannedMealTool,
    },
  });

  return result.toDataStreamResponse();
}
