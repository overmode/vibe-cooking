import { apiRoutes } from "@/lib/api/api-routes";
import { del, get, post } from "@/lib/api/fetchers";
import { Recipe, RecipeMetadata, UserProfile } from "@/lib/types";

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

export const getUserProfile = async () => {
  return get<UserProfile | null>(apiRoutes.userProfile.all);
};

export const updateUserProfile = async (content: string) => {
  return post<UserProfile>(apiRoutes.userProfile.all, {
    content,
  });
};
