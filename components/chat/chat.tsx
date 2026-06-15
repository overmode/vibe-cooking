import { useState } from "react";
import { type UIMessage } from "ai";
import { ChatInput } from "./chat-input";
import { ChatMessagesDisplay } from "./chat-messages-display";
import { ChatSendProvider } from "./chat-send-context";
import { ChatSuggestions } from "./chat-suggestions";
import { type ChatSuggestion } from "@/lib/types";

interface ChatProps {
  messages: UIMessage[];
  sendMessage: (text: string) => void;
  error?: Error | undefined;
  suggestions?: ChatSuggestion[];
  isWaiting: boolean;
}

export function Chat({
  messages,
  sendMessage,
  error,
  suggestions,
  isWaiting,
}: ChatProps) {
  const [input, setInput] = useState("");

  return (
    <ChatSendProvider sendMessage={sendMessage}>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <ChatMessagesDisplay
            messages={messages}
            error={error}
            isWaiting={isWaiting}
          />
        </div>

        <div className="w-full">
          {messages.length <= 2 && suggestions && (
            <ChatSuggestions
              suggestions={suggestions}
              onSuggestionClick={(s) => {
                sendMessage(s.message);
              }}
            />
          )}
        </div>
        <div className="sticky bottom-0 pb-0">
          <ChatInput input={input} setInput={setInput} onSend={sendMessage} />
        </div>
      </div>
    </ChatSendProvider>
  );
}
