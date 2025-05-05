'use client'

import { UseChatOptions } from '@ai-sdk/react'
import { RecipeViewer } from '@/components/recipes/recipe-viewer'
import { triggerToolEffects } from '@/lib/ai/tools/effects'
import { useQueryClient } from '@tanstack/react-query'
import { ChatCanva } from '@/components/chat/chat-canva'

import { PlannedMealWithRecipe } from '@/lib/types'
interface PlannedMealChatViewProps {
  plannedMeal: PlannedMealWithRecipe
}

export function PlannedMealChatView({ plannedMeal }: PlannedMealChatViewProps) {
  const queryClient = useQueryClient()

  const chatOptions: UseChatOptions = {
    api: '/api/assistants/planned-meal',
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

  const plannedMealAsRecipe = {
    ...plannedMeal.recipe,
    name: plannedMeal.overrideName || plannedMeal.recipe.name,
    ingredients: plannedMeal.overrideIngredients?.length
      ? plannedMeal.overrideIngredients
      : plannedMeal.recipe.ingredients,
    instructions:
      plannedMeal.overrideInstructions || plannedMeal.recipe.instructions,
    servings: plannedMeal.overrideServings || plannedMeal.recipe.servings,
    duration: plannedMeal.overrideDuration || plannedMeal.recipe.duration,
    difficulty: plannedMeal.overrideDifficulty || plannedMeal.recipe.difficulty,
  }

  return (
    <ChatCanva
      title={plannedMealAsRecipe.name}
      contentNode={<RecipeViewer recipe={plannedMealAsRecipe} />}
      chatOptions={chatOptions}
      contentTabLabel="Planned Meal"
      chatTabLabel="Assistant"
    />
  )
}
