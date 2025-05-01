'use client'

import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query'
import { RecipeMetadata } from '@/lib/types'
import {
  deleteRecipeById,
  getRecipeById,
  getRecipesMetadata,
} from '@/lib/api/client'
import { queryKeys } from '../query-keys'
import { Recipe } from '@prisma/client'
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
  return useMutation({
    ...options,
    mutationFn: async () => await deleteRecipeById(id),
  })
}
