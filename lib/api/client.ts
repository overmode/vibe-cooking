import { apiRoutes } from "@/lib/api/api-routes";
import { get, post, put } from "@/lib/api/fetchers";
import { PlannedMealWithRecipe, PlannedMealMetadata, RecipeMetadata } from "@/lib/types";
import { PlannedMeal, PlannedMealStatus } from "@prisma/client";
import { UpdatePlannedMealInput } from "@/lib/validators/plannedMeals";
export async function getPlannedMealWithRecipeById(id: string) : Promise<PlannedMealWithRecipe> {
  return get<PlannedMealWithRecipe>(apiRoutes.plannedMeal.byId(id));
}

export const updatePlannedMeal = async (updatePlannedMealInput: UpdatePlannedMealInput) => {
  return put<PlannedMeal>(apiRoutes.plannedMeal.byId(updatePlannedMealInput.id), updatePlannedMealInput);
}

export const getPlannedMealsMetadata = async () => {
  return get<PlannedMealMetadata[]>(apiRoutes.plannedMeal.all);
}

export const getRecipesMetadata = async () => {
  return get<RecipeMetadata[]>(apiRoutes.recipe.all);
}

export const updatePlannedMealStatus = async (id: string, status: PlannedMealStatus) => {
  const url = status === PlannedMealStatus.COOKED ? apiRoutes.plannedMeal.cook(id) : apiRoutes.plannedMeal.uncook(id);
  return post<PlannedMeal>(url, {});
}