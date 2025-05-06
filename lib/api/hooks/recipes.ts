'use client'

import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
  useQueryClient,
} from '@tanstack/react-query'
import { RecipeMetadata } from '@/lib/types'
import {
  deleteRecipeById,
  getRecipeById,
  getRecipesMetadata,
  planRecipe,
} from '@/lib/api/client'
import { queryKeys } from '../query-keys'
import { PlannedMeal, Recipe } from '@prisma/client'
export const useRecipesMetadata = ({
  options = {},
}: {
  options?: Omit<
    UseQueryOptions<RecipeMetadata[], Error>,
    'queryKey' | 'queryFn'
  >
} = {}) => {
  return useQuery({
    ...options,
    queryKey: queryKeys.recipes.all,
    queryFn: async () => await getRecipesMetadata(),
  })
}

export const useRecipeById = ({
  id,
  options = {},
}: {
  id: string
  options?: Omit<UseQueryOptions<Recipe, Error>, 'queryKey' | 'queryFn'>
}) => {
  return useQuery({
    ...options,
    queryKey: queryKeys.recipes.byId(id),
    queryFn: async () => await getRecipeById(id),
  })
}

export const useDeleteRecipeById = ({
  id,
  options = {},
}: {
  id: string
  options?: Omit<UseMutationOptions<{ success: boolean }, Error>, 'mutationFn'>
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async () => await deleteRecipeById(id),
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context)
      queryClient.invalidateQueries({
        queryKey: queryKeys.recipes.all,
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.plannedMeals.all,
      })
    },
  })
}

export const usePlanRecipe = ({
  options = {},
}: {
  options?: Omit<UseMutationOptions<PlannedMeal, Error, string>, 'mutationFn'>
} = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (id: string) => await planRecipe(id),
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context)
      queryClient.invalidateQueries({
        queryKey: queryKeys.recipes.byId(variables),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.plannedMeals.all,
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.recipes.all,
      })
    },
  })
}
