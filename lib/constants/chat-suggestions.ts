import { ChatSuggestion } from '@/lib/types'
import { messagePresets } from '@/lib/constants/message-presets'

export const chatSuggestions: ChatSuggestion[] = [
  {
    label: '✨ New recipe',
    message: 'Create a new random recipe for me.',
  },
  {
    label: '🎯 Learn my tastes',
    message: messagePresets['about-you'],
  },
] as const
