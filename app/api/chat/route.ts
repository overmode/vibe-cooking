import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createRecipeTool, deleteRecipeTool } from "@/lib/ai/tools";
import { getPrompt } from "@/lib/ai/prompts";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const prompt = await getPrompt({
    promptName: "main-cook-assistant",
    promptVars: {},
  });

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: prompt[0].content,
    messages,
    tools: [createRecipeTool, deleteRecipeTool],
  });

  return result.toDataStreamResponse();
}
