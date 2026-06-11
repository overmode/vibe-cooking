"use client";

import { RecipeView } from "@/components/recipes/recipe-view";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRecipesMetadata } from "@/lib/api/hooks/recipes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RecipesPage() {
  const { data: recipesMetadata, isLoading: isLoadingRecipesMetadata, isError: isErrorRecipesMetadata } = useRecipesMetadata();
  if (isLoadingRecipesMetadata) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading recipes...</p>
      </div>    
    );
  }

  if (isErrorRecipesMetadata) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-destructive">Failed to load recipes</p>
        <Button asChild variant="outline" className="mt-4" >
            <Link href="/" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return Home
            </Link>
        </Button>
      </div>
    );
  }

  if (recipesMetadata) {
    return <RecipeView recipeMetadata={recipesMetadata} />;
  }

  return <div>Loading...</div>;
}