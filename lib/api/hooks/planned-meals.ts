import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { PlannedMealWithRecipe } from "@/lib/types";
import { PlannedMeal } from "@prisma/client";
import { getPlannedMealWithRecipeById, updatePlannedMeal } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import { UpdatePlannedMealInput } from "@/lib/validators/plannedMeals";


export const usePlannedMealWithRecipe = ({id, options}: {id: string, options: Omit<UseQueryOptions<PlannedMealWithRecipe, Error>, "queryKey" | "queryFn">}) => {
  return useQuery({
    queryKey: queryKeys.plannedMeals.byId(id),
    queryFn: async () => await getPlannedMealWithRecipeById(id),
    ...options,
  });
};

export const useUpdatePlannedMealMutation = ({options}: {options: Omit<UseMutationOptions<PlannedMeal, Error, UpdatePlannedMealInput>, "mutationFn">}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updateData : UpdatePlannedMealInput) => {
      const updatedPlannedMeal = await updatePlannedMeal(updateData);
      return updatedPlannedMeal;
    },
    ...options,
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options.onError?.(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      options.onSettled?.(data, error, variables, context);
      queryClient.invalidateQueries({ queryKey: queryKeys.plannedMeals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.plannedMeals.byId(variables.id) });
    },
  });
};
