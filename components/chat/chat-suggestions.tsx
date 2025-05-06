import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
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
          className={cn(
            'rounded-full px-4 py-2 h-auto text-sm font-medium border-2 hover:bg-accent/50 transition-colors',
            'bg-background/80 backdrop-blur-sm'
          )}
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion.label}
        </Button>
      ))}
    </div>
  )
}
