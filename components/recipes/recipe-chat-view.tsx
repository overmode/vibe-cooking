'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { RecipeViewer } from '@/components/recipes/recipe-viewer'
import { CookingChat } from '@/components/cooking/cooking-chat'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Recipe } from '@prisma/client'
import { triggerToolEffects } from '@/lib/ai/tools/effects'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteRecipeById } from '@/lib/api/hooks/recipes'
interface RecipeChatViewProps {
  recipe: Recipe
}

export function RecipeChatView({ recipe }: RecipeChatViewProps) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const deleteRecipeMutation = useDeleteRecipeById({
    id: recipe.id,
    options: {
      onSuccess: () => {
        router.back()
      },
    },
  })
  const [activeTab, setActiveTab] = useState<string>('recipe')

  // Initialize chat with recipe context
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/assistants/recipe',
    body: {
      recipe,
    },
    initialMessages: [
      {
        id: 'recipe-intro',
        content: `I'm here to help you with your recipe! I can answer questions about it or help you make edits. What would you like to do? 🌴`,
        role: 'assistant',
      },
    ],
    // We process the deletion client-side to avoid 404 errors
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === 'deleteRecipeTool') {
        deleteRecipeMutation.mutate()
      }
    },
    onFinish: (message) => {
      // client-side side effects such as cache invalidation
      triggerToolEffects(message, queryClient)

      // Detect recipe deletion and navigate back
      if (
        message.parts?.some(
          (part) =>
            part.type === 'tool-invocation' &&
            part.toolInvocation.toolName === 'deleteRecipeTool'
        )
      ) {
        router.back()
      }
    },
  })

  // Handle navigation back
  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with back button and favorite toggle */}
      <div className="flex justify-between items-center p-2 border-b bg-background sticky top-0 z-10">
        <div className="flex items-center w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-sm font-medium mx-auto">{recipe.name}</h3>
          <div className="w-8"></div> {/* Spacer to balance the layout */}
        </div>
      </div>

      {/* Desktop layout (side by side) */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r h-full overflow-y-auto">
          <RecipeViewer recipe={recipe} />
        </div>
        <div className="w-1/2 h-full overflow-y-auto">
          <CookingChat
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* Mobile layout (tabs) */}
      <div className="md:hidden flex-1 overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="grid grid-cols-2 w-full sticky top-0 z-10">
            <TabsTrigger value="recipe">Recipe</TabsTrigger>
            <TabsTrigger value="chat">Assistant</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-hidden">
            <TabsContent value="recipe" className="h-full overflow-y-auto">
              <RecipeViewer recipe={recipe} />
            </TabsContent>
            <TabsContent value="chat" className="h-full overflow-y-auto">
              <CookingChat
                messages={messages}
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
