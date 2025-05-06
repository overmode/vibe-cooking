import {
  CardDisplayMetadata,
  PlannedMealMetadata,
  PlannedMealWithRecipe,
} from '@/lib/types'

/**
 * Converts a planned meal with recipe to a recipe object, using override values when available
 */
export const plannedMealToRecipe = (
  plannedMealWithRecipe: PlannedMealWithRecipe
) => {
  return {
    ...plannedMealWithRecipe.recipe,
    name:
      plannedMealWithRecipe.overrideName || plannedMealWithRecipe.recipe.name,
    ingredients: plannedMealWithRecipe.overrideIngredients?.length
      ? plannedMealWithRecipe.overrideIngredients
      : plannedMealWithRecipe.recipe.ingredients,
    instructions:
      plannedMealWithRecipe.overrideInstructions ||
      plannedMealWithRecipe.recipe.instructions,
    servings:
      plannedMealWithRecipe.overrideServings ||
      plannedMealWithRecipe.recipe.servings,
    duration:
      plannedMealWithRecipe.overrideDuration ||
      plannedMealWithRecipe.recipe.duration,
    difficulty:
      plannedMealWithRecipe.overrideDifficulty ||
      plannedMealWithRecipe.recipe.difficulty,
  }
}

/**
 * Extracts card display metadata from a planned meal
 */
export const getPlannedMealDisplayMetadata = (
  plannedMeal: PlannedMealMetadata
): CardDisplayMetadata => {
  return {
    id: plannedMeal.id,
    name: plannedMeal.overrideName || plannedMeal.recipe.name,
    duration: plannedMeal.overrideDuration || plannedMeal.recipe.duration,
    difficulty: plannedMeal.overrideDifficulty || plannedMeal.recipe.difficulty,
    servings: plannedMeal.overrideServings || plannedMeal.recipe.servings,
  }
}
