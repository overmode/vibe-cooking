import { getCurrentUserId } from "@/lib/auth/get-current-user-id";
import { chatLimiter } from "@/lib/rate-limiter";
import { MAX_USER_MESSAGE_LENGTH } from "@/lib/constants/app_validation";
import { UIMessage } from "ai";

export async function validateAssistantsRequest(messages: UIMessage[]) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return { error: new Response("Unauthorized", { status: 401 }) };
  }

  const { success } = await chatLimiter.limit(userId);
  if (!success) {
    return { error: new Response("Rate Limit Exceeded", { status: 429 }) };
  }

  const lastMessage = messages[messages.length - 1];
  const userMessageLength =
    lastMessage?.parts
      ?.filter((part) => part.type === "text")
      .reduce((sum, part) => sum + part.text.length, 0) ?? 0;

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
