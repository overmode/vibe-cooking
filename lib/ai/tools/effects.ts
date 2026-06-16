import { type QueryClient } from "@tanstack/react-query";
import { type UIMessage } from "ai";
import { type ToolResult, type ToolResultSuccess } from "@/lib/ai/tools/types";
import { queryKeys } from "@/lib/api/query-keys";

type ToolEffect = (
  queryClient: QueryClient,
  result: ToolResult<unknown>
) => void;

function hasId(
  result: ToolResult<unknown>
): result is ToolResultSuccess<{ id: string }> {
  return (
    result.success &&
    typeof result.data === "object" &&
    result.data !== null &&
    "id" in result.data
  );
}

const toolEffects: Record<string, ToolEffect> = {
  updateRecipeTool: (qc, result) => {
    void qc.invalidateQueries({ queryKey: queryKeys.recipes.all });
    if (hasId(result)) {
      void qc.invalidateQueries({
        queryKey: queryKeys.recipes.byId(result.data.id),
      });
    }
  },

  createRecipeTool: (qc) => {
    void qc.invalidateQueries({ queryKey: queryKeys.recipes.all });
  },

  updateUserProfileTool: (qc) => {
    void qc.invalidateQueries({ queryKey: queryKeys.userProfile.all });
  },
};

export const triggerToolEffects = (
  message: UIMessage,
  queryClient: QueryClient
) => {
  for (const part of message.parts) {
    if (
      part.type.startsWith("tool-") &&
      "state" in part &&
      part.state === "output-available" &&
      "output" in part
    ) {
      const toolName = part.type.slice("tool-".length);
      const result = part.output as ToolResult<unknown>;
      const effect = toolEffects[toolName];
      if (effect) {
        effect(queryClient, result);
      }
    }
  }
};
