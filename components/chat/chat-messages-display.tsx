import { Message } from 'ai'
import { ChatMessage } from './chat-message'
import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ChatMessagesDisplayProps {
  messages: Message[]
}

export function ChatMessagesDisplay({ messages }: ChatMessagesDisplayProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <ScrollArea className="h-full">
      <div className="flex-grow p-4 space-y-4 rounded-lg">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}
