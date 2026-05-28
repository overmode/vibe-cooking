import { useState } from "react";
import { UIMessage } from "ai";
import { ChatInput } from "./chat-input";
import { ChatMessagesDisplay } from "./chat-messages-display";
import { ChatSuggestions } from "./chat-suggestions";
import { ChatSuggestion } from "@/lib/types";

interface ChatProps {
  messages: UIMessage[];
  sendMessage: (text: string) => void;
  error?: Error | undefined;
  suggestions?: ChatSuggestion[];
}

export function Chat({ messages, sendMessage, error, suggestions }: ChatProps) {
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ChatMessagesDisplay messages={messages} error={error} />
      </div>

      <div className="w-full">
        {messages.length <= 2 && suggestions && (
          <ChatSuggestions
            suggestions={suggestions}
            onSuggestionClick={(s) => setInput(s.message)}
          />
        )}
      </div>
      <div className="sticky bottom-0 pb-0">
        <ChatInput input={input} setInput={setInput} onSend={sendMessage} />
      </div>
    </div>
  );
}
