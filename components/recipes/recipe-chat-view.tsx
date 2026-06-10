"use client";

import { useCallback, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, generateId, type UIMessage } from "ai";
import { RecipeViewer } from "@/components/recipes/recipe-viewer";
import { useRouter } from "next/navigation";
import { type Recipe } from "@/lib/types";
import { triggerToolEffects } from "@/lib/ai/tools/effects";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteRecipeById } from "@/lib/api/hooks/recipes";
import { ChatCanva } from "@/components/chat/chat-canva";
import { apiRoutes } from "@/lib/api/api-routes";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { routes } from "@/lib/routes";
import { type AppContext } from "@/lib/ai/app-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RecipeChatViewProps {
  recipe: Recipe;
}

const initialMessages: UIMessage[] = [
  {
    id: "recipe-intro",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: `I'm here to help you with your recipe! I can answer questions about it or help you make edits. What would you like to do? 🌴`,
      },
    ],
  },
];

export function RecipeChatView({ recipe }: RecipeChatViewProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const deleteRecipeMutation = useDeleteRecipeById({
    id: recipe.id,
    options: {
      onSuccess: () => {
        router.replace(routes.recipes.all);
      },
    },
  });

  const transport = useMemo(
    () => new DefaultChatTransport({ api: apiRoutes.assistant }),
    []
  );

  // One thread per mount; resume-latest-per-recipe is deferred to PR3.
  const [threadId] = useState(generateId);

  const { messages, sendMessage, error, status } = useChat({
    transport,
    messages: initialMessages,
    onToolCall: ({ toolCall }) => {
      if (toolCall.toolName === "deleteRecipeTool") {
        deleteRecipeMutation.mutate();
      }
    },
    onFinish: ({ message }) => {
      triggerToolEffects(message, queryClient);

      // Detect recipe deletion and navigate back
      if (
        message.parts?.some(
          (part) =>
            part.type === "tool-deleteRecipeTool" &&
            "state" in part &&
            part.state === "output-available"
        )
      ) {
        router.back();
      }
    },
  });

  const send = useCallback(
    (text: string) => {
      const appContext: AppContext = {
        kind: "recipeView",
        recipeId: recipe.id,
      };
      void sendMessage({ text }, { body: { appContext, threadId } });
    },
    [sendMessage, recipe.id, threadId]
  );

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const recipeMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          disabled={deleteRecipeMutation.isPending}
          aria-label="Recipe options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem
          onClick={() => setShowDeleteDialog(true)}
          className="text-muted-foreground"
        >
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <ChatCanva
        contentNode={<RecipeViewer recipe={recipe} actions={recipeMenu} />}
        contentActions={recipeMenu}
        messages={messages}
        sendMessage={send}
        error={error}
        contentTabLabel="Recipe"
        chatTabLabel="Assistant"
        isWaiting={status === 'submitted'}
      />

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
}
