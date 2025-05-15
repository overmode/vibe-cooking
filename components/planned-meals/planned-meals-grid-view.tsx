import { PlannedMealMetadata } from '@/lib/types'
import { PlannedMealMetadataCard } from '@/components/planned-meals/planned-meal-metadata-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { NoPlannedMeals } from '@/components/planned-meals/no-planned-meals'
interface PlannedMealsGridViewProps {
  plannedMeals: PlannedMealMetadata[]
}

export function PlannedMealsGridView({
  plannedMeals,
}: PlannedMealsGridViewProps) {
  if (plannedMeals.length === 0) {
    return <NoPlannedMeals />
  }

  return (
    <div className="container mx-auto py-8 flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-medium tracking-tight text-primary">
          Your Planned Meals
        </h2>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full rounded-md">
          <div className="p-1">
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
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
