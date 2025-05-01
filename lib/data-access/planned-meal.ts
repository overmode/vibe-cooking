import prisma from '@/prisma/client'
import { Prisma } from '@prisma/client'
import {
  CreatePlannedMealInput,
  UpdatePlannedMealInput,
} from '@/lib/validators/plannedMeals'
import { PlannedMealStatus } from '@prisma/client'
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
  try {
    const plannedMeal = await (transaction ?? prisma).plannedMeal.create({
      data: {
        ...data,
        userId,
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
    const plannedMeal = await (transaction ?? prisma).plannedMeal.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        recipe: true,
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
    const plannedMeals = await (transaction ?? prisma).plannedMeal.findMany({
      where: { userId, status: PlannedMealStatus.PLANNED },
      select: {
        id: true,
        overrideName: true,
        createdAt: true,
        overrideDifficulty: true,
        overrideDuration: true,
        overrideServings: true,
        status: true,
        cookedAt: true,
        recipe: {
          select: {
            name: true,
            servings: true,
            duration: true,
            difficulty: true,
          },
        },
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
    const plannedMeals = await (transaction ?? prisma).plannedMeal.findMany({
      where: { userId, status: PlannedMealStatus.PLANNED },
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
    const plannedMeal = await (transaction ?? prisma).plannedMeal.update({
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
      data: { id, cookedAt: new Date(), status: PlannedMealStatus.COOKED },
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
      data: { id, cookedAt: undefined, status: PlannedMealStatus.PLANNED },
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
    await (transaction ?? prisma).plannedMeal.delete({
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
