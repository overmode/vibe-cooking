import { Message } from "ai";
import { ChatMessage } from "./chat-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
interface ChatWindowProps {
  messages: Message[];
}

export function ChatWindow({ messages }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="h-[600px] pr-4 pt-4">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/20 rounded-lg">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
}
