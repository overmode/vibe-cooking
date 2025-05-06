import { ChatSuggestion } from '@/lib/types'

export const chatSuggestions: ChatSuggestion[] = [
  {
    label: '📅 Help plan the week',
    message: 'Can you help me plan my meals for the week?',
  },
  {
    label: '🛒 What to buy?',
    message: 'What do I need to buy for my planned meals?',
  },
  {
    label: '🍽 What to eat now?',
    message: 'What should I eat right now?',
  },
  {
    label: "🍳 Let's start cooking",
    message: 'I want to cook something right now.',
  },
] as const
