"use client";

import { type UIMessage } from "ai";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getThreadMessages, getThreads } from "@/lib/api/client";
import { type ThreadMetadata } from "@/lib/types";
import { queryKeys } from "../query-keys";

export const useThreads = (
  options: Omit<UseQueryOptions<ThreadMetadata[]>, "queryKey" | "queryFn"> = {}
) => {
  return useQuery({
    ...options,
    queryKey: queryKeys.chatThreads.all,
    queryFn: getThreads,
  });
};

export const useThreadMessages = ({
  threadId,
  options = {},
}: {
  threadId: string;
  options?: Omit<UseQueryOptions<UIMessage[]>, "queryKey" | "queryFn">;
}) => {
  return useQuery({
    ...options,
    queryKey: queryKeys.chatThreads.byId(threadId),
    queryFn: async () => await getThreadMessages(threadId),
  });
};
