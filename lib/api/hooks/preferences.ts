import {
  getUserDietaryPreferences,
  updateUserDietaryPreferences,
} from "@/lib/api/client";
import { UserDietaryPreferences } from "@prisma/client";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";

export const useUserDietaryPreferences = ({
  options,
}: {
  options?: Omit<
    UseQueryOptions<UserDietaryPreferences | null, Error>,
    "queryKey" | "queryFn"
  >;
}) => {
  return useQuery({
    ...options,
    queryKey: queryKeys.preferences.all,
    queryFn: async () => await getUserDietaryPreferences(),
  });
};

export const useUpdateUserDietaryPreferences = ({
  options,
}: {
  options?: Omit<
    UseMutationOptions<UserDietaryPreferences, Error, string>,
    "mutationFn"
  >;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async (preferences: string) =>
      await updateUserDietaryPreferences(preferences),
    onMutate: async (variables) => {
      options?.onMutate?.(variables);

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.preferences.all,
      });

      // Snapshot the previous value
      const previousPreferences =
        queryClient.getQueryData<UserDietaryPreferences>(
          queryKeys.preferences.all
        );

      // Optimistically update the cache
      queryClient.setQueryData(
        queryKeys.preferences.all,
        (old: UserDietaryPreferences) =>
          old ? { ...old, preferences: variables } : old
      );
      return { previousPreferences };
    },
    onError: (error, variables, context) => {
      // Rollback the previous state
      queryClient.setQueryData(
        queryKeys.preferences.all,
        context?.previousPreferences
      );
      options?.onError?.(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      options?.onSettled?.(data, error, variables, context);
      queryClient.invalidateQueries({ queryKey: queryKeys.preferences.all });
    },
  });
};
