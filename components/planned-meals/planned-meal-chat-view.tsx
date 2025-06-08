'use client'

import { UseChatOptions } from '@ai-sdk/react'
import { RecipeViewer } from '@/components/recipes/recipe-viewer'
import { triggerToolEffects } from '@/lib/ai/tools/effects'
import { useQueryClient } from '@tanstack/react-query'
import { ChatCanva } from '@/components/chat/chat-canva'
import { useDeletePlannedMealMutation } from '@/lib/api/hooks/planned-meals'
import { routes } from '@/lib/routes'
import { PlannedMealWithRecipe } from '@/lib/types'
import { apiRoutes } from '@/lib/api/api-routes'
import { useRouter } from 'next/navigation'
import { plannedMealToRecipe } from '@/lib/utils/plannedMealUtils'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog'

interface PlannedMealChatViewProps {
  plannedMeal: PlannedMealWithRecipe
}

export function PlannedMealChatView({ plannedMeal }: PlannedMealChatViewProps) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const deletePlannedMealMutation = useDeletePlannedMealMutation({
    id: plannedMeal.id,
    options: {
      onSuccess: () => {
        // Use replace instead of push to prevent back navigation to deleted planned meal
        router.replace(routes.plannedMeal.all)
      },
    },
  })
  const chatOptions: UseChatOptions = {
    api: apiRoutes.assistants.plannedMeal,
    body: {
      plannedMeal,
    },
    initialMessages: [
      {
        id: 'planned-meal-intro',
        content: `I'm here to help you with your planned meal! I can answer questions about it or help you make edits (note that these edits will not propagate to the recipe). What would you like to do? 🌴`,
        role: 'assistant',
      },
    ],
    onFinish: (message) => {
      // client-side side effects such as cache invalidation
      triggerToolEffects(message, queryClient)
    },
  }

  const plannedMealAsRecipe = plannedMealToRecipe(plannedMeal)

  // Delete action
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const deleteAction = (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDeleteDialog(true)}
        disabled={deletePlannedMealMutation.isPending}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <Trash className="h-4 w-4" />
      </Button>

      <DeleteConfirmationDialog
        title="Delete Planned Meal"
        itemName={plannedMealAsRecipe.name}
        deleteMutation={deletePlannedMealMutation}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        deleteButtonText="Delete Planned Meal"
      />
    </>
  )

  return (
    <ChatCanva
      title={plannedMealAsRecipe.name}
      contentNode={<RecipeViewer recipe={plannedMealAsRecipe} />}
      chatOptions={chatOptions}
      contentTabLabel="Planned Meal"
      chatTabLabel="Assistant"
      actions={deleteAction}
    />
  )
}
