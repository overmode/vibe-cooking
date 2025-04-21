"use client";

import { useChat } from "@ai-sdk/react";
import { ChatWindow } from "@/components/chat/chat-window";
import { ChatInput } from "@/components/chat/chat-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: [
        {
          id: "1",
          content:
            "Hey, I'm your Vibe Cooking assistant. How can I help you today? 🍲",
          role: "assistant",
        },
      ],
    });

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card className="w-full shadow-sm rounded-xl border border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Welcome to Vibe Cooking 🌴
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-1">
            Your smart assistant is ready to help you plan meals, shop, and
            cook.
          </p>
        </CardHeader>

        <CardContent className="px-4 pb-4 pt-2">
          <div className="max-h-[60vh] overflow-y-auto mb-4 pr-1">
            <ChatWindow messages={messages} />
          </div>

          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
