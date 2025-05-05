'use client'

import { useChat } from '@ai-sdk/react'
import { ChatMessagesDisplay } from '@/components/chat/chat-messages-display'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatSuggestions } from '@/components/chat/chat-suggestions'
import { ToolResult } from '@/lib/ai/tools/types'
import { chatSuggestions } from '@/lib/constants/chat-suggestions'
import { triggerToolEffects } from '@/lib/ai/tools/effects'
import { useQueryClient } from '@tanstack/react-query'
import { routes } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { enterCookingModeDefinition } from '@/lib/ai/tools/definitions'
import { z } from 'zod'
import { apiRoutes } from '@/lib/api/api-routes'
export default function Home() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat({
      api: apiRoutes.assistants.planning,
      initialMessages: [
        {
          id: '1',
          content: 'Welcome to Vibe Cooking! How can I help you today? 🌴 ',
          role: 'assistant',
        },
      ],
      // run client-side tools that are automatically executed:
      async onToolCall({ toolCall }) {
        if (toolCall.toolName === 'renderRecipePreviewTool') {
          return {
            success: true,
            data: 'The recipe was successfully rendered',
          } as ToolResult<string>
        }
        if (toolCall.toolName === 'enterCookingModeTool') {
          const id = (
            toolCall.args as z.infer<
              typeof enterCookingModeDefinition.parameters
            >
          ).id
          router.push(routes.plannedMeal.cooking(id))
        }
      },
      onFinish: (message) => {
        // client-side side effects such as cache invalidation
        triggerToolEffects(message, queryClient)
      },
    })

  const handleSuggestionClick = (message: string) => {
    setInput(message)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ChatMessagesDisplay messages={messages} />
      </div>
      <div className="w-full">
        {messages.length <= 2 && (
          <ChatSuggestions
            suggestions={chatSuggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        )}
        <div className="sticky bottom-0">
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}
