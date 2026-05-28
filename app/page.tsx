"use client";

import { useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { chatSuggestions } from "@/lib/constants/chat-suggestions";
import { triggerToolEffects } from "@/lib/ai/tools/effects";
import { useQueryClient } from "@tanstack/react-query";
import { routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { enterCookingModeDefinition } from "@/lib/ai/tools/definitions";
import { z } from "zod";
import { apiRoutes } from "@/lib/api/api-routes";
import { Chat } from "@/components/chat/chat";
import { useUserDietaryPreferences } from "@/lib/api/hooks/preferences";

const initialMessages: UIMessage[] = [
  {
    id: "1",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Welcome to Vibe Cooking! How can I help you today? 🌴 ",
      },
    ],
  },
];

export default function Home() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: userDietaryPreferences } = useUserDietaryPreferences({});

  const transport = useMemo(
    () => new DefaultChatTransport({ api: apiRoutes.assistants.planning }),
    []
  );

  const { messages, sendMessage, error } = useChat({
    transport,
    messages: initialMessages,
    onToolCall: ({ toolCall }) => {
      if (toolCall.toolName === "enterCookingModeTool") {
        const id = (
          toolCall.input as z.infer<
            typeof enterCookingModeDefinition.inputSchema
          >
        ).id;
        router.push(routes.plannedMeal.cooking(id));
      }
    },
    onFinish: ({ message }) => {
      triggerToolEffects(message, queryClient);
    },
  });

  const send = useCallback(
    (text: string) =>
      sendMessage(
        { text },
        {
          body: {
            userDietaryPreferences: userDietaryPreferences?.preferences,
          },
        }
      ),
    [sendMessage, userDietaryPreferences?.preferences]
  );

  return (
    <Chat
      messages={messages}
      sendMessage={send}
      error={error}
      suggestions={chatSuggestions}
    />
  );
}
