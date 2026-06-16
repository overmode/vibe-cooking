// OpenAI domain verification for ChatGPT app submission: returns the one-time
// token OpenAI reveals during the submission flow. Set the token in
// OPENAI_APPS_CHALLENGE_TOKEN; until then this 404s so it never affects runtime.
export const dynamic = "force-dynamic";

export function GET() {
  const token = process.env.OPENAI_APPS_CHALLENGE_TOKEN;
  if (!token) return new Response("Not found", { status: 404 });
  return new Response(token, {
    headers: { "Content-Type": "text/plain" },
  });
}
