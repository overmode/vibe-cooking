import { RecipeMetadata } from '@/lib/types'
import { routes } from '@/lib/routes'
import { RecipeCardBase } from '@/components/recipes/shared/recipe-card-base'

interface RecipeMetadataCardProps {
  recipe: RecipeMetadata
}

export function RecipeMetadataCard({ recipe }: RecipeMetadataCardProps) {
  return (
    <RecipeCardBase metadata={recipe} linkHref={routes.recipes.byId(recipe.id)} />
  )
}
