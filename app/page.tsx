"use client";

import { useChat } from "@ai-sdk/react";
import { chatSuggestions } from "@/lib/constants/chat-suggestions";
import { triggerToolEffects } from "@/lib/ai/tools/effects";
import { useQueryClient } from "@tanstack/react-query";
import { routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { enterCookingModeDefinition } from "@/lib/ai/tools/definitions";
import { z } from "zod";
import { apiRoutes } from "@/lib/api/api-routes";
import { Chat } from "@/components/chat/chat";
import { ChatSuggestion } from "@/lib/types";
import { useUserDietaryPreferences } from "@/lib/api/hooks/preferences";
export default function Home() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: userDietaryPreferences } = useUserDietaryPreferences({});

  const { messages, input, handleInputChange, handleSubmit, setInput, error } =
    useChat({
      api: apiRoutes.assistants.planning,
      body: {
        userDietaryPreferences: userDietaryPreferences?.preferences,
      },
      initialMessages: [
        {
          id: "1",
          content: "Welcome to Vibe Cooking! How can I help you today? 🌴 ",
          role: "assistant",
        },
      ],
      // run client-side tools that are automatically executed:
      async onToolCall({ toolCall }) {
        if (toolCall.toolName === "enterCookingModeTool") {
          const id = (
            toolCall.args as z.infer<
              typeof enterCookingModeDefinition.parameters
            >
          ).id;
          router.push(routes.plannedMeal.cooking(id));
        }
      },
      onFinish: (message) => {
        // client-side side effects such as cache invalidation
        triggerToolEffects(message, queryClient);
      },
    });

  const handleSuggestionClick = (suggestion: ChatSuggestion) => {
    setInput(suggestion.message);
  };

  return (
    <Chat
      messages={messages}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      error={error}
      suggestions={chatSuggestions}
      handleSuggestionClick={handleSuggestionClick}
    />
  );
}
