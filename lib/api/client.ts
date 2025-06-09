import { apiRoutes } from "@/lib/api/api-routes";
import { del, get, post, put } from "@/lib/api/fetchers";
import {
  PlannedMealWithRecipe,
  PlannedMealMetadata,
  RecipeMetadata,
} from "@/lib/types";
import {
  PlannedMeal,
  PlannedMealStatus,
  Recipe,
  UserDietaryPreferences,
} from "@prisma/client";
import { UpdatePlannedMealInput } from "@/lib/validators/plannedMeals";
export async function getPlannedMealWithRecipeById(
  id: string
): Promise<PlannedMealWithRecipe> {
  return get<PlannedMealWithRecipe>(apiRoutes.plannedMeal.byId(id));
}

export const updatePlannedMeal = async (
  updatePlannedMealInput: UpdatePlannedMealInput
) => {
  return put<PlannedMeal>(
    apiRoutes.plannedMeal.byId(updatePlannedMealInput.id),
    updatePlannedMealInput
  );
};

export const getPlannedMealsMetadata = async () => {
  return get<PlannedMealMetadata[]>(apiRoutes.plannedMeal.all);
};

export const getRecipesMetadata = async () => {
  return get<RecipeMetadata[]>(apiRoutes.recipe.all);
};

export const getRecipeById = async (id: string) => {
  return get<Recipe>(apiRoutes.recipe.byId(id));
};

export const deleteRecipeById = async (
  id: string
): Promise<{ success: boolean }> => {
  return del<{ success: boolean }>(apiRoutes.recipe.byId(id));
};

export const updatePlannedMealStatus = async (
  id: string,
  status: PlannedMealStatus
) => {
  const url =
    status === PlannedMealStatus.COOKED
      ? apiRoutes.plannedMeal.cook(id)
      : apiRoutes.plannedMeal.uncook(id);
  return post<PlannedMeal>(url, {});
};

export const planRecipe = async (id: string) => {
  return post<PlannedMeal>(apiRoutes.recipe.plan(id), {});
};

export const deletePlannedMealById = async (id: string) => {
  return del<{ success: boolean }>(apiRoutes.plannedMeal.byId(id));
};

export const getUserDietaryPreferences = async () => {
  return get<UserDietaryPreferences>(apiRoutes.preferences.all);
};

export const updateUserDietaryPreferences = async (preferences: string) => {
  return post<UserDietaryPreferences>(apiRoutes.preferences.all, {
    preferences,
  });
};
