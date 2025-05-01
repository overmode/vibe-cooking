'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { RecipeViewer } from '@/components/recipes/recipe-viewer'
import { CookingChat } from '@/components/cooking/cooking-chat'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Check, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PlannedMealWithRecipe } from '@/lib/types'
import { useUpdatePlannedMealStatusMutation } from '@/lib/api/hooks/planned-meals'
import { triggerToolEffects } from '@/lib/ai/tools/effects'
import { useQueryClient } from '@tanstack/react-query'
import { PlannedMealStatus } from '@prisma/client'
import { CookingCongratulationsDialog } from '@/components/cooking/cooking-congratulations-dialog'
import { ToolResult } from '@/lib/ai/tools/types'
interface CookingViewProps {
  plannedMealWithRecipe: PlannedMealWithRecipe
}

export function CookingView({ plannedMealWithRecipe }: CookingViewProps) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('recipe')

  // Initialize chat with cooking context
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/assistants/cooking',
    body: {
      plannedMealWithRecipe,
    },
    initialMessages: [
      {
        id: 'cooking-intro',
        content: `I'll guide you through cooking ${
          plannedMealWithRecipe.overrideName ||
          plannedMealWithRecipe.recipe.name
        }. Let me know if you have questions at any step or want to make changes!`,
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
    },
    onFinish: (message) => {
      // client-side side effects such as cache invalidation
      triggerToolEffects(message, queryClient)
    },
  })

  const updateCookingStatusMutation = useUpdatePlannedMealStatusMutation({
    options: {
      onError: () => {
        toast.error('Failed to update cooking status.')
      },
    },
  })
  const handleMarkUncooked = () => {
    updateCookingStatusMutation.mutate({
      id: plannedMealWithRecipe.id,
      status: PlannedMealStatus.PLANNED,
    })
  }
  const handleMarkCooked = () => {
    updateCookingStatusMutation.mutate({
      id: plannedMealWithRecipe.id,
      status: PlannedMealStatus.COOKED,
    })
  }

  // Handle navigation to home
  const handleGoHome = () => {
    router.push('/')
  }

  console.log(plannedMealWithRecipe)

  // Get the effective recipe data (with overrides)
  const effectiveRecipe = {
    ...plannedMealWithRecipe.recipe,
    name:
      plannedMealWithRecipe.overrideName || plannedMealWithRecipe.recipe.name,
    ingredients: plannedMealWithRecipe.overrideIngredients?.length
      ? plannedMealWithRecipe.overrideIngredients
      : plannedMealWithRecipe.recipe.ingredients,
    instructions:
      plannedMealWithRecipe.overrideInstructions ||
      plannedMealWithRecipe.recipe.instructions,
    servings:
      plannedMealWithRecipe.overrideServings ||
      plannedMealWithRecipe.recipe.servings,
    duration:
      plannedMealWithRecipe.overrideDuration ||
      plannedMealWithRecipe.recipe.duration,
    difficulty:
      plannedMealWithRecipe.overrideDifficulty ||
      plannedMealWithRecipe.recipe.difficulty,
  }

  return (
    <div className="flex flex-col h-full">
      {/* Congratulations Dialog: This is a modal that appears when the meal is cooked */}
      {plannedMealWithRecipe.status === PlannedMealStatus.COOKED && (
        <CookingCongratulationsDialog
          open={true}
          onOpenChange={() => {}}
          plannedMealWithRecipe={plannedMealWithRecipe}
          onGoHome={handleGoHome}
          onMarkUncooked={handleMarkUncooked}
        />
      )}

      {/* Header with back button and mark as cooked */}
      <div className="flex justify-between items-center p-2 border-b bg-background sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGoHome}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-medium">{effectiveRecipe.name}</h3>

        <Button
          onClick={handleMarkCooked}
          disabled={updateCookingStatusMutation.isPending}
          size="sm"
          className="h-9 bg-lime-600 hover:bg-lime-700 px-3"
        >
          <Check className="h-4 w-4 mr-1.5" />
          <span>Mark as cooked</span>
        </Button>
      </div>

      {/* Desktop layout (side by side) */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r h-full overflow-y-auto">
          <RecipeViewer recipe={effectiveRecipe} />
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
              <RecipeViewer recipe={effectiveRecipe} />
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
