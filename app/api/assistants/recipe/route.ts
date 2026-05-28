import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { deleteRecipeTool, updateRecipeTool } from "@/lib/ai/tools/tools";
import { getPrompt } from "@/lib/ai/prompts";
import { validateAssistantsRequest } from "@/app/api/assistants/validate-assistant-request";

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
    model: openai.chat("gpt-5.4-nano"),
    providerOptions: { openai: { parallelToolCalls: false } },
    system: prompt[0].content,
    stopWhen: stepCountIs(10),
    messages: await convertToModelMessages(messages),
    tools: {
      updateRecipeTool,
      // deleteRecipeTool is exposed without an execute handler so the client
      // can intercept it to trigger the navigation after deletion.
      deleteRecipeTool: { ...deleteRecipeTool, execute: undefined },
    },
  });

  return result.toUIMessageStreamResponse();
}
