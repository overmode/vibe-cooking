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
    <div className="flex flex-col h-[calc(100vh-8.5rem)]">
      
      <div className="flex-1 overflow-auto">
        <ChatWindow messages={messages} />
      </div>
      
      <div className="border-t mt-auto sticky bottom-0 z-10 bg-background">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
} 