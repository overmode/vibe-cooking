import { PlannedMealMetadata } from '@/lib/types'
import { getPlannedMealDisplayMetadata } from '@/lib/utils/plannedMealUtils'
import { Button } from '@/components/ui/button'
import { CookingPot } from 'lucide-react'
import { routes } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { RecipeCardBase } from '@/components/recipes/shared/recipe-card-base'

interface PlannedMealMetadataCardProps {
  plannedMeal: PlannedMealMetadata
}

export function PlannedMealMetadataCard({
  plannedMeal,
}: PlannedMealMetadataCardProps) {
  const router = useRouter()

  // Use the helper function to get display metadata
  const metadata = getPlannedMealDisplayMetadata(plannedMeal)

  const onCook = () => {
    router.push(routes.plannedMeal.cooking(plannedMeal.id))
  }

  const actionContent = (
    <Button
      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      onClick={(e) => {
        e.preventDefault()
        onCook()
      }}
    >
      <CookingPot className="h-4 w-4 mr-2" />
      Cook Now
    </Button>
  )

  return (
    <RecipeCardBase
      metadata={metadata}
      linkHref={routes.plannedMeal.byId(plannedMeal.id)}
      actionContent={actionContent}
    />
  )
}
