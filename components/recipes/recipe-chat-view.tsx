"use client";

import { useCallback, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { type UIMessage } from "ai";
import { v7 as uuidv7 } from "uuid";
import { RecipeViewer } from "@/components/recipes/recipe-viewer";
import { useRouter } from "next/navigation";
import { type Recipe } from "@/lib/types";
import { triggerToolEffects } from "@/lib/ai/tools/effects";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteRecipeById } from "@/lib/api/hooks/recipes";
import { ChatCanva } from "@/components/chat/chat-canva";
import { useRecipeChatSuggestions } from "@/lib/hooks/use-chat-suggestions";
import { createAssistantTransport } from "@/components/chat/assistant-transport";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
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

export function RecipeChatView({ recipe }: RecipeChatViewProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations("recipes");
  const tChat = useTranslations("chat");
  const suggestions = useRecipeChatSuggestions();

  // Display-only intro; prepended at render so it tracks the active locale
  // instead of being frozen into useChat's state at mount.
  const introMessage: UIMessage = useMemo(
    () => ({
      id: "recipe-intro",
      role: "assistant",
      parts: [{ type: "text", text: tChat("recipeIntro") }],
    }),
    [tChat]
  );
  const deleteRecipeMutation = useDeleteRecipeById({
    id: recipe.id,
    options: {
      onSuccess: () => {
        router.replace(routes.recipes.all);
      },
    },
  });

  const transport = useMemo(() => createAssistantTransport(), []);

  // Fresh chat each mount; this view doesn't resume a prior conversation.
  const [threadId] = useState(() => uuidv7());

  const { messages, sendMessage, error, status } = useChat({
    transport,
    generateId: uuidv7,
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

  const displayMessages = useMemo(
    () => [introMessage, ...messages],
    [introMessage, messages]
  );

  const recipeMenu = (
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
          onClick={() => setShowDeleteDialog(true)}
          className="text-muted-foreground"
        >
          <Trash2 />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <ChatCanva
        contentNode={<RecipeViewer recipe={recipe} actions={recipeMenu} />}
        contentActions={recipeMenu}
        messages={displayMessages}
        sendMessage={send}
        error={error}
        contentTabLabel={t("recipeTab")}
        chatTabLabel={t("assistantTab")}
        isWaiting={status === 'submitted'}
        suggestions={suggestions}
      />

      <DeleteConfirmationDialog
        title={t("deleteRecipe")}
        itemName={recipe.name}
        deleteMutation={deleteRecipeMutation}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
