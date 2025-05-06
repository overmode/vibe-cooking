import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { updatePlannedMealTool } from '@/lib/ai/tools/tools'
import { getPrompt } from '@/lib/ai/prompts'
import { validateAssistantsRequest } from '@/app/api/assistants/validate-assistant-request'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, plannedMeal } = await req.json()

  const { error } = await validateAssistantsRequest(messages)
  if (error) {
    return error
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
