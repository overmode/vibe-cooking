import prisma from "@/prisma/client";
import { PlannedMealStatus, Prisma } from "@prisma/client";
import { CreateRecipeInput, UpdateRecipeInput } from "@/lib/validators/recipe";
import { handleDbError } from "@/lib/utils/error";
import { RecipeMetadata } from "@/lib/types";

export async function createRecipe({
  transaction,
  userId,
  data,
}: {
  transaction?: Prisma.TransactionClient;
  userId: string;
  data: CreateRecipeInput;
}) {
  try {
    const recipe = await (transaction ?? prisma).recipe.create({
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
  transaction,
  id,
  userId,
}: {
  transaction?: Prisma.TransactionClient;
  id: string;
  userId: string;
}) {
  try {
    const recipe = await (transaction ?? prisma).recipe.findUnique({
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
  transaction,
  userId,
}: {
  transaction?: Prisma.TransactionClient;
  userId: string;
}): Promise<RecipeMetadata[]> {
  // TODO: Add pagination
  try {
    const recipes = await (transaction ?? prisma).recipe.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        servings: true,
        duration: true,
        difficulty: true,
        cookCount: true,
        isFavorite: true,
        plannedMeals: {
          where: {
            status: PlannedMealStatus.PLANNED,
          },
          select: {
            id: true,
            status: true,            
          }
        }
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
  transaction,
  userId,
  data,
}: {
  transaction?: Prisma.TransactionClient;
  userId: string;
  data: UpdateRecipeInput;
}) {
  const { id, ...recipeData } = data;
  try {
    const recipe = await (transaction ?? prisma).recipe.update({
      where: { id, userId },
      data: recipeData,
    });
    return recipe;
  } catch (error) {
    handleDbError(error, "update recipe");
  }
}

export async function setRecipeFavorite({
  transaction,
  id,
  userId,
  isFavorite,
}: {
  transaction?: Prisma.TransactionClient;
  id: string;
  userId: string;
  isFavorite: boolean;
}) {
  try {
    const recipe = await updateRecipe({
      transaction,
      userId,
      data: { isFavorite, id },
    });
    return recipe;
  } catch (error) {
    handleDbError(error, "set recipe favorite");
  }
}

export async function deleteRecipe({
  transaction,
  id,
  userId,
}: {
  transaction?: Prisma.TransactionClient;
  id: string;
  userId: string;
}) {
  try {
    await (transaction ?? prisma).recipe.delete({
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


export async function incrementCookedCount({
  id,
  userId,
  transaction,
}: {
  id: string;
  userId: string;
  transaction?: Prisma.TransactionClient;
}) {
  try {
    const recipe = await (transaction ?? prisma).recipe.update({
      where: { id, userId },
      data: { cookCount: { increment: 1 } },
    });
    return recipe;
  } catch (error) {
    handleDbError(error, "increment cooked count");
  }
}

export async function decrementCookedCount({
  id,
  userId,
  transaction,
}: {
  id: string;
  userId: string;
  transaction?: Prisma.TransactionClient;
}) {
  try {
    const recipe = await (transaction ?? prisma).recipe.update({
      where: { id, userId },
      data: { cookCount: { decrement: 1} },
    });
    return recipe;
  } catch (error) {
    handleDbError(error, "decrement cooked count");
  }
}
