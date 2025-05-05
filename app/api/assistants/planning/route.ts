import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import {
  createRecipeTool,
  deleteRecipeTool,
  renderRecipePreviewTool,
  getRecipesMetadataTool,
  updateRecipeTool,
  getRecipeByIdTool,
  getPlannedMealsMetadataTool,
  createPlannedMealTool,
  updatePlannedMealTool,
  deletePlannedMealTool,
  getPlannedMealByIdTool,
  getPlannedMealsTool,
  enterCookingModeTool,
} from '@/lib/ai/tools/tools'
import { getPrompt } from '@/lib/ai/prompts'
import { chatLimiter } from '@/lib/rate-limiter'
import { auth } from '@clerk/nextjs/server'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { success } = await chatLimiter.limit(userId)

  if (!success) {
    return new Response('Rate Limit Exceeded', { status: 429 })
  }

  const prompt = await getPrompt({
    promptName: 'planning-assistant',
    promptVars: { date: new Date().toISOString() },
  })

  const result = streamText({
    model: openai('gpt-4.1-mini'),
    system: prompt[0].content,
    maxSteps: 5,
    messages,
    tools: {
      // Recipe crud operations
      getRecipesMetadataTool: getRecipesMetadataTool,
      createRecipeTool: createRecipeTool,
      updateRecipeTool: updateRecipeTool,
      deleteRecipeTool: deleteRecipeTool,
      getRecipeByIdTool: getRecipeByIdTool,

      // Recipe preview
      renderRecipePreviewTool: renderRecipePreviewTool,

      // planned meal crud operations
      getPlannedMealsMetadataTool: getPlannedMealsMetadataTool,
      getPlannedMealsTool: getPlannedMealsTool,
      createPlannedMealTool: createPlannedMealTool,
      updatePlannedMealTool: updatePlannedMealTool,
      deletePlannedMealTool: deletePlannedMealTool,
      getPlannedMealByIdTool: getPlannedMealByIdTool,

      // Cooking mode
      enterCookingModeTool: enterCookingModeTool,
    },
  })

  return result.toDataStreamResponse()
}
