import { tool } from "ai";

import {
  getRecipesMetadataDefinition,
  createRecipeDefinition,
  getRecipeByIdDefinition,
  updateRecipeDefinition,
  updateUserProfileDefinition,
  renderRecipeSuggestionDefinition,
} from "@/lib/ai/tools/definitions";

import {
  getRecipesMetadataExecute,
  createRecipeExecute,
  getRecipeByIdExecute,
  updateRecipeExecute,
  updateUserProfileExecute,
  renderRecipeSuggestionExecute,
} from "@/lib/ai/tools/execution";

// Tools close over the authenticated userId resolved at the route boundary,
// so tool execution never re-resolves identity.
export const buildAssistantTools = (userId: string) => ({
  getRecipesMetadataTool: tool({
    description: getRecipesMetadataDefinition.description,
    inputSchema: getRecipesMetadataDefinition.inputSchema,
    execute: () => getRecipesMetadataExecute(userId),
  }),

  getRecipeByIdTool: tool({
    description: getRecipeByIdDefinition.description,
    inputSchema: getRecipeByIdDefinition.inputSchema,
    execute: (parameters) => getRecipeByIdExecute(userId, parameters),
  }),

  createRecipeTool: tool({
    description: createRecipeDefinition.description,
    inputSchema: createRecipeDefinition.inputSchema,
    execute: (parameters) => createRecipeExecute(userId, parameters),
  }),

  updateRecipeTool: tool({
    description: updateRecipeDefinition.description,
    inputSchema: updateRecipeDefinition.inputSchema,
    execute: (parameters) => updateRecipeExecute(userId, parameters),
  }),

  renderRecipeSuggestionTool: tool({
    description: renderRecipeSuggestionDefinition.description,
    inputSchema: renderRecipeSuggestionDefinition.inputSchema,
    execute: renderRecipeSuggestionExecute,
  }),

  updateUserProfileTool: tool({
    description: updateUserProfileDefinition.description,
    inputSchema: updateUserProfileDefinition.inputSchema,
    execute: (parameters) => updateUserProfileExecute(userId, parameters),
  }),
});
