import { apiRoutes } from "./routes";
import { get } from "./fetchers";
import { PlannedMealWithRecipe } from "@/lib/types";
export async function getPlannedMealWithRecipeById(id: string) : Promise<PlannedMealWithRecipe> {
  return get<PlannedMealWithRecipe>(apiRoutes.plannedMeal.byId(id));
}