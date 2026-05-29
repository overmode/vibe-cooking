import { CardDisplayMetadata, PlannedMealMetadata } from '@/lib/types'

/**
 * Extracts card display metadata from a planned meal
 */
export const getPlannedMealDisplayMetadata = (
  plannedMeal: PlannedMealMetadata
): CardDisplayMetadata => {
  return {
    id: plannedMeal.id,
    name: plannedMeal.name,
    duration: plannedMeal.duration,
    difficulty: plannedMeal.difficulty,
    servings: plannedMeal.servings,
  }
}
