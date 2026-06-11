import { type UIMessage } from "ai";
import { apiRoutes } from "@/lib/api/api-routes";
import { del, get, post } from "@/lib/api/fetchers";
import {
  type Recipe,
  type RecipeMetadata,
  type ThreadMetadata,
  type UserProfile,
} from "@/lib/types";

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

export const getThreads = async () => {
  return get<ThreadMetadata[]>(apiRoutes.chatThread.all);
};

export const getThreadMessages = async (threadId: string) => {
  return get<UIMessage[]>(apiRoutes.chatThread.byId(threadId));
};

export const getUserProfile = async () => {
  return get<UserProfile | null>(apiRoutes.userProfile.all);
};

export const updateUserProfile = async (content: string) => {
  return post<UserProfile>(apiRoutes.userProfile.all, {
    content,
  });
};
