"use client";

import { useChat } from "@ai-sdk/react";
import { ChatWindow } from "@/components/chat/chat-window";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatSuggestions } from "@/components/chat/chat-suggestions";
import { ToolResult } from "@/lib/types";
import { useState } from "react";
import { chatSuggestions } from "@/lib/constants/chat-suggestions";

export default function Home() {
  const [showSuggestions, setShowSuggestions] = useState(true);

  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat({
      initialMessages: [
        {
          id: "1",
          content: "Welcome to Vibe Cooking! How can I help you today? 🍲🌴 ",
          role: "assistant",
        },
      ],
      // run client-side tools that are automatically executed:
      async onToolCall({ toolCall }) {
        if (toolCall.toolName === "renderRecipePreviewTool") {
          return {
            success: true,
            data: "The recipe was successfully rendered",
          } as ToolResult<string>;
        }
      },
      onResponse: () => {
        // Hide suggestions after first user message
        setShowSuggestions(false);
      },
    });

  const handleSuggestionClick = (message: string) => {
    setInput(message);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-hidden p-4">
        <ChatWindow messages={messages} />
      </div>
      <div className="w-full">
        {showSuggestions && messages.length <= 2 && (
          <ChatSuggestions
            suggestions={chatSuggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        )}
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
