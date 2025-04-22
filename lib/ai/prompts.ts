import { Langfuse } from "langfuse";

const langfuse = new Langfuse({
  baseUrl: process.env.LANGFUSE_BASEURL,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
});

export async function getPrompt({
  promptName,
  promptVars,
}: {
  promptName: string;
  promptVars: Record<string, string>;
}) {
  const prompt = await langfuse.getPrompt(promptName, undefined, {
    type: "chat",
    label: process.env.NODE_ENV === "production" ? "production" : "staging",
    cacheTtlSeconds: 300,
  });

  return prompt.compile(promptVars);
}
