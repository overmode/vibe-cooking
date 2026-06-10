"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { v7 as uuidv7 } from "uuid";
import { useRouter, useSearchParams } from "next/navigation";
import { chatSuggestions } from "@/lib/constants/chat-suggestions";
import { triggerToolEffects } from "@/lib/ai/tools/effects";
import { useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "@/lib/api/api-routes";
import { Chat } from "@/components/chat/chat";
import { type AppContext } from "@/lib/ai/app-context";
import { routes } from "@/lib/routes";
import {
  MESSAGE_PRESET_PARAM,
  messagePresets,
  isMessagePresetId,
} from "@/lib/constants/message-presets";

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

function HomeContent() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasTriggeredPreset = useRef(false);
  const [threadId] = useState(() => uuidv7());

  const transport = useMemo(
    () => new DefaultChatTransport({ api: apiRoutes.assistant }),
    []
  );

  const { messages, sendMessage, error, status } = useChat({
    transport,
    messages: initialMessages,
    generateId: uuidv7,
    onFinish: ({ message }) => {
      triggerToolEffects(message, queryClient);
    },
  });

  const send = useCallback(
    (text: string) => {
      const appContext: AppContext = { kind: "mainAssistant" };
      void sendMessage({ text }, { body: { appContext, threadId } });
    },
    [sendMessage, threadId]
  );

  useEffect(() => {
    if (hasTriggeredPreset.current) return;

    const presetId = searchParams.get(MESSAGE_PRESET_PARAM);
    if (!presetId || !isMessagePresetId(presetId)) return;

    hasTriggeredPreset.current = true;
    router.replace(routes.home);
    send(messagePresets[presetId]);
  }, [searchParams, router, send]);

  return (
    <Chat
      messages={messages}
      sendMessage={send}
      error={error}
      suggestions={chatSuggestions}
      isWaiting={status === "submitted"}
    />
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
