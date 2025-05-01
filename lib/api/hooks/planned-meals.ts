import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import { PlannedMealWithRecipe, PlannedMealMetadata } from '@/lib/types'
import { PlannedMeal, PlannedMealStatus } from '@prisma/client'
import {
  getPlannedMealsMetadata,
  getPlannedMealWithRecipeById,
  updatePlannedMealStatus,
  updatePlannedMeal,
} from '@/lib/api/client'
import { queryKeys } from '@/lib/api/query-keys'
import { UpdatePlannedMealInput } from '@/lib/validators/plannedMeals'

export const usePlannedMealWithRecipe = ({
  id,
  options = {},
}: {
  id: string
  options?: Omit<
    UseQueryOptions<PlannedMealWithRecipe, Error>,
    'queryKey' | 'queryFn'
  >
}) => {
  return useQuery({
    ...options,
    queryKey: queryKeys.plannedMeals.byId(id),
    queryFn: async () => await getPlannedMealWithRecipeById(id),
  })
}

export const usePlannedMealsMetadata = ({
  options = {},
}: {
  options?: Omit<
    UseQueryOptions<PlannedMealMetadata[], Error>,
    'queryKey' | 'queryFn'
  >
} = {}) => {
  return useQuery({
    ...options,
    queryKey: queryKeys.plannedMeals.all,
    queryFn: async () => await getPlannedMealsMetadata(),
  })
}

type CookedStatusVars = {
  id: string
  status: PlannedMealStatus
}
export const useUpdatePlannedMealStatusMutation = ({
  options = {},
}: {
  options?: Omit<
    UseMutationOptions<PlannedMeal, Error, CookedStatusVars>,
    'mutationFn'
  >
} = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ id, status }) => updatePlannedMealStatus(id, status),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plannedMeals.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.plannedMeals.byId(variables.id),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.recipes.byId(data.recipeId),
      })
      options.onSuccess?.(data, variables, context)
    },
  })
}

export const useUpdatePlannedMealMutation = ({
  options = {},
}: {
  options?: Omit<
    UseMutationOptions<PlannedMeal, Error, UpdatePlannedMealInput>,
    'mutationFn'
  >
} = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (updateData: UpdatePlannedMealInput) => {
      const updatedPlannedMeal = await updatePlannedMeal(updateData)
      return updatedPlannedMeal
    },
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context)
    },
    onError: (error, variables, context) => {
      options.onError?.(error, variables, context)
    },
    onSettled: (data, error, variables, context) => {
      options.onSettled?.(data, error, variables, context)
      queryClient.invalidateQueries({ queryKey: queryKeys.plannedMeals.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.plannedMeals.byId(variables.id),
      })
    },
  })
}
