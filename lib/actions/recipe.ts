import {
  deleteRecipe,
  getRecipeById,
  getRecipesMetadata,
  updateRecipe,
} from '@/lib/data-access/recipe'
import { auth } from '@clerk/nextjs/server'
import { CreateRecipeInput, UpdateRecipeInput } from '@/lib/validators/recipe'
import { handleActionError } from '@/lib/utils/error'
import { RecipeMetadata } from '@/lib/types'
import prisma from '@/prisma/client'
import { MAX_NUM_RECIPES_PER_USER } from '@/lib/constants/app_validation'

export const getRecipesMetadataAction = async (): Promise<RecipeMetadata[]> => {
  const { userId } = await auth()
  if (!userId) {
    handleActionError('Unauthorized', 'get recipes metadata')
  }
  const recipes = await getRecipesMetadata({ userId })
  return recipes
}
export const createRecipeAction = async (recipeData: CreateRecipeInput) => {
  const { userId } = await auth()
  if (!userId) {
    return handleActionError('Unauthorized', 'create recipe')
  }

  try {
    // Optimistic approach: try to create directly, handle limit violations
    const recipe = await prisma.$transaction(
      async (tx) => {
        // Check count first to give user immediate feedback for obvious violations
        const count = await tx.recipe.count({
          where: { userId },
        })

        if (count >= MAX_NUM_RECIPES_PER_USER) {
          throw new Error(
            `Recipe limit of ${MAX_NUM_RECIPES_PER_USER} reached.`
          )
        }

        return tx.recipe.create({
          data: {
            ...recipeData,
            userId,
          },
        })
      },
      {
        // Use ReadCommitted to avoid deadlocks while still maintaining data consistency
        isolationLevel: 'ReadCommitted',
      }
    )

    return recipe
  } catch (error) {
    return handleActionError(error, 'create recipe')
  }
}

export const deleteRecipeAction = async ({
  recipeId,
}: {
  recipeId: string
}) => {
  const { userId } = await auth()
  if (!userId) {
    handleActionError('Unauthorized', 'delete recipe')
  }
  const recipe = await deleteRecipe({ id: recipeId, userId })
  return recipe
}

export const updateRecipeAction = async (recipeData: UpdateRecipeInput) => {
  const { userId } = await auth()
  if (!userId) {
    handleActionError('Unauthorized', 'update recipe')
  }
  const recipe = await updateRecipe({
    userId,
    data: recipeData,
  })
  return recipe
}

export const getRecipeByIdAction = async (recipeId: string) => {
  const { userId } = await auth()
  if (!userId) {
    handleActionError('Unauthorized', 'get recipe')
  }
  const recipe = await getRecipeById({ id: recipeId, userId })
  return recipe
}
