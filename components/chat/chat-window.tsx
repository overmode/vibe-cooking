import { Message } from "ai";
import { ChatMessage } from "./chat-message";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatWindowProps {
  messages: Message[];
}

export function ChatWindow({ messages }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Dynamic height calculation to account for suggestions
  const showSuggestions = messages.length <= 2;

  return (
    <ScrollArea
      className={`h-[calc(100vh-${showSuggestions ? "20rem" : "16rem"})]`}
    >
      <div className="flex-grow p-4 space-y-4 rounded-lg">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
