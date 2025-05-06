import { PlannedMealWithRecipe } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Home, X } from 'lucide-react'

interface CookingCongratulationsDialogProps {
  plannedMealWithRecipe: PlannedMealWithRecipe
  onMarkUncooked: () => void
  onGoHome: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CookingCongratulationsDialog({
  plannedMealWithRecipe,
  onMarkUncooked,
  onGoHome,
  open,
  onOpenChange,
}: CookingCongratulationsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        hideCloseButton
        onEscapeKeyDown={(e) => {
          e.preventDefault()
        }}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Congratulations! 🎉
          </DialogTitle>
          <DialogDescription className="text-center pt-2 flex flex-col gap-2">
            <span className="font-medium text-primary">
              You&apos;ve successfully cooked{' '}
              {plannedMealWithRecipe.overrideName ||
                plannedMealWithRecipe.recipe.name}
              !
            </span>
            <span className="mt-2">What would you like to do next?</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-2 mt-4">
          <Button variant="outline" onClick={onMarkUncooked} className="gap-2">
            <X className="h-4 w-4" />
            Mark as Uncooked
          </Button>
          <Button
            onClick={onGoHome}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
