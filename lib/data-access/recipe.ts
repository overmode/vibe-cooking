import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { CreateRecipeInput, UpdateRecipeInput } from "@/lib/validators/recipe";
import { handleDbError } from "@/lib/utils/error";
import { RecipeMetadata } from "@/lib/types";

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

export async function getRecipesMetadata({
  userId,
}: {
  userId: string;
}): Promise<RecipeMetadata[]> {
  // TODO: Add pagination
  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        servings: true,
        duration: true,
        cookCount: true,
        isFavorite: true,
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
export async function updateRecipe({
  userId,
  data,
}: {
  userId: string;
  data: UpdateRecipeInput;
}) {
  const { id, ...recipeData } = data;
  try {
    const recipe = await prisma.recipe.update({
      where: { id, userId },
      data: recipeData,
    });
    return recipe;
  } catch (error) {
    handleDbError(error, "update recipe");
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
    const recipe = await updateRecipe({
      userId,
      data: { isFavorite, id },
    });
    return recipe;
  } catch (error) {
    handleDbError(error, "set recipe favorite");
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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // 2025 is the code for the recipe not found error
      if (error.code === "P2025") {
        return true;
      }
    }
    handleDbError(error, "delete recipe");
  }
}
