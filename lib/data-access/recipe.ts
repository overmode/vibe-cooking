import prisma from "@/prisma/client";
import { RecipeInstanceStatus, Prisma } from "@/generated/prisma/client";
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
    const recipe = await (transaction ?? prisma).recipeTemplate.create({
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
    const recipe = await (transaction ?? prisma).recipeTemplate.findUnique({
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
    const templates = await (transaction ?? prisma).recipeTemplate.findMany({
      where: {
        userId,
        archivedAt: null,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        servings: true,
        duration: true,
        difficulty: true,
        isFavorite: true,
        instances: {
          where: {
            status: {
              in: [RecipeInstanceStatus.PLANNED, RecipeInstanceStatus.COOKED],
            },
          },
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return templates.map(({ instances, ...template }) => ({
      ...template,
      plannedMeals: instances.filter(
        (instance) => instance.status === RecipeInstanceStatus.PLANNED
      ),
      cookCount: instances.filter(
        (instance) => instance.status === RecipeInstanceStatus.COOKED
      ).length,
    }));
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
    const recipe = await (transaction ?? prisma).recipeTemplate.update({
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
    // Soft delete: planned/cooked instances keep a valid template reference and
    // their cooking history, so we archive the template instead of removing it.
    await (transaction ?? prisma).recipeTemplate.update({
      where: { id, userId },
      data: { archivedAt: new Date() },
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
