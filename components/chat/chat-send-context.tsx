"use client";

import { createContext, useContext } from "react";

const ChatSendContext = createContext<((text: string) => void) | null>(null);

export function ChatSendProvider({
  sendMessage,
  children,
}: {
  sendMessage: (text: string) => void;
  children: React.ReactNode;
}) {
  return (
    <ChatSendContext.Provider value={sendMessage}>
      {children}
    </ChatSendContext.Provider>
  );
}

export function useChatSend() {
  return useContext(ChatSendContext);
}
