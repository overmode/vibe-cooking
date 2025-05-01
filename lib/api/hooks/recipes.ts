"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { RecipeMetadata } from "@/lib/types";
import { getRecipesMetadata } from "../client";
import { queryKeys } from "../query-keys";

export const useRecipesMetadata = ({options = {}}: {options?: Omit<UseQueryOptions<RecipeMetadata[], Error>, "queryKey" | "queryFn">} = {}) => {
  return useQuery({
    ...options,
    queryKey: queryKeys.recipes.all,
    queryFn: async () => await getRecipesMetadata(),
  });
};
