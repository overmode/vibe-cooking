import { PlannedMealMetadata } from '@/lib/types'
import { PlannedMealMetadataCard } from '@/components/planned-meals/planned-meal-metadata-card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface PlannedMealsGridViewProps {
  plannedMeals: PlannedMealMetadata[]
}

export function PlannedMealsGridView({
  plannedMeals,
}: PlannedMealsGridViewProps) {
  return (
    <ScrollArea className="h-full rounded-md">
      <div className="p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plannedMeals.map((plannedMeal) => (
            <PlannedMealMetadataCard
              key={plannedMeal.id}
              plannedMeal={plannedMeal}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
