"use client";

import { useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { RecipeViewer } from "@/components/recipes/recipe-viewer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlannedMealWithRecipe } from "@/lib/types";
import { useUpdatePlannedMealStatusMutation } from "@/lib/api/hooks/planned-meals";
import { triggerToolEffects } from "@/lib/ai/tools/effects";
import { useQueryClient } from "@tanstack/react-query";
import { RecipeInstanceStatus } from "@/generated/prisma/browser";
import { CookingCongratulationsDialog } from "@/components/cooking/cooking-congratulations-dialog";
import { ChatCanva } from "@/components/chat/chat-canva";
import { apiRoutes } from "@/lib/api/api-routes";
import { routes } from "@/lib/routes";
import { useUserDietaryPreferences } from "@/lib/api/hooks/preferences";

interface CookingViewProps {
  plannedMealWithRecipe: PlannedMealWithRecipe;
}

export function CookingView({ plannedMealWithRecipe }: CookingViewProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: userDietaryPreferences } = useUserDietaryPreferences({});

  const initialMessages = useMemo<UIMessage[]>(
    () => [
      {
        id: "cooking-intro",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `I'll guide you through cooking ${plannedMealWithRecipe.name}. Let me know if you have questions at any step or want to make changes!`,
          },
        ],
      },
    ],
    [plannedMealWithRecipe.name]
  );

  const transport = useMemo(
    () => new DefaultChatTransport({ api: apiRoutes.assistants.cooking }),
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
            plannedMealWithRecipe,
            userDietaryPreferences: userDietaryPreferences?.preferences,
          },
        }
      ),
    [sendMessage, plannedMealWithRecipe, userDietaryPreferences?.preferences]
  );

  const updateCookingStatusMutation = useUpdatePlannedMealStatusMutation({
    options: {
      onError: () => {
        toast.error("Failed to update cooking status.");
      },
    },
  });
  const handleMarkUncooked = () => {
    updateCookingStatusMutation.mutate({
      id: plannedMealWithRecipe.id,
      status: RecipeInstanceStatus.PLANNED,
    });
  };
  const handleMarkCooked = () => {
    updateCookingStatusMutation.mutate({
      id: plannedMealWithRecipe.id,
      status: RecipeInstanceStatus.COOKED,
    });
  };
  const handleGoHome = () => {
    router.push(routes.home);
  };

  const effectiveRecipe = plannedMealWithRecipe;

  const markAsCookedButton = (
    <Button
      onClick={handleMarkCooked}
      disabled={updateCookingStatusMutation.isPending}
      size="sm"
      className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 h-8 px-2 sm:px-3 sm:h-9"
    >
      <Check className="h-4 w-4" />
      <span className="hidden sm:inline">Mark as cooked</span>
    </Button>
  );
  return (
    <div className="flex flex-col h-full">
      {plannedMealWithRecipe.status === RecipeInstanceStatus.COOKED && (
        <CookingCongratulationsDialog
          open={true}
          onOpenChange={() => {}}
          plannedMealWithRecipe={plannedMealWithRecipe}
          onGoHome={handleGoHome}
          onMarkUncooked={handleMarkUncooked}
        />
      )}
      <ChatCanva
        title={effectiveRecipe.name}
        contentNode={<RecipeViewer recipe={effectiveRecipe} />}
        messages={messages}
        sendMessage={send}
        error={error}
        contentTabLabel="Recipe"
        chatTabLabel="Assistant"
        actions={markAsCookedButton}
      />
    </div>
  );
}
