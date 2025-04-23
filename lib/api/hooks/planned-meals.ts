import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { PlannedMealWithRecipe } from "@/lib/types";
import { updatePlannedMealAction } from "@/lib/actions/planned-meals";
import { PlannedMeal, PlannedMealStatus } from "@prisma/client";
import { getPlannedMealWithRecipeById } from "@/lib/api/client";



export const usePlannedMealWithRecipe = ({id, options}: {id: string, options: Omit<UseQueryOptions<PlannedMealWithRecipe, Error>, "queryKey" | "queryFn">}) => {
  return useQuery({
    queryKey: ["plannedMeal", id],
    queryFn: async () => await getPlannedMealWithRecipeById(id),
    ...options,
  });
};

export const useMarkAsCookedMutation = ({id, options}: {id: string, options: Omit<UseMutationOptions<PlannedMeal, Error, void>, "mutationFn">}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => 
      updatePlannedMealAction({
        id: id,
        status: PlannedMealStatus.COOKED,
        cookedAt: new Date(),
      }),
    ...options,
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options.onError?.(error, variables, context);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["plannedMeal", id] });
    },
  });
};