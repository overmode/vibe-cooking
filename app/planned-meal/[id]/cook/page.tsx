"use client";

import { useParams } from "next/navigation";
import { CookingView } from "@/components/cooking/cooking-view";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePlannedMealWithRecipe } from "@/lib/api/hooks/planned-meals";

export default function CookingPage() {
  const { id } = useParams<{ id: string }>();
  
  const plannedMealWithRecipeQuery = usePlannedMealWithRecipe({id: id as string, options: {
    enabled: !!id,
  }});

  if (plannedMealWithRecipeQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading your cooking session...</p>
      </div>    
    );
  }

  if (plannedMealWithRecipeQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <p className="text-destructive">Failed to load cooking session</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    );
  }

  const plannedMealWithRecipe = plannedMealWithRecipeQuery.data;

  if (!plannedMealWithRecipe) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <p className="text-destructive">Recipe or planned meal not found</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    );
  }

  return <CookingView plannedMealWithRecipe={plannedMealWithRecipe} />;
} 