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
  renderRecipePreviewDefinition,
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
} from "@/lib/ai/tools/execution";

export const getRecipesMetadataTool = tool({
  description: getRecipesMetadataDefinition.description,
  parameters: getRecipesMetadataDefinition.parameters,
  execute: getRecipesMetadataExecute,
});

export const getPlannedMealsMetadataTool = tool({
  description: getPlannedMealsMetadataDefinition.description,
  parameters: getPlannedMealsMetadataDefinition.parameters,
  execute: getPlannedMealsMetadataExecute,
});

export const getPlannedMealsTool = tool({
  description: getPlannedMealsDefinition.description,
  parameters: getPlannedMealsDefinition.parameters,
  execute: getPlannedMealsExecute,
});

export const getRecipeByIdTool = tool({
  description: getRecipeByIdDefinition.description,
  parameters: getRecipeByIdDefinition.parameters,
  execute: getRecipeByIdExecute,
});

export const getPlannedMealByIdTool = tool({
  description: getPlannedMealByIdDefinition.description,
  parameters: getPlannedMealByIdDefinition.parameters,
  execute: getPlannedMealByIdExecute,
});

export const createRecipeTool = tool({
  description: createRecipeDefinition.description,
  parameters: createRecipeDefinition.parameters,
  execute: createRecipeExecute,
});

export const createPlannedMealTool = tool({
  description: createPlannedMealDefinition.description,
  parameters: createPlannedMealDefinition.parameters,
  execute: createPlannedMealExecute,
});

export const updateRecipeTool = tool({
  description: updateRecipeDefinition.description,
  parameters: updateRecipeDefinition.parameters,
  execute: updateRecipeExecute,
});

export const updatePlannedMealTool = tool({
  description: updatePlannedMealDefinition.description,
  parameters: updatePlannedMealDefinition.parameters,
  execute: updatePlannedMealExecute,
});

export const deleteRecipeTool = tool({
  description: deleteRecipeDefinition.description,
  parameters: deleteRecipeDefinition.parameters,
  execute: deleteRecipeExecute,
});

export const deletePlannedMealTool = tool({
  description: deletePlannedMealDefinition.description,
  parameters: deletePlannedMealDefinition.parameters,
  execute: deletePlannedMealExecute,
});

export const renderRecipePreviewTool = tool({
  description: renderRecipePreviewDefinition.description,
  parameters: renderRecipePreviewDefinition.parameters,
  // client-side only
});

export const enterCookingModeTool = tool({
  description: enterCookingModeDefinition.description,
  parameters: enterCookingModeDefinition.parameters,
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
  renderRecipePreviewTool,
  enterCookingModeTool,
];