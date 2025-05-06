import { RecipeMetadata } from '@/lib/types'
import { Button } from '../ui/button'
import { usePlanRecipe } from '@/lib/api/hooks/recipes'
import { Heart, Calendar, CheckCircle, Loader2 } from 'lucide-react'
import { routes } from '@/lib/routes'
import { RecipeCardBase } from '@/components/recipes/shared/recipe-card-base'

interface RecipeMetadataCardProps {
  recipe: RecipeMetadata
}

export function RecipeMetadataCard({ recipe }: RecipeMetadataCardProps) {
  const isPlanned =
    recipe.plannedMeals &&
    recipe.plannedMeals?.some((meal) => meal.status === 'PLANNED')

  const { mutate: planRecipe, isPending: isPlanning } = usePlanRecipe({
    id: recipe.id,
  })

  const headerIcon = recipe.isFavorite ? (
    <Heart className="h-5 w-5 text-rose-400 fill-rose-400 flex-shrink-0 animate-pulse-subtle" />
  ) : null

  const actionContent = (
    <Button
      className="w-full bg-lime-600 text-white hover:bg-lime-700"
      disabled={isPlanned || isPlanning}
      onClick={(e) => {
        e.preventDefault()
        planRecipe()
      }}
    >
      {isPlanned ? (
        <div className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4 mr-2" />
          <span>Meal Planned</span>
        </div>
      ) : (
        <>
          {isPlanning ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Calendar className="h-4 w-4 mr-2" />
          )}
          Plan Meal
        </>
      )}
    </Button>
  )

  return (
    <RecipeCardBase
      metadata={recipe}
      linkHref={routes.recipes.byId(recipe.id)}
      headerIcon={headerIcon}
      actionContent={actionContent}
    />
  )
}
