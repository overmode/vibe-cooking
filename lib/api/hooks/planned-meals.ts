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
  deletePlannedMealById,
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

type StatusMutationContext = {
  previousPlannedMeal: PlannedMealWithRecipe | undefined
  previousPlannedMealsMetadata: PlannedMealMetadata[] | undefined
}

export const useUpdatePlannedMealStatusMutation = ({
  options = {},
}: {
  options?: Omit<
    UseMutationOptions<
      PlannedMeal,
      Error,
      CookedStatusVars,
      StatusMutationContext
    >,
    'mutationFn' | 'onMutate'
  >
} = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ id, status }) => updatePlannedMealStatus(id, status),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.plannedMeals.byId(variables.id),
      })
      await queryClient.cancelQueries({
        queryKey: queryKeys.plannedMeals.all,
      })

      // Snapshot the previous values
      const previousPlannedMeal =
        queryClient.getQueryData<PlannedMealWithRecipe>(
          queryKeys.plannedMeals.byId(variables.id)
        )
      const previousPlannedMealsMetadata = queryClient.getQueryData<
        PlannedMealMetadata[]
      >(queryKeys.plannedMeals.all)

      // Optimistically update the cache
      queryClient.setQueryData(
        queryKeys.plannedMeals.byId(variables.id),
        (old: PlannedMealWithRecipe | undefined) =>
          old
            ? {
                ...old,
                status: variables.status,
              }
            : undefined
      )
      queryClient.setQueryData(
        queryKeys.plannedMeals.all,
        (old: PlannedMealMetadata[] | undefined) =>
          old
            ? old.map((meal) =>
                meal.id === variables.id
                  ? { ...meal, status: variables.status }
                  : meal
              )
            : undefined
      )

      // Return the previous values to be used in onError
      return { previousPlannedMeal, previousPlannedMealsMetadata }
    },
    onError: (error, variables, context) => {
      // Rollback the previous state
      console.log('onError', error, variables, context)
      queryClient.setQueryData(
        queryKeys.plannedMeals.byId(variables.id),
        context?.previousPlannedMeal
      )
      queryClient.setQueryData(
        queryKeys.plannedMeals.all,
        context?.previousPlannedMealsMetadata
      )
      options.onError?.(error, variables, context)
    },
    onSettled: (data, error, variables, context) => {
      options.onSettled?.(data, error, variables, context)
      queryClient.invalidateQueries({ queryKey: queryKeys.plannedMeals.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.plannedMeals.byId(variables.id),
      })
      if (data?.recipeId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.recipes.byId(data.recipeId),
        })
      }
      options.onSettled?.(data, error, variables, context)
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

export const useDeletePlannedMealMutation = ({
  id,
  options = {},
}: {
  id: string
  options?: Omit<
    UseMutationOptions<{ success: boolean }, Error>,
    'mutationFn' | 'onMutate'
  >
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async () => await deletePlannedMealById(id),
    onMutate: async () => {
      // optimistic update for planned meals only
      await queryClient.cancelQueries({
        queryKey: queryKeys.plannedMeals.byId(id),
      })
      await queryClient.cancelQueries({
        queryKey: queryKeys.plannedMeals.all,
      })

      // snapshot the previous values
      const previousPlannedMeal =
        queryClient.getQueryData<PlannedMealWithRecipe>(
          queryKeys.plannedMeals.byId(id)
        )
      const previousPlannedMealsMetadata = queryClient.getQueryData<
        PlannedMealMetadata[]
      >(queryKeys.plannedMeals.all)

      // update the cache
      queryClient.setQueryData(queryKeys.plannedMeals.byId(id), undefined)
      queryClient.setQueryData(
        queryKeys.plannedMeals.all,
        (old: PlannedMealMetadata[] | undefined) =>
          old?.filter((meal) => meal.id !== id)
      )

      // return the previous values to be used in onError
      return { previousPlannedMeal, previousPlannedMealsMetadata }
    },
    onError: (error, variables, context) => {
      // rollback the previous state
      queryClient.setQueryData(
        queryKeys.plannedMeals.byId(id),
        context?.previousPlannedMeal
      )
      queryClient.setQueryData(
        queryKeys.plannedMeals.all,
        context?.previousPlannedMealsMetadata
      )
      options.onError?.(error, variables, context)
    },
    onSettled: (data, error, variables, context) => {
      options.onSettled?.(data, error, variables, context)
      queryClient.invalidateQueries({ queryKey: queryKeys.plannedMeals.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.plannedMeals.byId(id),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all })
    },
  })
}
