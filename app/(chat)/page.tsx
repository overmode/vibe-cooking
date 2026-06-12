"use client";

import { Suspense, useState } from "react";
import { v7 as uuidv7 } from "uuid";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useChatSuggestions } from "@/lib/hooks/use-chat-suggestions";
import { AssistantChat } from "@/components/chat/assistant-chat";
import {
  MESSAGE_PRESET_PARAM,
  isMessagePresetId,
} from "@/lib/constants/message-presets";

function HomeContent() {
  // New thread per mount; stamped into the URL on the first turn.
  const [threadId] = useState(() => uuidv7());
  const searchParams = useSearchParams();
  const suggestions = useChatSuggestions();
  const tPresets = useTranslations("presets");

  const presetId = searchParams.get(MESSAGE_PRESET_PARAM);
  const initialPrompt =
    presetId && isMessagePresetId(presetId) ? tPresets(presetId) : undefined;

  return (
    <AssistantChat
      threadId={threadId}
      suggestions={suggestions}
      stampUrl
      initialPrompt={initialPrompt}
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
