import { z } from 'zod'

export type ToolDefinition = {
  description: string
  inputSchema: z.ZodTypeAny
  result: z.ZodTypeAny
}

export type ToolDefinitions = Record<string, ToolDefinition>

// Type inference for tool parameters and results
export type ToolParameters<T extends ToolDefinition> = z.infer<T['inputSchema']>
export type ToolRawResult<T extends ToolDefinition> = z.infer<T['result']>

export type ToolResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export type ToolResultSuccess<T> = Extract<ToolResult<T>, { success: true }>
export type ToolResultError = Extract<ToolResult<unknown>, { success: false }>

export const defineTool = <T extends ToolDefinition>(tool: T) => tool
