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
} from '@/lib/api/client'
import { queryKeys } from '../query-keys'
import { Recipe } from '@/generated/prisma/browser'

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
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.recipes.byId(id),
      })
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      options.onSuccess?.(data, variables, onMutateResult, context)
      queryClient.removeQueries({
        queryKey: queryKeys.recipes.byId(id),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.recipes.all,
      })
    },
  })
}
