"use client";

import { useState } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { useDeleteRecipeById } from "@/lib/api/hooks/recipes";

interface RecipeActionsMenuProps {
  recipeId: string;
  recipeName: string;
}

export function RecipeActionsMenu({
  recipeId,
  recipeName,
}: RecipeActionsMenuProps) {
  const t = useTranslations("recipes");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteRecipeMutation = useDeleteRecipeById({ id: recipeId });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            disabled={deleteRecipeMutation.isPending}
            aria-label={t("options")}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            onClick={() => {
              setShowDeleteDialog(true);
            }}
            className="text-muted-foreground"
          >
            <Trash2 />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationDialog
        title={t("deleteRecipe")}
        itemName={recipeName}
        deleteMutation={deleteRecipeMutation}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
