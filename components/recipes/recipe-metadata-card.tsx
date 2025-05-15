import { RecipeMetadata } from '@/lib/types'
import { Button } from '../ui/button'
import { usePlanRecipe } from '@/lib/api/hooks/recipes'
import { Calendar, CheckCircle2, Loader2 } from 'lucide-react'
import { routes } from '@/lib/routes'
import { RecipeCardBase } from '@/components/recipes/shared/recipe-card-base'

interface RecipeMetadataCardProps {
  recipe: RecipeMetadata
}

export function RecipeMetadataCard({ recipe }: RecipeMetadataCardProps) {
  const isPlanned =
    recipe.plannedMeals &&
    recipe.plannedMeals?.some((meal) => meal.status === 'PLANNED')

  const { mutate: planRecipe, isPending: isPlanning } = usePlanRecipe()

  const actionContent = (
    <Button
      className="w-full bg-primary/85 text-primary-foreground hover:bg-primary/95 shadow-sm transition-all"
      disabled={isPlanned || isPlanning}
      onClick={(e) => {
        e.preventDefault()
        planRecipe(recipe.id)
      }}
    >
      {isPlanned ? (
        <div className="flex items-center gap-1">
          <CheckCircle2 className="h-4 w-4 mr-2" />
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
      actionContent={actionContent}
    />
  )
}
