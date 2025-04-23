"use client";

import { useChat } from "@ai-sdk/react";
import { ChatWindow } from "@/components/chat/chat-window";
import { ChatInput } from "@/components/chat/chat-input";
import { ToolResult } from "@/lib/types";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
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
  });

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-hidden p-4">
        <ChatWindow messages={messages} />
      </div>
      <div className="w-full">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
