import { createRecipe, deleteRecipe } from "@/lib/data-access/recipe";
import { auth } from "@clerk/nextjs/server";
import { CreateRecipeInput } from "@/lib/validators/recipe";
import { handleActionError } from "@/lib/utils/error";
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
