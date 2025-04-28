import { Message } from "ai";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatWindow } from "@/components/chat/chat-window";

interface CookingChatProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function CookingChat({
  messages,
  input,
  handleInputChange,
  handleSubmit,
}: CookingChatProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ChatWindow messages={messages} />
      </div>
      
      <div className="sticky bottom-0 border-t bg-background p-2 pb-0">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
} 