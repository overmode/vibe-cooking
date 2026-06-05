import { QueryClient } from '@tanstack/react-query'
import { UIMessage } from 'ai'
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
  updateRecipeTool: (qc, result) => {
    qc.invalidateQueries({ queryKey: queryKeys.recipes.all })
    if (hasId(result)) {
      qc.invalidateQueries({ queryKey: queryKeys.recipes.byId(result.data.id) })
    }
  },

  createRecipeTool: (qc) => {
    qc.invalidateQueries({ queryKey: queryKeys.recipes.all })
  },

  deleteRecipeTool: (qc) => {
    qc.invalidateQueries({ queryKey: queryKeys.recipes.all })
  },

  updateUserProfileTool: (qc) => {
    qc.invalidateQueries({ queryKey: queryKeys.preferences.all })
  },
}

export const triggerToolEffects = (
  message: UIMessage,
  queryClient: QueryClient
) => {
  if (!message.parts) {
    return
  }
  for (const part of message.parts) {
    if (
      part.type.startsWith('tool-') &&
      'state' in part &&
      part.state === 'output-available' &&
      'output' in part
    ) {
      const toolName = part.type.slice('tool-'.length)
      const result = part.output as ToolResult<unknown>
      if (toolName in toolEffects) {
        toolEffects[toolName](queryClient, result)
      }
    }
  }
}
