import { PlannedMealMetadata } from '@/lib/types'
import { PlannedMealMetadataCard } from '@/components/planned-meals/planned-meal-metadata-card'

interface PlannedMealsGridViewProps {
  plannedMeals: PlannedMealMetadata[]
}

export function PlannedMealsGridView({
  plannedMeals,
}: PlannedMealsGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plannedMeals.map((plannedMeal) => (
        <PlannedMealMetadataCard
          key={plannedMeal.id}
          plannedMeal={plannedMeal}
        />
      ))}
    </div>
  )
}
