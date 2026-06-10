import prisma from "@/prisma/client";
import { Prisma, type Author } from "@/generated/prisma/client";
import { type CreateRecipeInput, type UpdateRecipeInput } from "@/lib/validators/recipe";
import { handleDbError } from "@/lib/utils/error";
import { type Recipe, type RecipeContent, type RecipeMetadata } from "@/lib/types";

export async function createRecipe({
  transaction,
  userId,
  data,
  authoredBy,
}: {
  transaction?: Prisma.TransactionClient;
  userId: string;
  data: CreateRecipeInput;
  authoredBy: Author;
}): Promise<Recipe> {
  try {
    const create = async (tx: Prisma.TransactionClient) => {
      const recipe = await tx.recipe.create({
        data: { userId },
        select: { id: true, createdAt: true },
      });
      const revision = await appendRecipeRevision({
        transaction: tx,
        recipeId: recipe.id,
        content: toContent(data),
        authoredBy,
      });
      return toRecipe({ ...recipe, revisions: [revision] });
    };
    return transaction ? await create(transaction) : await prisma.$transaction(create);
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
}): Promise<Recipe> {
  try {
    const recipe = await (transaction ?? prisma).recipe.findFirst({
      where: { id, userId },
      select: {
        id: true,
        createdAt: true,
        revisions: { orderBy: { revision: "desc" }, take: 1 },
      },
    });

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    return toRecipe(recipe);
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
        archivedAt: null,
      },
      select: {
        id: true,
        createdAt: true,
        revisions: {
          orderBy: { revision: "desc" },
          take: 1,
          select: {
            name: true,
            servings: true,
            duration: true,
            difficulty: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return recipes.map(({ id, createdAt, revisions }) => {
      const current = revisions[0];
      if (!current) {
        throw new Error("Recipe has no current revision");
      }
      return { id, createdAt, ...current };
    });
  } catch (error) {
    handleDbError(error, "list recipes");
  }
}

export async function updateRecipe({
  transaction,
  userId,
  data,
  authoredBy,
}: {
  transaction?: Prisma.TransactionClient;
  userId: string;
  data: UpdateRecipeInput;
  authoredBy: Author;
}): Promise<Recipe> {
  const { id, ...patch } = data;
  try {
    const update = async (tx: Prisma.TransactionClient) => {
      const recipe = await tx.recipe.findFirst({
        where: { id, userId },
        select: {
          id: true,
          createdAt: true,
          revisions: { orderBy: { revision: "desc" }, take: 1 },
        },
      });
      if (!recipe) {
        throw new Error("Recipe not found");
      }
      const current = recipe.revisions[0];
      if (!current) {
        throw new Error("Recipe has no current revision");
      }

      // Revisions are immutable snapshots, so a partial update carries forward
      // the current content and overrides only the provided fields.
      const content: RecipeContent = {
        name: patch.name ?? current.name,
        servings: patch.servings ?? current.servings,
        ingredients: patch.ingredients ?? current.ingredients,
        instructions: patch.instructions ?? current.instructions,
        duration: patch.duration ?? current.duration,
        difficulty: patch.difficulty ?? current.difficulty,
      };

      const revision = await appendRecipeRevision({
        transaction: tx,
        recipeId: id,
        content,
        authoredBy,
      });
      return toRecipe({ id: recipe.id, createdAt: recipe.createdAt, revisions: [revision] });
    };
    return transaction ? await update(transaction) : await prisma.$transaction(update);
  } catch (error) {
    handleDbError(error, "update recipe");
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
    // Soft delete: archive instead of removing so historical references stay valid.
    await (transaction ?? prisma).recipe.update({
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

async function appendRecipeRevision({
  transaction,
  recipeId,
  content,
  authoredBy,
}: {
  transaction: Prisma.TransactionClient;
  recipeId: string;
  content: RecipeContent;
  authoredBy: Author;
}) {
  const latest = await transaction.recipeRevision.findFirst({
    where: { recipeId },
    orderBy: { revision: "desc" },
    select: { revision: true },
  });
  const nextRevision = latest ? latest.revision + 1 : 1;

  return transaction.recipeRevision.create({
    data: { recipeId, revision: nextRevision, authoredBy, ...content },
  });
}

function toContent(input: CreateRecipeInput): RecipeContent {
  return {
    name: input.name,
    servings: input.servings,
    ingredients: input.ingredients,
    instructions: input.instructions,
    duration: input.duration ?? null,
    difficulty: input.difficulty ?? null,
  };
}

function toRecipe({
  id,
  createdAt,
  revisions,
}: {
  id: string;
  createdAt: Date;
  revisions: RecipeContent[];
}): Recipe {
  const current = revisions[0];
  if (!current) {
    throw new Error("Recipe has no current revision");
  }
  // Pick content fields explicitly: callers may pass full revision rows whose
  // own id/createdAt would otherwise clobber the recipe's via spread.
  const { name, servings, ingredients, instructions, duration, difficulty } =
    current;
  return {
    id,
    createdAt,
    name,
    servings,
    ingredients,
    instructions,
    duration,
    difficulty,
  };
}
