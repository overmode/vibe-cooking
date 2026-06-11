"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { type UIMessage } from "ai";
import { v7 as uuidv7 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";
import { Chat } from "@/components/chat/chat";
import { createAssistantTransport } from "@/components/chat/assistant-transport";
import { triggerToolEffects } from "@/lib/ai/tools/effects";
import { routes } from "@/lib/routes";
import { type AppContext } from "@/lib/ai/app-context";
import { type ChatSuggestion } from "@/lib/types";

// Display-only greeting shown above every chat; never sent or persisted.
const welcomeMessage: UIMessage = {
  id: "welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "Welcome to Vibe Cooking! How can I help you today? 🌴 ",
    },
  ],
};

interface AssistantChatProps {
  threadId: string;
  // Conversation history shown after the greeting. Empty for a new chat.
  initialMessages?: UIMessage[];
  suggestions?: ChatSuggestion[];
  // When true, the first message rewrites the URL to /c/<threadId> so a reload
  // resumes this chat. Opened chats already live at that URL and pass false.
  stampUrl?: boolean;
  // Sent once on mount. Only the home page sets it, to honor a ?preset= deep link.
  initialPrompt?: string;
}

export function AssistantChat({
  threadId,
  initialMessages = [],
  suggestions,
  stampUrl = false,
  initialPrompt,
}: AssistantChatProps) {
  const queryClient = useQueryClient();
  const hasStamped = useRef(false);
  const hasAutoSent = useRef(false);

  const transport = useMemo(() => createAssistantTransport(), []);

  const { messages, sendMessage, error, status } = useChat({
    id: threadId,
    transport,
    messages: [welcomeMessage, ...initialMessages],
    generateId: uuidv7,
    onFinish: ({ message }) => {
      triggerToolEffects(message, queryClient);
    },
  });

  const send = useCallback(
    (text: string) => {
      if (stampUrl && !hasStamped.current) {
        hasStamped.current = true;
        // Rewrite in place, not a router push: a remount would kill the stream.
        window.history.replaceState(null, "", routes.chat(threadId));
      }
      const appContext: AppContext = { kind: "mainAssistant" };
      void sendMessage({ text }, { body: { appContext, threadId } });
    },
    [sendMessage, threadId, stampUrl]
  );

  // Preset arrives as a URL param, so it must send after mount; ref fires it once.
  useEffect(() => {
    if (!initialPrompt || hasAutoSent.current) return;
    hasAutoSent.current = true;
    send(initialPrompt);
  }, [initialPrompt, send]);

  return (
    <Chat
      messages={messages}
      sendMessage={send}
      error={error}
      suggestions={suggestions}
      isWaiting={status === "submitted"}
    />
  );
}
