import { apiRoutes } from "@/lib/api/api-routes";
import { del, get, post, put } from "@/lib/api/fetchers";
import {
  PlannedMealWithRecipe,
  PlannedMealMetadata,
  RecipeMetadata,
} from "@/lib/types";
import {
  RecipeInstance,
  RecipeInstanceStatus,
  RecipeTemplate,
  UserDietaryPreferences,
} from "@/generated/prisma/browser";
import { UpdatePlannedMealInput } from "@/lib/validators/plannedMeals";
export async function getPlannedMealWithRecipeById(
  id: string
): Promise<PlannedMealWithRecipe> {
  return get<PlannedMealWithRecipe>(apiRoutes.plannedMeal.byId(id));
}

export const updatePlannedMeal = async (
  updatePlannedMealInput: UpdatePlannedMealInput
) => {
  return put<RecipeInstance>(
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
  return get<RecipeTemplate>(apiRoutes.recipe.byId(id));
};

export const deleteRecipeById = async (
  id: string
): Promise<{ success: boolean }> => {
  return del<{ success: boolean }>(apiRoutes.recipe.byId(id));
};

export const updatePlannedMealStatus = async (
  id: string,
  status: RecipeInstanceStatus
) => {
  const url =
    status === RecipeInstanceStatus.COOKED
      ? apiRoutes.plannedMeal.cook(id)
      : apiRoutes.plannedMeal.uncook(id);
  return post<RecipeInstance>(url, {});
};

export const planRecipe = async (id: string) => {
  return post<RecipeInstance>(apiRoutes.recipe.plan(id), {});
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
