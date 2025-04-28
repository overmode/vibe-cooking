import { ToolParameters, ToolRawResult, ToolResult } from "@/lib/ai/tools/types";

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
} from "@/lib/ai/tools/definitions";

import {
  createRecipeAction,
  deleteRecipeAction,
  getRecipeByIdAction,
  getRecipesMetadataAction,
  updateRecipeAction,
} from "@/lib/actions/recipe";

import {
  createPlannedMealAction,
  deletePlannedMealAction,
  getPlannedMealByIdAction,
  getPlannedMealsMetadataAction,
  getPlannedMealsAction,
  updatePlannedMealAction,
} from "@/lib/actions/planned-meals";

// Recipe Tools

type GetRecipesMetadataResult = ToolRawResult<typeof getRecipesMetadataDefinition>;
export const getRecipesMetadataExecute = async (): Promise<ToolResult<GetRecipesMetadataResult>> => {
  try {
    const recipes = await getRecipesMetadataAction();
    return { success: true, data: recipes };
  } catch {
    return { success: false, error: "Error fetching recipes metadata" };
  }
};

type CreateRecipeParams = ToolParameters<typeof createRecipeDefinition>;
type CreateRecipeResult = ToolRawResult<typeof createRecipeDefinition>;
export const createRecipeExecute = async (
  parameters: CreateRecipeParams
): Promise<ToolResult<CreateRecipeResult>> => {
  try {
    const recipe = await createRecipeAction(parameters);
    return { success: true, data: recipe };
  } catch {
    return { success: false, error: "Error creating recipe" };
  }
};

type DeleteRecipeParams = ToolParameters<typeof deleteRecipeDefinition>;
type DeleteRecipeResult = ToolRawResult<typeof deleteRecipeDefinition>;
export const deleteRecipeExecute = async (
  parameters: DeleteRecipeParams
): Promise<ToolResult<DeleteRecipeResult>> => {
  try {
    await deleteRecipeAction(parameters.id);
    return { success: true, data: "Recipe deleted successfully" };
  } catch {
    return { success: false, error: "Error deleting recipe" };
  }
};

type GetRecipeByIdParams = ToolParameters<typeof getRecipeByIdDefinition>;
type GetRecipeByIdResult = ToolRawResult<typeof getRecipeByIdDefinition>;
export const getRecipeByIdExecute = async (
  parameters: GetRecipeByIdParams
): Promise<ToolResult<GetRecipeByIdResult>> => {
  try {
    const recipe = await getRecipeByIdAction(parameters.id);
    return { success: true, data: recipe };
  } catch {
    return { success: false, error: "Error fetching recipe by ID" };
  }
};

type UpdateRecipeParams = ToolParameters<typeof updateRecipeDefinition>;
type UpdateRecipeResult = ToolRawResult<typeof updateRecipeDefinition>;
export const updateRecipeExecute = async (
  parameters: UpdateRecipeParams
): Promise<ToolResult<UpdateRecipeResult>> => {
  try {
    const recipe = await updateRecipeAction(parameters);
    return { success: true, data: recipe };
  } catch {
    return { success: false, error: "Error updating recipe" };
  }
};


// Planned Meal Tools

type GetPlannedMealsMetadataResult = ToolRawResult<typeof getPlannedMealsMetadataDefinition>;
export const getPlannedMealsMetadataExecute = async (): Promise<ToolResult<GetPlannedMealsMetadataResult>> => {
  try {
    const meals = await getPlannedMealsMetadataAction();
    return { success: true, data: meals };
  } catch {
    return { success: false, error: "Error fetching planned meals metadata" };
  }
};

type CreatePlannedMealParams = ToolParameters<typeof createPlannedMealDefinition>;
type CreatePlannedMealResult = ToolRawResult<typeof createPlannedMealDefinition>;
export const createPlannedMealExecute = async (
  parameters: CreatePlannedMealParams
): Promise<ToolResult<CreatePlannedMealResult>> => {
  try {
    const meal = await createPlannedMealAction(parameters);
    return { success: true, data: meal };
  } catch {
    return { success: false, error: "Error creating planned meal" };
  }
};

type UpdatePlannedMealParams = ToolParameters<typeof updatePlannedMealDefinition>;
type UpdatePlannedMealResult = ToolRawResult<typeof updatePlannedMealDefinition>;
export const updatePlannedMealExecute = async (
  parameters: UpdatePlannedMealParams
): Promise<ToolResult<UpdatePlannedMealResult>> => {
  try {
    const meal = await updatePlannedMealAction(parameters);
    return { success: true, data: meal };
  } catch {
    return { success: false, error: "Error updating planned meal" };
  }
};

type DeletePlannedMealParams = ToolParameters<typeof deletePlannedMealDefinition>;
type DeletePlannedMealResult = ToolRawResult<typeof deletePlannedMealDefinition>;
export const deletePlannedMealExecute = async (
  parameters: DeletePlannedMealParams
): Promise<ToolResult<DeletePlannedMealResult>> => {
  try {
    await deletePlannedMealAction(parameters.id);
    return { success: true, data: "Planned meal deleted successfully" };
  } catch {
    return { success: false, error: "Error deleting planned meal" };
  }
};

type GetPlannedMealByIdParams = ToolParameters<typeof getPlannedMealByIdDefinition>;
type GetPlannedMealByIdResult = ToolRawResult<typeof getPlannedMealByIdDefinition>;
export const getPlannedMealByIdExecute = async (
  parameters: GetPlannedMealByIdParams
): Promise<ToolResult<GetPlannedMealByIdResult>> => {
  try {
    const meal = await getPlannedMealByIdAction(parameters.id);
    return { success: true, data: meal };
  } catch {
    return { success: false, error: "Error fetching planned meal by ID" };
  }
};

type GetPlannedMealsResult = ToolRawResult<typeof getPlannedMealsDefinition>;
export const getPlannedMealsExecute = async (): Promise<ToolResult<GetPlannedMealsResult>> => {
  try {
    const meals = await getPlannedMealsAction();
    return { success: true, data: meals };
  } catch {
    return { success: false, error: "Error fetching planned meals" };
  }
};
