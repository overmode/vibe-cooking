import {
  createRecipe,
  deleteRecipe,
  getRecipeById,
  getRecipesMetadata,
  updateRecipe,
} from "@/lib/data-access/recipe";
import {
  type CreateRecipeInput,
  type UpdateRecipeInput,
} from "@/lib/validators/recipe";
import { handleActionError } from "@/lib/utils/error";
import { type Recipe, type RecipeMetadata } from "@/lib/types";
import { type Author } from "@/generated/prisma/client";
import prisma from "@/prisma/client";
import { MAX_NUM_RECIPES_PER_USER } from "@/lib/constants/app_validation";

export const getRecipesMetadataAction = async (
  userId: string
): Promise<RecipeMetadata[]> => {
  return getRecipesMetadata({ userId });
};

export const createRecipeAction = async (
  userId: string,
  recipeData: CreateRecipeInput,
  authoredBy: Author = "USER"
): Promise<Recipe> => {
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

export const deleteRecipeAction = async (userId: string, recipeId: string) => {
  return deleteRecipe({ id: recipeId, userId });
};

export const updateRecipeAction = async (
  userId: string,
  recipeData: UpdateRecipeInput,
  authoredBy: Author = "USER"
): Promise<Recipe> => {
  return updateRecipe({ userId, data: recipeData, authoredBy });
};

export const getRecipeByIdAction = async (
  userId: string,
  recipeId: string
): Promise<Recipe> => {
  return getRecipeById({ id: recipeId, userId });
};
