import { QueryClient } from "@tanstack/react-query";
import { Message } from "ai";

type ToolEffect = (queryClient: QueryClient, result: unknown) => void;

function hasId(result: unknown): result is { id: string } {
  return typeof result === "object" && result !== null && "id" in result;
}

export const toolEffects: Record<string, ToolEffect> = {
  createPlannedMealTool: (qc) =>
    qc.invalidateQueries({ queryKey: ["planned-meals"] }),
  updatePlannedMealTool: (qc, result) => {
    qc.invalidateQueries({ queryKey: ["planned-meals"] });
    if (hasId(result)) {
      qc.invalidateQueries({ queryKey: ["planned-meals", result.id] });
    }
  },
  deletePlannedMealTool: (qc, result) => {
    qc.invalidateQueries({ queryKey: ["planned-meals"] });
    if (hasId(result)) {
      qc.invalidateQueries({ queryKey: ["planned-meals", result.id] });
    }
  },
  // Because delete operations on recipes cascade to planned meals
  deleteRecipeTool: (qc) =>
    qc.invalidateQueries({ queryKey: ["planned-meals"] }),
};

// Trigger tool effects when a message contains a tool invocation result
export const triggerToolEffects = (
  message: Message,
  queryClient: QueryClient
) => {
  if (!message.parts) {
    return;
  }
  for (const part of message.parts) {
    if (
      part.type === "tool-invocation" &&
      part.toolInvocation.state === "result"
    ) {
      const toolName = part.toolInvocation.toolName;
      const result = part.toolInvocation.result;
      const toolEffect = toolEffects[toolName];
      toolEffect(queryClient, result);
    }
  }
};
