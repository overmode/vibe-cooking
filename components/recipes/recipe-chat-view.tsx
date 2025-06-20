"use client";

import { UseChatOptions } from "@ai-sdk/react";
import { RecipeViewer } from "@/components/recipes/recipe-viewer";
import { useRouter } from "next/navigation";
import { Recipe } from "@prisma/client";
import { triggerToolEffects } from "@/lib/ai/tools/effects";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteRecipeById } from "@/lib/api/hooks/recipes";
import { ChatCanva } from "@/components/chat/chat-canva";
import { apiRoutes } from "@/lib/api/api-routes";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { routes } from "@/lib/routes";
import { useUserDietaryPreferences } from "@/lib/api/hooks/preferences";

interface RecipeChatViewProps {
  recipe: Recipe;
}

export function RecipeChatView({ recipe }: RecipeChatViewProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const deleteRecipeMutation = useDeleteRecipeById({
    id: recipe.id,
    options: {
      onSuccess: () => {
        // Use replace instead of push to prevent back navigation to deleted recipe
        router.replace(routes.recipes.all);
      },
    },
  });

  const { data: userDietaryPreferences } = useUserDietaryPreferences({});

  const chatOptions: UseChatOptions = {
    api: apiRoutes.assistants.recipe,
    body: {
      recipe,
      userDietaryPreferences: userDietaryPreferences?.preferences,
    },
    initialMessages: [
      {
        id: "recipe-intro",
        content: `I'm here to help you with your recipe! I can answer questions about it or help you make edits. What would you like to do? 🌴`,
        role: "assistant",
      },
    ],
    // We process the deletion client-side to avoid 404 errors
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "deleteRecipeTool") {
        deleteRecipeMutation.mutate();
      }
    },
    onFinish: (message) => {
      // client-side side effects such as cache invalidation
      triggerToolEffects(message, queryClient);

      // Detect recipe deletion and navigate back
      if (
        message.parts?.some(
          (part) =>
            part.type === "tool-invocation" &&
            part.toolInvocation.toolName === "deleteRecipeTool"
        )
      ) {
        router.back();
      }
    },
  };

  // Add delete action
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteAction = (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDeleteDialog(true)}
        disabled={deleteRecipeMutation.isPending}
        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 dark:hover:bg-destructive/20"
      >
        <Trash className="h-4 w-4" />
      </Button>

      <DeleteConfirmationDialog
        title="Delete Recipe"
        itemName={recipe.name}
        deleteMutation={deleteRecipeMutation}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        deleteButtonText="Delete Recipe"
      />
    </>
  );

  return (
    <ChatCanva
      title={recipe.name}
      contentNode={<RecipeViewer recipe={recipe} />}
      chatOptions={chatOptions}
      contentTabLabel="Recipe"
      chatTabLabel="Assistant"
      actions={deleteAction}
    />
  );
}
