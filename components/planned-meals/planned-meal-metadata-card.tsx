import { PlannedMealMetadata } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Users, ChefHat, CookingPot } from 'lucide-react'
import Link from 'next/link'
import { routes } from '@/lib/routes'
import { useRouter } from 'next/navigation'
interface PlannedMealMetadataCardProps {
  plannedMeal: PlannedMealMetadata
}

export function PlannedMealMetadataCard({
  plannedMeal,
}: PlannedMealMetadataCardProps) {
  const router = useRouter()

  // Get values, using overrides if they exist
  const name = plannedMeal.overrideName || plannedMeal.recipe.name
  const duration = plannedMeal.overrideDuration || plannedMeal.recipe.duration
  const difficulty =
    plannedMeal.overrideDifficulty || plannedMeal.recipe.difficulty
  const servings = plannedMeal.overrideServings || plannedMeal.recipe.servings

  const onCook = () => {
    router.push(routes.plannedMeal.cooking(plannedMeal.id))
  }

  // The content is wrapped in a div to handle the case when we have buttons
  // that need to be clicked separately from the link
  const cardContent = (
    <div className="bg-gradient-to-r from-lime-50 to-lime-100 p-4 flex flex-col h-full">
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-xl font-semibold line-clamp-2 text-lime-900 h-14">
          {name}
        </h3>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 min-h-8">
        {duration && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-lime-100 text-lime-700 hover:bg-lime-200"
          >
            <Clock className="h-3 w-3" />
            <span>{duration} min</span>
          </Badge>
        )}
        {difficulty && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-lime-100 text-lime-700 hover:bg-lime-200"
          >
            <span>Difficulty: {difficulty}/10</span>
          </Badge>
        )}
        {servings > 0 && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-lime-100 text-lime-700 hover:bg-lime-200"
          >
            <Users className="h-3 w-3" />
            <span>{servings} servings</span>
          </Badge>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1 text-xs text-lime-700/80">
        <ChefHat className="h-3.5 w-3.5" />
        <span>Ready to cook</span>
      </div>

      <div className="mt-auto pt-4">
        <Button
          className="w-full bg-lime-600 text-white hover:bg-lime-700"
          onClick={(e) => {
            e.preventDefault()
            onCook()
          }}
        >
          <CookingPot className="h-4 w-4 mr-2" />
          Cook Now
        </Button>
      </div>
    </div>
  )

  return (
    <Link
      href={routes.plannedMeal.byId(plannedMeal.id)}
      className="transition-transform hover:scale-[1.02] focus:scale-[1.02] focus:outline-none block"
    >
      <Card className="h-full overflow-hidden border-lime-100 shadow-md hover:shadow-lg transition-shadow duration-200">
        {cardContent}
      </Card>
    </Link>
  )
}
