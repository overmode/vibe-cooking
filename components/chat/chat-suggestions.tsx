import { Button } from '@/components/ui/button'
import { ChatSuggestion } from '@/lib/types'

interface ChatSuggestionsProps {
  suggestions: ChatSuggestion[]
  onSuggestionClick: (suggestion: ChatSuggestion) => void
}

export function ChatSuggestions({
  suggestions,
  onSuggestionClick,
}: ChatSuggestionsProps) {
  return (
    <div className="w-full px-4 py-3 flex flex-wrap gap-2 justify-center">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion.label}
        </Button>
      ))}
    </div>
  )
}
