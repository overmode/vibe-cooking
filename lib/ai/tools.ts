import {
  CreateRecipeInput,
  createRecipeInputSchema,
  UpdateRecipeInput,
  updateRecipeInputSchema,
} from "@/lib/validators/recipe";

import {
  createRecipeAction,
  deleteRecipeAction,
  getRecipeByIdAction,
  getRecipesMetadataAction,
  updateRecipeAction,
} from "@/lib/actions/recipe";
import { z } from "zod";
import { tool } from "ai";
import {
  getPlannedMealsMetadataAction,
  createPlannedMealAction,
  deletePlannedMealAction,
  updatePlannedMealAction,
  getPlannedMealByIdAction,
  getPlannedMealsAction,
} from "@/lib/actions/planned-meals";
import {
  CreatePlannedMealInput,
  createPlannedMealInputSchema,
  UpdatePlannedMealInput,
  updatePlannedMealInputSchema,
} from "@/lib/validators/plannedMeals";

export const getRecipesMetadataTool = tool({
  description: "Get the metadata of all recipes belonging to the user.",
  parameters: z.object({}),
  execute: async () => {
    const recipes = await getRecipesMetadataAction();
    return recipes;
  },
});

export const getPlannedMealsMetadataTool = tool({
  description:
    "Get the metadata of all planned meals with status PLANNED belonging to the user.",
  parameters: z.object({}),
  execute: async () => {
    const plannedMeals = await getPlannedMealsMetadataAction();
    return plannedMeals;
  },
});

export const getPlannedMealsTool = tool({
  description:
    "Get all planned meals with status PLANNED belonging to the user. Useful for fetching all ingredients of upcoming meals.",
  parameters: z.object({}),
  execute: async () => {
    const plannedMeals = await getPlannedMealsAction();
    return plannedMeals;
  },
});

export const getRecipeByIdTool = tool({
  description: "Get a Recipe object by ID.",
  parameters: z.object({
    id: z.string().describe("The ID of the recipe to get"),
  }),
  execute: async (parameters: { id: string }) => {
    const recipe = await getRecipeByIdAction(parameters.id);
    return recipe;
  },
});

export const getPlannedMealByIdTool = tool({
  description: "Get a PlannedMeal object by ID.",
  parameters: z.object({
    id: z.string().describe("The ID of the planned meal to get"),
  }),
  execute: async (parameters: { id: string }) => {
    const plannedMeal = await getPlannedMealByIdAction(parameters.id);
    return plannedMeal;
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

export const createPlannedMealTool = tool({
  description: "Create a PlannedMeal object.",
  parameters: createPlannedMealInputSchema,
  execute: async (parameters: CreatePlannedMealInput) => {
    const plannedMeal = await createPlannedMealAction(parameters);
    return plannedMeal;
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

export const updatePlannedMealTool = tool({
  description: "Update a PlannedMeal object.",
  parameters: updatePlannedMealInputSchema,
  execute: async (parameters: UpdatePlannedMealInput) => {
    const plannedMeal = await updatePlannedMealAction(parameters);
    return plannedMeal;
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

export const deletePlannedMealTool = tool({
  description: "Delete a PlannedMeal object.",
  parameters: z.object({
    id: z.string().describe("The id of the planned meal to be deleted"),
  }),
  execute: async (parameters: { id: string }) => {
    await deletePlannedMealAction(parameters.id);
    return "Planned meal deleted successfully";
  },
});

export const renderRecipePreviewTool = tool({
  description: "Renders a preview of a full recipe.",
  parameters: createRecipeInputSchema,
});
