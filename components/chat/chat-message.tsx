import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Message } from '@ai-sdk/react'
import { MemoizedMarkdown } from '@/components/chat/memoized-markdown'
import { renderToolInvocation } from '@/lib/ai/tools/renderer'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isLoading =
    !message.parts ||
    message.parts.length === 0 ||
    message.parts.every(
      (part) => part.type !== 'text' && part.type !== 'tool-invocation'
    )

  return (
    <div className="flex w-full mt-4">
      <div
        className={cn(
          'flex w-full items-start gap-3',
          isUser ? 'ml-auto max-w-[80%]' : 'max-w-[95%]'
        )}
      >
        {!isUser && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src="/logo-coconut-bowl.png" alt="Vibe Cooking Logo" />
            <AvatarFallback className="bg-lime-200 text-primary-foreground">
              🍳
            </AvatarFallback>
          </Avatar>
        )}

        <div className="flex flex-col gap-2 w-full">
          {isLoading && (
            <div className="rounded-lg px-4 py-3 w-fit">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2 h-2 bg-primary rounded-full opacity-75 animate-pulse"
                  style={{ animationDuration: '1s', animationDelay: '0ms' }}
                ></span>
                <span
                  className="inline-block w-2 h-2 bg-primary rounded-full opacity-75 animate-pulse"
                  style={{ animationDuration: '1s', animationDelay: '300ms' }}
                ></span>
                <span
                  className="inline-block w-2 h-2 bg-primary rounded-full opacity-75 animate-pulse"
                  style={{ animationDuration: '1s', animationDelay: '600ms' }}
                ></span>
              </div>
            </div>
          )}
          {message.parts?.map((part, index) => {
            let content = null

            switch (part.type) {
              case 'text':
                content = (
                  <MemoizedMarkdown content={part.text} id={message.id} />
                )
                break
              case 'tool-invocation':
                content = renderToolInvocation(part.toolInvocation)
                break
            }

            return content && message.parts ? (
              <div
                key={index}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm',
                  isUser
                    ? 'bg-primary text-primary-foreground ml-auto w-fit'
                    : part.type === 'tool-invocation' || isLoading
                    ? 'w-full'
                    : 'bg-muted w-fit'
                )}
              >
                {content}
              </div>
            ) : null
          })}
        </div>
      </div>
    </div>
  )
}
