import { apiRoutes } from "@/lib/api/api-routes";
import { get, put } from "./fetchers";
import { PlannedMealWithRecipe } from "@/lib/types";
import { PlannedMeal } from "@prisma/client";
import { UpdatePlannedMealInput } from "@/lib/validators/plannedMeals";
export async function getPlannedMealWithRecipeById(id: string) : Promise<PlannedMealWithRecipe> {
  return get<PlannedMealWithRecipe>(apiRoutes.plannedMeal.byId(id));
}

export const updatePlannedMeal = async (updatePlannedMealInput: UpdatePlannedMealInput) => {
  return put<PlannedMeal>(apiRoutes.plannedMeal.byId(updatePlannedMealInput.id), updatePlannedMealInput);
}