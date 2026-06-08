import {
  ToolParameters,
  ToolRawResult,
  ToolResult,
} from "@/lib/ai/tools/types";

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
  createRecipeAction,
  deleteRecipeAction,
  getRecipeByIdAction,
  getRecipesMetadataAction,
  updateRecipeAction,
} from "@/lib/actions/recipe";
import { updateUserProfileAction } from "@/lib/actions/user-profile";

type GetRecipesMetadataResult = ToolRawResult<
  typeof getRecipesMetadataDefinition
>;
export const getRecipesMetadataExecute = async (): Promise<
  ToolResult<GetRecipesMetadataResult>
> => {
  try {
    const recipes = await getRecipesMetadataAction();
    return { success: true, data: recipes };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error fetching recipes metadata",
    };
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
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error creating recipe",
    };
  }
};

type DeleteRecipeParams = ToolParameters<typeof deleteRecipeDefinition>;
type DeleteRecipeResult = ToolRawResult<typeof deleteRecipeDefinition>;
export const deleteRecipeExecute = async (
  parameters: DeleteRecipeParams
): Promise<ToolResult<DeleteRecipeResult>> => {
  try {
    await deleteRecipeAction({ recipeId: parameters.id });
    return { success: true, data: "Recipe deleted successfully" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error deleting recipe",
    };
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
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error fetching recipe by ID",
    };
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
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error updating recipe",
    };
  }
};

type RenderRecipeSuggestionResult = ToolRawResult<
  typeof renderRecipeSuggestionDefinition
>;
export const renderRecipeSuggestionExecute = async (): Promise<
  ToolResult<RenderRecipeSuggestionResult>
> => {
  return { success: true, data: "Recipe suggestion rendered successfully." };
};

type UpdateUserProfileParams = ToolParameters<typeof updateUserProfileDefinition>;
type UpdateUserProfileResult = ToolRawResult<typeof updateUserProfileDefinition>;
export const updateUserProfileExecute = async (
  parameters: UpdateUserProfileParams
): Promise<ToolResult<UpdateUserProfileResult>> => {
  try {
    const profile = await updateUserProfileAction(parameters.profile, "ASSISTANT");
    return { success: true, data: profile };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error updating user profile",
    };
  }
};
