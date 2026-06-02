import { apiRoutes } from "@/lib/api/api-routes";
import { del, get, post } from "@/lib/api/fetchers";
import { RecipeMetadata } from "@/lib/types";
import { Recipe, UserDietaryPreferences } from "@/generated/prisma/browser";

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

export const getUserDietaryPreferences = async () => {
  return get<UserDietaryPreferences>(apiRoutes.preferences.all);
};

export const updateUserDietaryPreferences = async (preferences: string) => {
  return post<UserDietaryPreferences>(apiRoutes.preferences.all, {
    preferences,
  });
};
