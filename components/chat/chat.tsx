import { ChatInput } from "./chat-input";
import { ChatMessagesDisplay } from "./chat-messages-display";

import { Message } from "ai";
import { ChatSuggestions } from "./chat-suggestions";
import { ChatSuggestion } from "@/lib/types";

interface ChatProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: Error | undefined;
  suggestions?: ChatSuggestion[];
  handleSuggestionClick?: (suggestion: ChatSuggestion) => void;
}

export function Chat({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  error,
  suggestions,
  handleSuggestionClick,
}: ChatProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ChatMessagesDisplay messages={messages} error={error} />
      </div>

      <div className="w-full">
        {messages.length <= 2 && suggestions && handleSuggestionClick && (
          <ChatSuggestions
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        )}
      </div>
      <div className="sticky bottom-0 pb-0">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
