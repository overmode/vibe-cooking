import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { updatePlannedMealTool } from "@/lib/ai/tools/tools";
import { getPrompt } from "@/lib/ai/prompts";
import { validateAssistantsRequest } from "@/app/api/assistants/validate-assistant-request";

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
    model: openai.chat("gpt-5.4-nano"),
    providerOptions: { openai: { parallelToolCalls: false } },
    system: prompt[0].content,
    stopWhen: stepCountIs(10),
    messages: await convertToModelMessages(messages),
    tools: {
      updatePlannedMealTool,
    },
  });

  return result.toUIMessageStreamResponse();
}
