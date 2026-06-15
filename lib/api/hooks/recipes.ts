"use client";

import {
  useMutation,
  type UseMutationOptions,
  useQuery,
  type UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { type Recipe, type RecipeMetadata } from "@/lib/types";
import {
  deleteRecipeById,
  getRecipeById,
  getRecipesMetadata,
} from "@/lib/api/client";
import { queryKeys } from "../query-keys";

export const useRecipesMetadata = ({
  options = {},
}: {
  options?: Omit<UseQueryOptions<RecipeMetadata[]>, "queryKey" | "queryFn">;
} = {}) => {
  return useQuery({
    ...options,
    queryKey: queryKeys.recipes.all,
    queryFn: async () => await getRecipesMetadata(),
  });
};

export const useRecipeById = ({
  id,
  options = {},
}: {
  id: string;
  options?: Omit<UseQueryOptions<Recipe>, "queryKey" | "queryFn">;
}) => {
  return useQuery({
    ...options,
    queryKey: queryKeys.recipes.byId(id),
    queryFn: async () => await getRecipeById(id),
  });
};

export const useDeleteRecipeById = ({
  id,
  options = {},
}: {
  id: string;
  options?: Omit<UseMutationOptions<{ success: boolean }>, "mutationFn">;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async () => await deleteRecipeById(id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.recipes.byId(id),
      });
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      options.onSuccess?.(data, variables, onMutateResult, context);
      queryClient.removeQueries({
        queryKey: queryKeys.recipes.byId(id),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.recipes.all,
      });
    },
  });
};
