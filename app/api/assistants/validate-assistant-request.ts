import { auth } from "@clerk/nextjs/server";
import { chatLimiter } from "@/lib/rate-limiter";
import { MAX_USER_MESSAGE_LENGTH } from "@/lib/constants/app_validation";
import { Message } from "ai";

export async function validateAssistantsRequest(messages: Message[]) {
  const { userId } = await auth();

  if (!userId) {
    return { error: new Response("Unauthorized", { status: 401 }) };
  }

  const { success } = await chatLimiter.limit(userId);
  if (!success) {
    return { error: new Response("Rate Limit Exceeded", { status: 429 }) };
  }

  const lastMessage = messages[messages.length - 1];
  const userMessageLength = lastMessage?.content.length ?? 0;

  if (userMessageLength > MAX_USER_MESSAGE_LENGTH) {
    return {
      error: new Response(
        `Message too long: max length is ${MAX_USER_MESSAGE_LENGTH} characters, got ${userMessageLength} characters.`,
        { status: 400 }
      ),
    };
  }

  return { userId };
}
