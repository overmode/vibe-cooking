import { type RecipeMetadata } from "@/lib/types";
import { RecipeMetadataCard } from "./recipe-metadata-card";

interface RecipeGridViewProps {
  recipes: RecipeMetadata[];
}

export function RecipeGridView({ recipes }: RecipeGridViewProps) {
  return (
    <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(240px,100%),1fr))] gap-4">
      {recipes.map((recipe) => (
        <RecipeMetadataCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
