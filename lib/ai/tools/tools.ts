import { tool } from "ai";

import {
  getRecipesMetadataDefinition,
  createRecipeDefinition,
  deleteRecipeDefinition,
  getRecipeByIdDefinition,
  updateRecipeDefinition,
  getPlannedMealsMetadataDefinition,
  createPlannedMealDefinition,
  updatePlannedMealDefinition,
  deletePlannedMealDefinition,
  getPlannedMealByIdDefinition,
  getPlannedMealsDefinition,
  renderRecipeSuggestionDefinition,
  enterCookingModeDefinition,
} from "@/lib/ai/tools/definitions";

import {
  getRecipesMetadataExecute,
  createRecipeExecute,
  deleteRecipeExecute,
  getRecipeByIdExecute,
  updateRecipeExecute,
  getPlannedMealsMetadataExecute,
  createPlannedMealExecute,
  updatePlannedMealExecute,
  deletePlannedMealExecute,
  getPlannedMealByIdExecute,
  getPlannedMealsExecute,
  renderRecipeSuggestionExecute,
} from "@/lib/ai/tools/execution";

export const getRecipesMetadataTool = tool({
  description: getRecipesMetadataDefinition.description,
  inputSchema: getRecipesMetadataDefinition.inputSchema,
  execute: getRecipesMetadataExecute,
});

export const getPlannedMealsMetadataTool = tool({
  description: getPlannedMealsMetadataDefinition.description,
  inputSchema: getPlannedMealsMetadataDefinition.inputSchema,
  execute: getPlannedMealsMetadataExecute,
});

export const getPlannedMealsTool = tool({
  description: getPlannedMealsDefinition.description,
  inputSchema: getPlannedMealsDefinition.inputSchema,
  execute: getPlannedMealsExecute,
});

export const getRecipeByIdTool = tool({
  description: getRecipeByIdDefinition.description,
  inputSchema: getRecipeByIdDefinition.inputSchema,
  execute: getRecipeByIdExecute,
});

export const getPlannedMealByIdTool = tool({
  description: getPlannedMealByIdDefinition.description,
  inputSchema: getPlannedMealByIdDefinition.inputSchema,
  execute: getPlannedMealByIdExecute,
});

export const createRecipeTool = tool({
  description: createRecipeDefinition.description,
  inputSchema: createRecipeDefinition.inputSchema,
  execute: createRecipeExecute,
});

export const createPlannedMealTool = tool({
  description: createPlannedMealDefinition.description,
  inputSchema: createPlannedMealDefinition.inputSchema,
  execute: createPlannedMealExecute,
});

export const updateRecipeTool = tool({
  description: updateRecipeDefinition.description,
  inputSchema: updateRecipeDefinition.inputSchema,
  execute: updateRecipeExecute,
});

export const updatePlannedMealTool = tool({
  description: updatePlannedMealDefinition.description,
  inputSchema: updatePlannedMealDefinition.inputSchema,
  execute: updatePlannedMealExecute,
});

export const deleteRecipeTool = tool({
  description: deleteRecipeDefinition.description,
  inputSchema: deleteRecipeDefinition.inputSchema,
  execute: deleteRecipeExecute,
});

export const deletePlannedMealTool = tool({
  description: deletePlannedMealDefinition.description,
  inputSchema: deletePlannedMealDefinition.inputSchema,
  execute: deletePlannedMealExecute,
});

export const renderRecipeSuggestionTool = tool({
  description: renderRecipeSuggestionDefinition.description,
  inputSchema: renderRecipeSuggestionDefinition.inputSchema,
  execute: renderRecipeSuggestionExecute,
});

export const enterCookingModeTool = tool({
  description: enterCookingModeDefinition.description,
  inputSchema: enterCookingModeDefinition.inputSchema,
  // client-side only
});

export const tools = [
  getRecipesMetadataTool,
  getPlannedMealsMetadataTool,
  getPlannedMealsTool,
  getRecipeByIdTool,
  getPlannedMealByIdTool,
  createRecipeTool,
  createPlannedMealTool,
  updateRecipeTool,
  updatePlannedMealTool,
  deleteRecipeTool,
  deletePlannedMealTool,
  renderRecipeSuggestionTool,
  enterCookingModeTool,
];
