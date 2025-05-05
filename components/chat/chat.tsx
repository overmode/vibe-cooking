import { ChatInput } from './chat-input'
import { ChatMessagesDisplay } from './chat-messages-display'

import { Message } from 'ai'

interface ChatProps {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function Chat({
  messages,
  input,
  handleInputChange,
  handleSubmit,
}: ChatProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ChatMessagesDisplay messages={messages} />
      </div>

      <div className="sticky bottom-0 border-t bg-background p-2 pb-0">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
