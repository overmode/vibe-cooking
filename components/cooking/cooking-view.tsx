'use client'

import { RecipeViewer } from '@/components/recipes/recipe-viewer'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PlannedMealWithRecipe } from '@/lib/types'
import { useUpdatePlannedMealStatusMutation } from '@/lib/api/hooks/planned-meals'
import { triggerToolEffects } from '@/lib/ai/tools/effects'
import { useQueryClient } from '@tanstack/react-query'
import { PlannedMealStatus } from '@prisma/client'
import { CookingCongratulationsDialog } from '@/components/cooking/cooking-congratulations-dialog'
import { ToolResult } from '@/lib/ai/tools/types'
import { ChatCanva } from '@/components/chat/chat-canva'
import { plannedMealToRecipe } from '@/lib/utils/plannedMealUtils'
import { UseChatOptions } from '@ai-sdk/react'
import { apiRoutes } from '@/lib/api/api-routes'
import { routes } from '@/lib/routes'
interface CookingViewProps {
  plannedMealWithRecipe: PlannedMealWithRecipe
}

export function CookingView({ plannedMealWithRecipe }: CookingViewProps) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const chatOptions: UseChatOptions = {
    api: apiRoutes.assistants.cooking,
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
  }

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
  const handleGoHome = () => {
    router.push(routes.home)
  }

  // Get the effective recipe data (with overrides)
  const effectiveRecipe = plannedMealToRecipe(plannedMealWithRecipe)

  const markAsCookedButton = (
    <Button
      onClick={handleMarkCooked}
      disabled={updateCookingStatusMutation.isPending}
      size="sm"
      className="bg-lime-600 hover:bg-lime-700 text-white gap-1.5 h-8 px-2 sm:px-3 sm:h-9"
    >
      <Check className="h-4 w-4" />
      <span className="hidden sm:inline">Mark as cooked</span>
    </Button>
  )
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
      <ChatCanva
        title={effectiveRecipe.name}
        contentNode={<RecipeViewer recipe={effectiveRecipe} />}
        chatOptions={chatOptions}
        contentTabLabel="Recipe"
        chatTabLabel="Assistant"
        actions={markAsCookedButton}
      />
    </div>
  )
}
