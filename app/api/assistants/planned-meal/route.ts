import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { updatePlannedMealTool } from '@/lib/ai/tools/tools'
import { getPrompt } from '@/lib/ai/prompts'
import { auth } from '@clerk/nextjs/server'
import { chatLimiter } from '@/lib/rate-limiter'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, plannedMeal } = await req.json()

  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { success } = await chatLimiter.limit(userId)

  if (!success) {
    return new Response('Rate Limit Exceeded', { status: 429 })
  }

  if (!plannedMeal) {
    return new Response('Invalid payload: plannedMeal is required', {
      status: 400,
    })
  }

  const prompt = await getPrompt({
    promptName: 'planned-meal-assistant',
    promptVars: {
      date: new Date().toISOString(),
      plannedMeal: JSON.stringify(plannedMeal),
    },
  })

  const result = streamText({
    model: openai('gpt-4.1-mini'),
    system: prompt[0].content,
    maxSteps: 5,
    messages,
    tools: {
      updatePlannedMealTool: updatePlannedMealTool,
    },
  })

  return result.toDataStreamResponse()
}
