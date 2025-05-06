import { Message } from 'ai'
import { ChatMessage } from './chat-message'
import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { MAX_MESSAGES_PER_DAY } from '@/lib/constants/app_validation'
interface ChatMessagesDisplayProps {
  messages: Message[]
  error?: Error
}

export function ChatMessagesDisplay({
  messages,
  error,
}: ChatMessagesDisplayProps) {
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

        {error && <ErrorMessage error={error} />}

        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}

function ErrorMessage({ error }: { error: Error }) {
  return (
    <Alert variant="destructive" className="my-4 animate-in fade-in">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message === 'Rate Limit Exceeded'
          ? "You've reached the daily limit of " +
            MAX_MESSAGES_PER_DAY +
            ' messages. Please try again tomorrow.'
          : error.message || 'An error occurred'}
      </AlertDescription>
    </Alert>
  )
}
