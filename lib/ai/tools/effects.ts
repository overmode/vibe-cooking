// TODO tighter typing of results
import { QueryClient } from '@tanstack/react-query'
import { Message } from 'ai'
import { ToolResult, ToolResultSuccess } from '@/lib/ai/tools/types'
import { queryKeys } from '@/lib/api/query-keys'

type ToolEffect = (
  queryClient: QueryClient,
  result: ToolResult<unknown>
) => void

function hasId(
  result: ToolResult<unknown>
): result is ToolResultSuccess<{ id: string }> {
  return (
    result.success &&
    typeof result.data === 'object' &&
    result.data !== null &&
    'id' in result.data
  )
}

export const toolEffects: Record<string, ToolEffect> = {
  createPlannedMealTool: (qc) =>
    qc.invalidateQueries({ queryKey: queryKeys.plannedMeals.all }),

  updatePlannedMealTool: (qc, result) => {
    qc.invalidateQueries({ queryKey: queryKeys.plannedMeals.all })
    if (hasId(result)) {
      qc.invalidateQueries({
        queryKey: queryKeys.plannedMeals.byId(result.data.id),
      })
    }
  },

  deletePlannedMealTool: (qc, result) => {
    qc.invalidateQueries({ queryKey: queryKeys.plannedMeals.all })
    if (hasId(result)) {
      qc.invalidateQueries({
        queryKey: queryKeys.plannedMeals.byId(result.data.id),
      })
    }
  },

  updateRecipeTool: (qc, result) => {
    qc.invalidateQueries({ queryKey: queryKeys.recipes.all })
    if (hasId(result)) {
      qc.invalidateQueries({ queryKey: queryKeys.recipes.byId(result.data.id) })
    }
  },

  // Because delete operations on recipes cascade to planned meals
  deleteRecipeTool: (qc) => {
    qc.invalidateQueries({ queryKey: queryKeys.plannedMeals.all })
    qc.invalidateQueries({ queryKey: queryKeys.recipes.all })
  },
}

// Trigger tool effects when a message contains a tool invocation result
export const triggerToolEffects = (
  message: Message,
  queryClient: QueryClient
) => {
  if (!message.parts) {
    return
  }
  for (const part of message.parts) {
    if (
      part.type === 'tool-invocation' &&
      part.toolInvocation.state === 'result'
    ) {
      const toolName = part.toolInvocation.toolName
      const result = part.toolInvocation.result
      if (toolName in toolEffects) {
        toolEffects[toolName](queryClient, result)
      }
    }
  }
}
