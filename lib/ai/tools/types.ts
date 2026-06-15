import { type z } from "zod";

export interface ToolDefinition {
  description: string;
  inputSchema: z.ZodTypeAny;
  result: z.ZodTypeAny;
}

// Type inference for tool parameters and results
export type ToolParameters<T extends ToolDefinition> = z.infer<
  T["inputSchema"]
>;
export type ToolRawResult<T extends ToolDefinition> = z.infer<T["result"]>;

export type ToolResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type ToolResultSuccess<T> = Extract<ToolResult<T>, { success: true }>;

export const defineTool = <T extends ToolDefinition>(tool: T) => tool;
