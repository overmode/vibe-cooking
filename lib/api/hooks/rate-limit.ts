import { getLimits } from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { type Limits } from "@/lib/types";

// While loading we report no usage, keeping the UI optimistically enabled.
const NO_USAGE: Limits = {
  messageCount: 0,
  voiceSeconds: 0,
  searchCount: 0,
  messageLimitReached: false,
  voiceLimitReached: false,
  searchLimitReached: false,
};

// Surfaces today's limit verdicts so inputs can be disabled before the user
// acts. Verdicts come from the server (single source of truth).
export const useRateLimit = (): Limits => {
  const { data } = useQuery({
    queryKey: queryKeys.rateLimit.all,
    queryFn: getLimits,
  });

  return data ?? NO_USAGE;
};
