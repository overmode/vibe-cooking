import prisma from "@/prisma/client";
import { CreateRecipeInput, UpdateRecipeInput } from "@/lib/validators/recipe";
import { handleDbError } from "@/lib/utils/error";
export async function createRecipe({
  userId,
  data,
}: {
  userId: string;
  data: CreateRecipeInput;
}) {
  try {
    const recipe = await prisma.recipe.create({
      data: {
        ...data,
        userId,
      },
    });
    return recipe;
  } catch (error) {
    handleDbError(error, "create recipe");
  }
}

export async function updateRecipe({
  id,
  userId,
  data,
}: {
  id: string;
  userId: string;
  data: UpdateRecipeInput;
}) {
  try {
    const recipe = await prisma.recipe.update({
      where: { id, userId },
      data,
    });
    return recipe;
  } catch (error) {
    handleDbError(error, "update recipe");
  }
}

export async function getRecipeById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id, userId },
    });

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    return recipe;
  } catch (error) {
    handleDbError(error, "get recipe by id");
  }
}

export async function listUserRecipes(userId: string) {
  // TODO: Add pagination
  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return recipes;
  } catch (error) {
    handleDbError(error, "list recipes");
  }
}

export async function deleteRecipe({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  try {
    await prisma.recipe.delete({
      where: { id, userId },
    });
    return true;
  } catch (error) {
    handleDbError(error, "delete recipe");
  }
}

export async function setRecipeFavorite({
  id,
  userId,
  isFavorite,
}: {
  id: string;
  userId: string;
  isFavorite: boolean;
}) {
  try {
    const recipe = await updateRecipe({ id, userId, data: { isFavorite } });
    return recipe;
  } catch (error) {
    handleDbError(error, "set recipe favorite");
  }
}
