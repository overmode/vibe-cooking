import {
  type ToolParameters,
  type ToolRawResult,
  type ToolResult,
} from "@/lib/ai/tools/types";

import {
  type getRecipesMetadataDefinition,
  type createRecipeDefinition,
  type getRecipeByIdDefinition,
  type updateRecipeDefinition,
  type updateUserProfileDefinition,
  type renderRecipeSuggestionDefinition,
} from "@/lib/ai/tools/definitions";

import {
  createRecipeAction,
  getRecipeByIdAction,
  getRecipesMetadataAction,
  updateRecipeAction,
} from "@/lib/actions/recipe";
import { updateUserProfileAction } from "@/lib/actions/user-profile";

type GetRecipesMetadataResult = ToolRawResult<
  typeof getRecipesMetadataDefinition
>;
export const getRecipesMetadataExecute = async (
  userId: string
): Promise<ToolResult<GetRecipesMetadataResult>> => {
  try {
    const recipes = await getRecipesMetadataAction(userId);
    return { success: true, data: recipes.map(stripCreatedAt) };
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
  userId: string,
  parameters: CreateRecipeParams
): Promise<ToolResult<CreateRecipeResult>> => {
  try {
    const recipe = await createRecipeAction(userId, parameters, "ASSISTANT");
    return { success: true, data: stripCreatedAt(recipe) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error creating recipe",
    };
  }
};

type GetRecipeByIdParams = ToolParameters<typeof getRecipeByIdDefinition>;
type GetRecipeByIdResult = ToolRawResult<typeof getRecipeByIdDefinition>;
export const getRecipeByIdExecute = async (
  userId: string,
  parameters: GetRecipeByIdParams
): Promise<ToolResult<GetRecipeByIdResult>> => {
  try {
    const recipe = await getRecipeByIdAction(userId, parameters.id);
    return { success: true, data: stripCreatedAt(recipe) };
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
  userId: string,
  parameters: UpdateRecipeParams
): Promise<ToolResult<UpdateRecipeResult>> => {
  try {
    const recipe = await updateRecipeAction(userId, parameters, "ASSISTANT");
    return { success: true, data: stripCreatedAt(recipe) };
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
export const renderRecipeSuggestionExecute = (): Promise<
  ToolResult<RenderRecipeSuggestionResult>
> => {
  return Promise.resolve({
    success: true,
    data: "Recipe suggestion rendered successfully.",
  });
};

type UpdateUserProfileParams = ToolParameters<
  typeof updateUserProfileDefinition
>;
type UpdateUserProfileResult = ToolRawResult<
  typeof updateUserProfileDefinition
>;
export const updateUserProfileExecute = async (
  userId: string,
  parameters: UpdateUserProfileParams
): Promise<ToolResult<UpdateUserProfileResult>> => {
  try {
    const profile = await updateUserProfileAction(
      userId,
      parameters.profile,
      "ASSISTANT"
    );
    return { success: true, data: profile };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error updating user profile",
    };
  }
};

// Tools don't expose createdAt: the model doesn't need timestamps and OpenAI's
// app review flags them. Kept in the domain types for the web app's sort.
export const stripCreatedAt = <T extends { createdAt: Date }>(
  value: T
): Omit<T, "createdAt"> => {
  const rest = { ...value };
  delete (rest as Partial<T>).createdAt;
  return rest;
};
