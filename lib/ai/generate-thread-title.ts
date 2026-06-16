import { openai } from "@ai-sdk/openai";
import { generateText, isTextUIPart, Output, type UIMessage } from "ai";
import { z } from "zod";

const titleSchema = z.object({
  title: z
    .string()
    .describe(
      "Concise conversation title, at most 5 words, no trailing punctuation or quotes"
    ),
});

const SYSTEM_PROMPT = `Summarize the conversation into a title of at most 5 words. Plain text only: no quotes, no trailing punctuation, no emoji.`;

// Best-effort: returns null on empty input or failure so the caller can skip the
// write. Never throws into the request's post-response hook.
//
// The conversation is flattened to a plain-text transcript rather than replayed
// as model messages: assistant turns from the Responses API carry stored item
// ids, and replaying them by reference 404s under Zero Data Retention orgs.
// Inlining the text sidesteps that and is all a title needs.
export default async function generateThreadTitle({
  messages,
}: {
  messages: UIMessage[];
}): Promise<string | null> {
  const transcript = messages
    .map((message) => {
      const text = message.parts
        .filter(isTextUIPart)
        .map((part) => part.text)
        .join("")
        .trim();
      return text ? `${message.role}: ${text}` : null;
    })
    .filter((line) => line !== null)
    .join("\n");

  if (!transcript) return null;

  try {
    const { output } = await generateText({
      model: openai("gpt-5.4-nano"),
      providerOptions: { openai: { store: false } },
      output: Output.object({ schema: titleSchema }),
      system: SYSTEM_PROMPT,
      prompt: transcript,
    });
    const title = output.title.trim();
    return title.length > 0 ? title : null;
  } catch (error) {
    console.error("[assistant] failed to generate thread title", error);
    return null;
  }
}
