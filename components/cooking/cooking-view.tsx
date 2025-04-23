"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { RecipeViewer } from "@/components/cooking/recipe-viewer";
import { CookingChat } from "@/components/cooking/cooking-chat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlannedMealWithRecipe } from "@/lib/types";
import { useMarkAsCookedMutation } from "@/lib/api/hooks/planned-meals";
interface CookingViewProps {
  plannedMealWithRecipe: PlannedMealWithRecipe;
}

export function CookingView({ plannedMealWithRecipe }: CookingViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("recipe");
  
  // Initialize chat with cooking context
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: "cooking-intro",
        content: `I'll guide you through cooking ${plannedMealWithRecipe.overrideName || plannedMealWithRecipe.recipe.name}. Let me know if you have questions at any step!`,
        role: "assistant",
      },
    ],
  });

  // Mark as cooked mutation
  const markAsCookedMutation = useMarkAsCookedMutation({
    id: plannedMealWithRecipe.id,
    options: {
      onSuccess: () => {
        toast.success("Recipe marked as cooked!");
        router.push("/");
    },
      onError: () => {
        toast.error("Failed to mark recipe as cooked");
      },
    },
  });
  // Get the effective recipe data (with overrides)
  const effectiveRecipe = {
    ...plannedMealWithRecipe.recipe,
    name: plannedMealWithRecipe.overrideName || plannedMealWithRecipe.recipe.name,
    ingredients: plannedMealWithRecipe.overrideIngredients?.length 
      ? plannedMealWithRecipe.overrideIngredients 
      : plannedMealWithRecipe.recipe.ingredients,
    instructions: plannedMealWithRecipe.overrideInstructions || plannedMealWithRecipe.recipe.instructions,
    servings: plannedMealWithRecipe.overrideServings || plannedMealWithRecipe.recipe.servings,
    duration: plannedMealWithRecipe.overrideDuration || plannedMealWithRecipe.recipe.duration,
    difficulty: plannedMealWithRecipe.overrideDifficulty || plannedMealWithRecipe.recipe.difficulty,
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header with back button and mark as cooked */}
      <div className="flex justify-between items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={() => markAsCookedMutation.mutate()}
          disabled={markAsCookedMutation.isPending}
          className="gap-2 bg-lime-600 hover:bg-lime-700"
        >
          <Check className="h-4 w-4" />
          Mark as Cooked
        </Button>
      </div>

      {/* Desktop layout (side by side) */}
      <div className="hidden md:flex h-full">
        <div className="w-1/2 border-r overflow-auto">
          <RecipeViewer recipe={effectiveRecipe} />
        </div>
        <div className="w-1/2 flex flex-col">
          <CookingChat 
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* Mobile layout (tabs) */}
      <div className="md:hidden flex flex-col h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="recipe">Recipe</TabsTrigger>
            <TabsTrigger value="chat">Assistant</TabsTrigger>
          </TabsList>
          <TabsContent value="recipe" className="flex-1 overflow-auto">
            <RecipeViewer recipe={effectiveRecipe} />
          </TabsContent>
          <TabsContent value="chat" className="flex-1 flex flex-col">
            <CookingChat 
              messages={messages}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 