import {
  CreateRecipeInput,
  createRecipeInputSchema,
  UpdateRecipeInput,
  updateRecipeInputSchema,
} from "@/lib/validators/recipe";

import {
  createRecipeAction,
  deleteRecipeAction,
  getRecipesMetadataAction,
  updateRecipeAction,
} from "@/lib/actions/recipe";
import { z } from "zod";
import { tool } from "ai";

export const getRecipesMetadataTool = tool({
  description: "Get the metadata of all recipes belonging to the user.",
  parameters: z.object({}),
  execute: async () => {
    const recipes = await getRecipesMetadataAction();
    return recipes;
  },
});

export const createRecipeTool = tool({
  description: "Create a Recipe object.",
  parameters: createRecipeInputSchema,
  execute: async (parameters: CreateRecipeInput) => {
    const recipe = await createRecipeAction(parameters);
    return recipe;
  },
});

export const updateRecipeTool = tool({
  description: "Update a Recipe object.",
  parameters: updateRecipeInputSchema,
  execute: async (parameters: UpdateRecipeInput) => {
    const recipe = await updateRecipeAction(parameters);
    return recipe;
  },
});

export const deleteRecipeTool = tool({
  description: "Delete a Recipe object.",
  parameters: z.object({
    id: z.string().describe("The id of the recipe to be deleted"),
  }),
  execute: async (parameters: { id: string }) => {
    await deleteRecipeAction(parameters.id);
    return "Recipe deleted successfully";
  },
});

export const renderRecipePreviewTool = tool({
  description: "Renders a preview of a full recipe.",
  parameters: createRecipeInputSchema,
});
