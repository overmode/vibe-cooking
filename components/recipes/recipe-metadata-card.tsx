import { RecipeMetadata } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Heart, Calendar, Users, ChefHat } from 'lucide-react'
import Link from 'next/link'

interface RecipeMetadataCardProps {
  recipe: RecipeMetadata
}

export function RecipeMetadataCard({ recipe }: RecipeMetadataCardProps) {
  const isPlanned =
    recipe.plannedMeals &&
    recipe.plannedMeals?.some((meal) => meal.status === 'PLANNED')
  const cookedCount = recipe.cookCount

  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="transition-transform hover:scale-[1.02] focus:scale-[1.02] focus:outline-none"
    >
      <Card className="h-full overflow-hidden border-lime-100 shadow-md hover:shadow-lg transition-shadow duration-200">
        <div className="bg-gradient-to-r from-lime-50 to-lime-100 p-4 flex flex-col h-full">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-xl font-semibold line-clamp-2 text-lime-900 h-14">
              {recipe.name}
            </h3>
            {recipe.isFavorite && (
              <Heart className="h-5 w-5 text-rose-400 fill-rose-400 flex-shrink-0 animate-pulse-subtle" />
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2 min-h-8">
            {recipe.duration && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-lime-100 text-lime-700 hover:bg-lime-200"
              >
                <Clock className="h-3 w-3" />
                <span>{recipe.duration} min</span>
              </Badge>
            )}
            {recipe.difficulty && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-lime-100 text-lime-700 hover:bg-lime-200"
              >
                <span>Difficulty: {recipe.difficulty}/10</span>
              </Badge>
            )}
            {recipe.servings > 0 && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-lime-100 text-lime-700 hover:bg-lime-200"
              >
                <Users className="h-3 w-3" />
                <span>{recipe.servings} servings</span>
              </Badge>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center text-xs gap-x-4 gap-y-2 min-h-6">
            <div className="flex items-center gap-1 text-lime-700/80">
              <ChefHat className="h-3.5 w-3.5" />
              {cookedCount > 0 ? (
                <span className="font-medium">Cooked {cookedCount}x</span>
              ) : (
                <span className="text-lime-600/60 italic">Not cooked yet</span>
              )}
            </div>

            {isPlanned && (
              <div className="flex items-center gap-1 text-emerald-600/90 font-medium">
                <Calendar className="h-3.5 w-3.5" />
                <span>Planned</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
