import { PlannedMeal, PlannedMealStatus } from "@prisma/client";
import { PlannedMealWithRecipe } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Home, X } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import { UpdatePlannedMealInput } from "@/lib/validators/plannedMeals";

interface CookingCongratulationsDialogProps {
  plannedMealWithRecipe: PlannedMealWithRecipe;
  updateCookingStatusMutation: UseMutationResult<PlannedMeal, Error, UpdatePlannedMealInput, unknown>;
  onGoHome: () => void;
}

export function CookingCongratulationsDialog({
  plannedMealWithRecipe,
  updateCookingStatusMutation,
  onGoHome,
}: CookingCongratulationsDialogProps) {
  const handleMarkUncooked = () => {
    updateCookingStatusMutation.mutate({
      id: plannedMealWithRecipe.id,
      status: PlannedMealStatus.PLANNED,
    });
  };

  return (
    <Dialog
      open={plannedMealWithRecipe.status === PlannedMealStatus.COOKED}
      onOpenChange={(open) => {
        if (!open) {
          // If dialog is being closed, reset the status to PLANNED
          updateCookingStatusMutation.mutate({
            id: plannedMealWithRecipe.id,
            status: PlannedMealStatus.PLANNED,
          });
        }
      }}
    >
      <DialogContent className="sm:max-w-md"
      hideCloseButton
      onEscapeKeyDown={(e) => {
        e.preventDefault();
      }}
      onInteractOutside={(e) => {
        e.preventDefault();
      }}>
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Congratulations! 🎉
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            <span className="font-medium text-lime-600 dark:text-lime-500">
              You&apos;ve successfully cooked{" "}
              {plannedMealWithRecipe.overrideName ||
                plannedMealWithRecipe.recipe.name}
              !
            </span>
            <div className="mt-2">
              What would you like to do next?
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={handleMarkUncooked}
            disabled={updateCookingStatusMutation.isPending}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Mark as Uncooked
          </Button>
          <Button
            onClick={onGoHome}
            className="gap-2 bg-lime-600 hover:bg-lime-700"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 