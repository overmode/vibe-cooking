"use client";

import { type UIMessage } from "ai";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getThreadMessages } from "@/lib/api/client";
import { queryKeys } from "../query-keys";

export const useThreadMessages = ({
  threadId,
  options = {},
}: {
  threadId: string;
  options?: Omit<UseQueryOptions<UIMessage[], Error>, "queryKey" | "queryFn">;
}) => {
  return useQuery({
    ...options,
    queryKey: queryKeys.chatThreads.byId(threadId),
    queryFn: async () => await getThreadMessages(threadId),
  });
};
