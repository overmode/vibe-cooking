'use server'

import { auth } from '@clerk/nextjs/server'
import { handleActionError } from '@/lib/utils/error'
import {
  createPlannedMeal,
  deletePlannedMeal,
  getPlannedMealById,
  getPlannedMeals,
  getPlannedMealsMetadata,
  setPlannedMealCooked,
  setPlannedMealUnCooked,
  updatePlannedMeal,
} from '@/lib/data-access/planned-meal'
import {
  CreatePlannedMealInput,
  UpdatePlannedMealInput,
} from '@/lib/validators/plannedMeals'
import { PlannedMealMetadata, PlannedMealWithRecipe } from '@/lib/types'
import prisma from '@/prisma/client'
import { PlannedMealStatus } from '@prisma/client'
import {
  decrementCookedCount,
  incrementCookedCount,
} from '@/lib/data-access/recipe'
import { MAX_NUM_PLANNED_MEALS_PER_USER } from '@/lib/constants/app_validation'

export const getPlannedMealsMetadataAction = async (): Promise<
  PlannedMealMetadata[]
> => {
  const { userId } = await auth()
  if (!userId) {
    handleActionError('Unauthorized', 'get planned meals metadata')
  }
  const plannedMeals = await getPlannedMealsMetadata({ userId })
  return plannedMeals
}

export const getPlannedMealsAction = async () => {
  const { userId } = await auth()
  if (!userId) {
    handleActionError('Unauthorized', 'get planned meals')
  }
  const plannedMeals = await getPlannedMeals({ userId })
  return plannedMeals
}

export const createPlannedMealAction = async (
  plannedMealData: CreatePlannedMealInput
) => {
  const { userId } = await auth()
  if (!userId) {
    handleActionError('Unauthorized', 'create planned meal')
  }

  try {
    const plannedMeal = await prisma.$transaction(
      async (tx) => {
        const count = await tx.plannedMeal.count({
          where: { userId, status: PlannedMealStatus.PLANNED },
        })

        if (count >= MAX_NUM_PLANNED_MEALS_PER_USER) {
          throw new Error(
            `Planned meal limit of ${MAX_NUM_PLANNED_MEALS_PER_USER} reached`
          )
        }

        return createPlannedMeal({
          userId,
          data: plannedMealData,
          transaction: tx,
        })
      },
      {
        // Slightly slower but prevents race conditions
        isolationLevel: 'Serializable',
      }
    )

    return plannedMeal
  } catch (error) {
    return handleActionError(error, 'create planned meal')
  }
}

export const deletePlannedMealAction = async (plannedMealId: string) => {
  const { userId } = await auth()
  if (!userId) {
    handleActionError('Unauthorized', 'delete planned meal')
  }
  const plannedMeal = await deletePlannedMeal({ id: plannedMealId, userId })
  return plannedMeal
}

export const updatePlannedMealAction = async (
  plannedMealData: UpdatePlannedMealInput
) => {
  const { userId } = await auth()
  if (!userId) {
    handleActionError('Unauthorized', 'update planned meal')
  }
  const plannedMeal = await updatePlannedMeal({
    userId,
    data: plannedMealData,
  })
  return plannedMeal
}

export const getPlannedMealByIdAction = async (
  id: string
): Promise<PlannedMealWithRecipe> => {
  const { userId } = await auth()
  if (!userId) {
    handleActionError('Unauthorized', 'get planned meal')
  }
  const plannedMeal = await getPlannedMealById({ id, userId })
  return plannedMeal
}

export async function updateStatus(
  plannedMealId: string,
  status: PlannedMealStatus
) {
  const { userId } = await auth()
  if (!userId) {
    handleActionError('Unauthorized', 'update status')
  }

  return await prisma.$transaction(async (tx) => {
    const plannedMeal = await getPlannedMealById({
      id: plannedMealId,
      userId,
      transaction: tx,
    })

    if (!plannedMeal) {
      handleActionError('Planned meal not found', 'update cooked status')
    }

    if (plannedMeal.status === status) return plannedMeal

    if (status === PlannedMealStatus.COOKED) {
      const plannedMeal = await setPlannedMealCooked({
        id: plannedMealId,
        userId,
        transaction: tx,
      })
      await incrementCookedCount({
        id: plannedMeal.recipeId,
        userId,
        transaction: tx,
      })
    } else {
      const plannedMeal = await setPlannedMealUnCooked({
        id: plannedMealId,
        userId,
        transaction: tx,
      })
      await decrementCookedCount({
        id: plannedMeal.recipeId,
        userId,
        transaction: tx,
      })
    }

    return plannedMeal
  })
}
