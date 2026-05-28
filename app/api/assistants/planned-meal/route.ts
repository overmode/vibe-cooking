import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { updatePlannedMealTool } from "@/lib/ai/tools/tools";
import { getPrompt } from "@/lib/ai/prompts";
import { validateAssistantsRequest } from "@/app/api/assistants/validate-assistant-request";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, plannedMeal, userDietaryPreferences } = await req.json();

  const { error } = await validateAssistantsRequest(messages);
  if (error) {
    return error;
  }

  if (!plannedMeal) {
    return new Response("Invalid payload: plannedMeal is required", {
      status: 400,
    });
  }

  const prompt = await getPrompt({
    promptName: "planned-meal-assistant",
    promptVars: {
      date: new Date().toISOString(),
      plannedMeal: JSON.stringify(plannedMeal),
      user_dietary_preferences: userDietaryPreferences ?? "No preferences.",
    },
  });

  const result = streamText({
    model: openai("gpt-4.1"),
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
