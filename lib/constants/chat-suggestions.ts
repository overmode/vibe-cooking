import { type ChatSuggestion } from '@/lib/types'
import { messagePresets } from '@/lib/constants/message-presets'

export const chatSuggestions: ChatSuggestion[] = [
  {
    label: '🎲 Quick meal',
    message: 'Suggest a quick meal I can make.',
  },
  {
    label: '🍳 Brainstorm a recipe',
    message:
      "I want to create a new recipe with you — ask me what I'm in the mood for.",
  },
  {
    label: '🎯 Learn my tastes',
    message: messagePresets['about-you'],
  },
] as const

export const recipeChatSuggestions: ChatSuggestion[] = [
  {
    label: '🧑‍🍳 Suggest an upgrade',
    message: 'Suggest an upgrade to this recipe.',
  },
] as const
