import { type RecipeMetadata } from "@/lib/types";
import { routes } from "@/lib/routes";
import { RecipeCardBase } from "@/components/recipes/shared/recipe-card-base";
import { RecipeActionsMenu } from "@/components/recipes/recipe-actions-menu";

interface RecipeMetadataCardProps {
  recipe: RecipeMetadata;
}

export function RecipeMetadataCard({ recipe }: RecipeMetadataCardProps) {
  return (
    <RecipeCardBase
      metadata={recipe}
      linkHref={routes.recipes.byId(recipe.id)}
      actions={
        <RecipeActionsMenu recipeId={recipe.id} recipeName={recipe.name} />
      }
    />
  );
}
