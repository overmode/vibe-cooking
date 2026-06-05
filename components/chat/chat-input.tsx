import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SendHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import {
  MAX_USER_MESSAGE_LENGTH,
  MESSAGE_COOLDOWN_DURATION,
  MIN_USER_MESSAGE_LENGTH,
} from '@/lib/constants/app_validation'

interface ChatInputProps {
  input: string
  setInput: (input: string) => void
  onSend: (text: string) => void
  maxLength?: number
}

export function ChatInput({
  input,
  setInput,
  onSend,
  maxLength = MAX_USER_MESSAGE_LENGTH,
}: ChatInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(false)

  useEffect(() => {
    if (cooldown) {
      const timer = setTimeout(
        () => setCooldown(false),
        MESSAGE_COOLDOWN_DURATION
      )
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const submit = () => {
    if (input.length > maxLength) {
      toast.error(`Your message exceeds the ${maxLength} character limit.`)
      return
    }

    if (input.length < MIN_USER_MESSAGE_LENGTH) {
      toast.error(
        `Your message must be at least ${MIN_USER_MESSAGE_LENGTH} characters.`
      )
      return
    }

    if (cooldown || isSubmitting || input.trim().length === 0) {
      return
    }

    setIsSubmitting(true)

    try {
      onSend(input)
      setInput('')
      setCooldown(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submit()
  }

  return (
    <form onSubmit={handleFormSubmit} className="px-4 pb-4">
      <div className="flex gap-2 sm:gap-3 items-end">
        <Textarea
          placeholder="Ask anything"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-10 sm:min-h-14 w-full max-h-48 resize-none"
          rows={1}
          maxLength={maxLength}
        />
        <Button
          type="submit"
          size="icon"
          disabled={input.trim().length === 0 || isSubmitting || cooldown}
          className="h-10 w-10 sm:h-14 sm:w-14 shrink-0 transition-all"
        >
          <SendHorizontal
            className={`h-4 w-4 sm:h-5 sm:w-5 ${
              isSubmitting || cooldown ? 'opacity-50' : ''
            }`}
          />
        </Button>
      </div>
    </form>
  )
}
