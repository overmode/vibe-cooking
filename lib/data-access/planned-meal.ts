import prisma from '@/prisma/client'
import { Prisma } from '@/generated/prisma/client'
import {
  CreatePlannedMealInput,
  UpdatePlannedMealInput,
} from '@/lib/validators/plannedMeals'
import { RecipeInstanceStatus } from '@/generated/prisma/client'
import { handleDbError } from '@/lib/utils/error'
import { PlannedMealMetadata, PlannedMealWithRecipe } from '@/lib/types'

export async function createPlannedMeal({
  transaction,
  userId,
  data,
}: {
  transaction?: Prisma.TransactionClient
  userId: string
  data: CreatePlannedMealInput
}) {
  const { templateId, ...overrides } = data
  const client = transaction ?? prisma
  try {
    const template = await client.recipeTemplate.findUnique({
      where: { id: templateId, userId },
    })

    if (!template) {
      throw new Error(`Recipe template with ID ${templateId} not found`)
    }

    const plannedMeal = await client.recipeInstance.create({
      data: {
        userId,
        templateId,
        name: overrides.name ?? template.name,
        servings: overrides.servings ?? template.servings,
        ingredients: overrides.ingredients ?? template.ingredients,
        instructions: overrides.instructions ?? template.instructions,
        duration: overrides.duration ?? template.duration,
        difficulty: overrides.difficulty ?? template.difficulty,
        status: overrides.status ?? RecipeInstanceStatus.PLANNED,
        cookedAt: overrides.cookedAt,
      },
    })
    return plannedMeal
  } catch (error) {
    handleDbError(error, 'create planned meal')
  }
}

export async function getPlannedMealById({
  transaction,
  id,
  userId,
}: {
  transaction?: Prisma.TransactionClient
  id: string
  userId: string
}): Promise<PlannedMealWithRecipe> {
  try {
    const plannedMeal = await (transaction ?? prisma).recipeInstance.findUnique({
      where: {
        id,
        userId,
      },
    })

    if (!plannedMeal) {
      throw new Error(`Planned meal with ID ${id} not found`)
    }

    return plannedMeal
  } catch (error) {
    handleDbError(error, 'get planned meal by id')
  }
}

export async function getPlannedMealsMetadata({
  transaction,
  userId,
}: {
  transaction?: Prisma.TransactionClient
  userId: string
}): Promise<PlannedMealMetadata[]> {
  try {
    // TODO: Add pagination
    const plannedMeals = await (transaction ?? prisma).recipeInstance.findMany({
      where: { userId, status: RecipeInstanceStatus.PLANNED },
      select: {
        id: true,
        name: true,
        createdAt: true,
        difficulty: true,
        duration: true,
        servings: true,
        status: true,
        cookedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return plannedMeals
  } catch (error) {
    handleDbError(error, 'get planned meals metadata')
  }
}

export async function getPlannedMeals({
  transaction,
  userId,
}: {
  transaction?: Prisma.TransactionClient
  userId: string
}) {
  try {
    const plannedMeals = await (transaction ?? prisma).recipeInstance.findMany({
      where: { userId, status: RecipeInstanceStatus.PLANNED },
    })
    return plannedMeals
  } catch (error) {
    handleDbError(error, 'get planned meals')
  }
}

export async function updatePlannedMeal({
  transaction,
  userId,
  data,
}: {
  transaction?: Prisma.TransactionClient
  userId: string
  data: UpdatePlannedMealInput
}) {
  try {
    const { id, ...updateData } = data
    const plannedMeal = await (transaction ?? prisma).recipeInstance.update({
      where: { id, userId },
      data: updateData,
    })
    return plannedMeal
  } catch (error) {
    handleDbError(error, 'update planned meal')
  }
}

export async function setPlannedMealCooked({
  transaction,
  id,
  userId,
}: {
  transaction?: Prisma.TransactionClient
  id: string
  userId: string
}) {
  try {
    const plannedMeal = await updatePlannedMeal({
      transaction,
      userId,
      data: { id, cookedAt: new Date(), status: RecipeInstanceStatus.COOKED },
    })
    return plannedMeal
  } catch (error) {
    handleDbError(error, 'set planned meal cooked')
  }
}

export async function setPlannedMealUnCooked({
  transaction,
  id,
  userId,
}: {
  transaction?: Prisma.TransactionClient
  id: string
  userId: string
}) {
  try {
    const plannedMeal = await updatePlannedMeal({
      transaction,
      userId,
      data: { id, cookedAt: undefined, status: RecipeInstanceStatus.PLANNED },
    })
    return plannedMeal
  } catch (error) {
    handleDbError(error, 'set planned meal uncooked')
  }
}

export async function deletePlannedMeal({
  transaction,
  id,
  userId,
}: {
  transaction?: Prisma.TransactionClient
  id: string
  userId: string
}) {
  try {
    await (transaction ?? prisma).recipeInstance.delete({
      where: { id, userId },
    })
    return true
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // 2025 is the code for the planned meal not found error
      if (error.code === 'P2025') {
        return true
      }
    }
    handleDbError(error, 'delete planned meal')
  }
}
