import { DefaultChatTransport, type UIMessage } from "ai";
import { apiRoutes } from "@/lib/api/api-routes";

// Transport for the server-authoritative assistant endpoint: post only the
// latest turn and let the route rebuild prior context from the DB. Shared so the
// request shape stays in lockstep with what /api/assistant expects.
export function createAssistantTransport() {
  return new DefaultChatTransport<UIMessage>({
    api: apiRoutes.assistant,
    prepareSendMessagesRequest: ({ messages, body }) => ({
      body: { ...body, message: messages[messages.length - 1] },
    }),
  });
}
