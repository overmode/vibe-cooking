import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SendHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import {
  MAX_USER_MESSAGE_LENGTH,
  MESSAGE_COOLDOWN_DURATION,
  MIN_USER_MESSAGE_LENGTH,
} from '@/lib/constants/app_validation'
interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  maxLength?: number
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  maxLength = MAX_USER_MESSAGE_LENGTH,
}: ChatInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(false)

  // Reset cooldown after 1 second
  useEffect(() => {
    if (cooldown) {
      const timer = setTimeout(
        () => setCooldown(false),
        MESSAGE_COOLDOWN_DURATION
      )
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Convert the keyboard event to a form event by creating a synthetic event
      const formEvent = {
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>
      handleFormSubmit(formEvent)
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Check if input exceeds max length
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

    // Check if we're in cooldown or already submitting
    if (cooldown || isSubmitting) {
      return
    }

    // Check if input is empty
    if (input.trim().length === 0) {
      return
    }

    setIsSubmitting(true)

    try {
      handleSubmit(e)
      setCooldown(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className="pb-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex flex-col w-full">
        <div className="flex gap-3 items-end">
          <div className="relative w-full">
            <Textarea
              placeholder="Ask anything"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="min-h-[60px] w-full resize-none rounded-xl border-2 focus-visible:ring-1 focus-visible:ring-offset-0 max-h-[200px]"
              rows={1}
              maxLength={maxLength}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={input.trim().length === 0 || isSubmitting || cooldown}
            className="h-[60px] w-[60px] rounded-xl bg-primary hover:bg-primary/90 transition-all"
          >
            <SendHorizontal
              className={`h-5 w-5 ${
                isSubmitting || cooldown ? 'opacity-50' : ''
              }`}
            />
          </Button>
        </div>
      </div>
    </form>
  )
}
