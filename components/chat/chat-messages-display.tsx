import { type UIMessage } from 'ai'
import { AnimatedDots, ChatMessage } from './chat-message'
import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { MAX_MESSAGES_PER_DAY } from '@/lib/constants/app_validation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ChatMessagesDisplayProps {
  messages: UIMessage[]
  error?: Error
  isWaiting: boolean
}

export function ChatMessagesDisplay({
  messages,
  error,
  isWaiting,
}: ChatMessagesDisplayProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView()
  }, [messages, isWaiting])

  return (
    <ScrollArea className="h-full">
      <div className="grow p-4 space-y-4 rounded-lg">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isWaiting && (
          <div className="flex w-full mt-4">
            <div className="flex w-full items-center gap-3 max-w-[95%]">
              <Avatar className="h-8 w-8 shrink-0 self-center">
                <AvatarImage src="/logo.svg" alt="Vibe Cooking Logo" />
                <AvatarFallback className="bg-accent text-accent-foreground">
                  🍳
                </AvatarFallback>
              </Avatar>
              <div className="rounded-lg px-4 py-3 w-fit">
                <AnimatedDots />
              </div>
            </div>
          </div>
        )}

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
