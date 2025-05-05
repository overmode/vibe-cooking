import { PlannedMealWithRecipe } from '@/lib/types'

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
