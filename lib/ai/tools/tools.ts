import { tool } from "ai";

import {
  getRecipesMetadataDefinition,
  createRecipeDefinition,
  deleteRecipeDefinition,
  getRecipeByIdDefinition,
  updateRecipeDefinition,
  updateUserProfileDefinition,
  renderRecipeSuggestionDefinition,
} from "@/lib/ai/tools/definitions";

import {
  getRecipesMetadataExecute,
  createRecipeExecute,
  deleteRecipeExecute,
  getRecipeByIdExecute,
  updateRecipeExecute,
  updateUserProfileExecute,
  renderRecipeSuggestionExecute,
} from "@/lib/ai/tools/execution";

export const getRecipesMetadataTool = tool({
  description: getRecipesMetadataDefinition.description,
  inputSchema: getRecipesMetadataDefinition.inputSchema,
  execute: getRecipesMetadataExecute,
});

export const getRecipeByIdTool = tool({
  description: getRecipeByIdDefinition.description,
  inputSchema: getRecipeByIdDefinition.inputSchema,
  execute: getRecipeByIdExecute,
});

export const createRecipeTool = tool({
  description: createRecipeDefinition.description,
  inputSchema: createRecipeDefinition.inputSchema,
  execute: createRecipeExecute,
});

export const updateRecipeTool = tool({
  description: updateRecipeDefinition.description,
  inputSchema: updateRecipeDefinition.inputSchema,
  execute: updateRecipeExecute,
});

export const deleteRecipeTool = tool({
  description: deleteRecipeDefinition.description,
  inputSchema: deleteRecipeDefinition.inputSchema,
  execute: deleteRecipeExecute,
});

export const renderRecipeSuggestionTool = tool({
  description: renderRecipeSuggestionDefinition.description,
  inputSchema: renderRecipeSuggestionDefinition.inputSchema,
  execute: renderRecipeSuggestionExecute,
});

export const updateUserProfileTool = tool({
  description: updateUserProfileDefinition.description,
  inputSchema: updateUserProfileDefinition.inputSchema,
  execute: updateUserProfileExecute,
});
