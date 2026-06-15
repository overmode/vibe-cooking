import { getUserProfile, updateUserProfile } from "@/lib/api/client";
import { type UserProfile } from "@/lib/types";
import {
  useMutation,
  type UseMutationOptions,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";

export const useUserProfile = ({
  options,
}: {
  options?: Omit<UseQueryOptions<UserProfile | null>, "queryKey" | "queryFn">;
}) => {
  return useQuery({
    ...options,
    queryKey: queryKeys.userProfile.all,
    queryFn: async () => await getUserProfile(),
  });
};

export const useUpdateUserProfile = ({
  options,
}: {
  options?: Omit<UseMutationOptions<UserProfile, Error, string>, "mutationFn">;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async (content: string) => await updateUserProfile(content),
    onMutate: async (variables, context) => {
      options?.onMutate?.(variables, context);

      await queryClient.cancelQueries({ queryKey: queryKeys.userProfile.all });

      const previousProfile = queryClient.getQueryData<UserProfile | null>(
        queryKeys.userProfile.all
      );

      queryClient.setQueryData<UserProfile>(queryKeys.userProfile.all, {
        content: variables,
      });

      return { previousProfile };
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData(queryKeys.userProfile.all, data);
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      queryClient.setQueryData(
        queryKeys.userProfile.all,
        onMutateResult?.previousProfile
      );
      options?.onError?.(error, variables, onMutateResult, context);
    },
  });
};
