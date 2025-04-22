import {
  createRecipe,
  deleteRecipe,
  getRecipeById,
  getRecipesMetadata,
  updateRecipe,
} from "@/lib/data-access/recipe";
import { auth } from "@clerk/nextjs/server";
import { CreateRecipeInput, UpdateRecipeInput } from "@/lib/validators/recipe";
import { handleActionError } from "@/lib/utils/error";

export const getRecipesMetadataAction = async () => {
  const { userId } = await auth();
  if (!userId) {
    handleActionError("Unauthorized", "getRecipesMetadataAction");
  }
  const recipes = await getRecipesMetadata({ userId });
  return recipes;
};
export const createRecipeAction = async (recipeData: CreateRecipeInput) => {
  const { userId } = await auth();
  if (!userId) {
    handleActionError("Unauthorized", "createRecipeAction");
  }
  const recipe = await createRecipe({
    userId,
    data: recipeData,
  });
  return recipe;
};

export const deleteRecipeAction = async (recipeId: string) => {
  const { userId } = await auth();
  if (!userId) {
    handleActionError("Unauthorized", "deleteRecipeAction");
  }
  const recipe = await deleteRecipe({ id: recipeId, userId });
  return recipe;
};

export const updateRecipeAction = async (recipeData: UpdateRecipeInput) => {
  const { userId } = await auth();
  if (!userId) {
    handleActionError("Unauthorized", "updateRecipeAction");
  }
  const recipe = await updateRecipe({
    userId,
    data: recipeData,
  });
  return recipe;
};

export const getRecipeByIdAction = async (recipeId: string) => {
  const { userId } = await auth();
  if (!userId) {
    handleActionError("Unauthorized", "getRecipeByIdAction");
  }
  const recipe = await getRecipeById({ id: recipeId, userId });
  return recipe;
};
