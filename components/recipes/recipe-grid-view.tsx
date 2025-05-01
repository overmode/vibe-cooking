import { RecipeMetadata } from "@/lib/types";
import { RecipeMetadataCard } from "./recipe-metadata-card";

interface RecipeGridViewProps {
  recipes: RecipeMetadata[];
}

export function RecipeGridView({ recipes }: RecipeGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeMetadataCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
} 