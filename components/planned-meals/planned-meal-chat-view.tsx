"use client";

import { useCallback, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { RecipeViewer } from "@/components/recipes/recipe-viewer";
import { triggerToolEffects } from "@/lib/ai/tools/effects";
import { useQueryClient } from "@tanstack/react-query";
import { ChatCanva } from "@/components/chat/chat-canva";
import { useDeletePlannedMealMutation } from "@/lib/api/hooks/planned-meals";
import { routes } from "@/lib/routes";
import { PlannedMealWithRecipe } from "@/lib/types";
import { apiRoutes } from "@/lib/api/api-routes";
import { useRouter } from "next/navigation";
import { plannedMealToRecipe } from "@/lib/utils/plannedMealUtils";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { useUserDietaryPreferences } from "@/lib/api/hooks/preferences";

interface PlannedMealChatViewProps {
  plannedMeal: PlannedMealWithRecipe;
}

const initialMessages: UIMessage[] = [
  {
    id: "planned-meal-intro",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: `I'm here to help you with your planned meal! I can answer questions about it or help you make edits (note that these edits will not propagate to the recipe). What would you like to do? 🌴`,
      },
    ],
  },
];

export function PlannedMealChatView({ plannedMeal }: PlannedMealChatViewProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const deletePlannedMealMutation = useDeletePlannedMealMutation({
    id: plannedMeal.id,
    options: {
      onSuccess: () => {
        router.replace(routes.plannedMeal.all);
      },
    },
  });

  const { data: userDietaryPreferences } = useUserDietaryPreferences({});

  const transport = useMemo(
    () => new DefaultChatTransport({ api: apiRoutes.assistants.plannedMeal }),
    []
  );

  const { messages, sendMessage, error } = useChat({
    transport,
    messages: initialMessages,
    onFinish: ({ message }) => {
      triggerToolEffects(message, queryClient);
    },
  });

  const send = useCallback(
    (text: string) =>
      sendMessage(
        { text },
        {
          body: {
            plannedMeal,
            userDietaryPreferences: userDietaryPreferences?.preferences,
          },
        }
      ),
    [sendMessage, plannedMeal, userDietaryPreferences?.preferences]
  );

  const plannedMealAsRecipe = plannedMealToRecipe(plannedMeal);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteAction = (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDeleteDialog(true)}
        disabled={deletePlannedMealMutation.isPending}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <Trash className="h-4 w-4" />
      </Button>

      <DeleteConfirmationDialog
        title="Delete Planned Meal"
        itemName={plannedMealAsRecipe.name}
        deleteMutation={deletePlannedMealMutation}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        deleteButtonText="Delete Planned Meal"
      />
    </>
  );

  return (
    <ChatCanva
      title={plannedMealAsRecipe.name}
      contentNode={<RecipeViewer recipe={plannedMealAsRecipe} />}
      messages={messages}
      sendMessage={send}
      error={error}
      contentTabLabel="Planned Meal"
      chatTabLabel="Assistant"
      actions={deleteAction}
    />
  );
}
