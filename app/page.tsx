"use client";

import { useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { chatSuggestions } from "@/lib/constants/chat-suggestions";
import { triggerToolEffects } from "@/lib/ai/tools/effects";
import { useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "@/lib/api/api-routes";
import { Chat } from "@/components/chat/chat";
import { AppContext } from "@/lib/ai/app-context";

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

  const transport = useMemo(
    () => new DefaultChatTransport({ api: apiRoutes.assistant }),
    []
  );

  const { messages, sendMessage, error, status } = useChat({
    transport,
    messages: initialMessages,
    onFinish: ({ message }) => {
      triggerToolEffects(message, queryClient);
    },
  });

  const send = useCallback(
    (text: string) => {
      const appContext: AppContext = { kind: "mainAssistant" };
      sendMessage({ text }, { body: { appContext } });
    },
    [sendMessage]
  );

  return (
    <Chat
      messages={messages}
      sendMessage={send}
      error={error}
      suggestions={chatSuggestions}
      isWaiting={status === 'submitted'}
    />
  );
}
