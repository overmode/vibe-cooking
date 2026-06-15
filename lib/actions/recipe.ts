import {
  createRecipe,
  deleteRecipe,
  getRecipeById,
  getRecipesMetadata,
  updateRecipe,
} from "@/lib/data-access/recipe";
import { getCurrentUserId } from "@/lib/auth/get-current-user-id";
import {
  type CreateRecipeInput,
  type UpdateRecipeInput,
} from "@/lib/validators/recipe";
import { handleActionError } from "@/lib/utils/error";
import { type Recipe, type RecipeMetadata } from "@/lib/types";
import { type Author } from "@/generated/prisma/client";
import prisma from "@/prisma/client";
import { MAX_NUM_RECIPES_PER_USER } from "@/lib/constants/app_validation";

export const getRecipesMetadataAction = async (): Promise<RecipeMetadata[]> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    handleActionError("Unauthorized", "get recipes metadata");
  }
  const recipes = await getRecipesMetadata({ userId });
  return recipes;
};

export const createRecipeAction = async (
  recipeData: CreateRecipeInput,
  authoredBy: Author = "USER"
): Promise<Recipe> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    return handleActionError("Unauthorized", "create recipe");
  }

  try {
    // Optimistic approach: try to create directly, handle limit violations
    return await prisma.$transaction(
      async (tx) => {
        // Check count first to give user immediate feedback for obvious violations
        const count = await tx.recipe.count({
          where: { userId, archivedAt: null },
        });

        if (count >= MAX_NUM_RECIPES_PER_USER) {
          throw new Error(
            `Recipe limit of ${MAX_NUM_RECIPES_PER_USER} reached.`
          );
        }

        return createRecipe({
          transaction: tx,
          userId,
          data: recipeData,
          authoredBy,
        });
      },
      {
        // Use ReadCommitted to avoid deadlocks while still maintaining data consistency
        isolationLevel: "ReadCommitted",
      }
    );
  } catch (error) {
    return handleActionError(error, "create recipe");
  }
};

export const deleteRecipeAction = async ({
  recipeId,
}: {
  recipeId: string;
}) => {
  const userId = await getCurrentUserId();
  if (!userId) {
    handleActionError("Unauthorized", "delete recipe");
  }
  const recipe = await deleteRecipe({ id: recipeId, userId });
  return recipe;
};

export const updateRecipeAction = async (
  recipeData: UpdateRecipeInput,
  authoredBy: Author = "USER"
): Promise<Recipe> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    handleActionError("Unauthorized", "update recipe");
  }
  const recipe = await updateRecipe({
    userId,
    data: recipeData,
    authoredBy,
  });
  return recipe;
};

export const getRecipeByIdAction = async (
  recipeId: string
): Promise<Recipe> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    handleActionError("Unauthorized", "get recipe");
  }
  const recipe = await getRecipeById({ id: recipeId, userId });
  return recipe;
};
