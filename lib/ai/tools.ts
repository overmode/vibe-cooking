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
import { Recipe } from "@prisma/client";
import { PlannedMealMetadata, RecipeMetadata, ToolResult } from "@/lib/types";
import { PlannedMeal } from "@prisma/client";
export const getRecipesMetadataTool = tool({
  description: "Get the metadata of all recipes belonging to the user.",
  parameters: z.object({}),
  execute: async (): Promise<ToolResult<RecipeMetadata[]>> => {
    try {
      const recipes = await getRecipesMetadataAction();
      return { success: true, data: recipes };
    } catch {
      return { success: false, error: "Error fetching recipes metadata" };
    }
  },
});

export const getPlannedMealsMetadataTool = tool({
  description:
    "Get the metadata of all planned meals with status PLANNED belonging to the user.",
  parameters: z.object({}),
  execute: async (): Promise<ToolResult<PlannedMealMetadata[]>> => {
    try {
      const plannedMeals = await getPlannedMealsMetadataAction();
      return { success: true, data: plannedMeals };
    } catch {
      return { success: false, error: "Error fetching planned meals metadata" };
    }
  },
});

export const getPlannedMealsTool = tool({
  description:
    "Get all planned meals with status PLANNED belonging to the user. Useful for fetching all ingredients of upcoming meals.",
  parameters: z.object({}),
  execute: async (): Promise<ToolResult<PlannedMeal[]>> => {
    try {
      const plannedMeals = await getPlannedMealsAction();
      return { success: true, data: plannedMeals };
    } catch {
      return { success: false, error: "Error fetching planned meals" };
    }
  },
});

export const getRecipeByIdTool = tool({
  description: "Get a Recipe object by ID.",
  parameters: z.object({
    id: z.string().describe("The ID of the recipe to get"),
  }),
  execute: async (parameters: { id: string }): Promise<ToolResult<Recipe>> => {
    try {
      const recipe = await getRecipeByIdAction(parameters.id);
      return { success: true, data: recipe };
    } catch {
      return { success: false, error: "Error fetching recipe by ID" };
    }
  },
});

export const getPlannedMealByIdTool = tool({
  description: "Get a PlannedMeal object by ID.",
  parameters: z.object({
    id: z.string().describe("The ID of the planned meal to get"),
  }),
  execute: async (parameters: {
    id: string;
  }): Promise<ToolResult<PlannedMeal | null>> => {
    try {
      const plannedMeal = await getPlannedMealByIdAction(parameters.id);
      return { success: true, data: plannedMeal };
    } catch {
      return { success: false, error: "Error fetching planned meal by ID" };
    }
  },
});

export const createRecipeTool = tool({
  description: "Create a Recipe object.",
  parameters: createRecipeInputSchema,
  execute: async (
    parameters: CreateRecipeInput
  ): Promise<ToolResult<Recipe>> => {
    try {
      const recipe = await createRecipeAction(parameters);
      return { success: true, data: recipe };
    } catch {
      return { success: false, error: "Error creating recipe" };
    }
  },
});

export const createPlannedMealTool = tool({
  description: "Create a PlannedMeal object.",
  parameters: createPlannedMealInputSchema,
  execute: async (
    parameters: CreatePlannedMealInput
  ): Promise<ToolResult<PlannedMeal>> => {
    try {
      const plannedMeal = await createPlannedMealAction(parameters);
      return { success: true, data: plannedMeal };
    } catch {
      return { success: false, error: "Error creating planned meal" };
    }
  },
});

export const updateRecipeTool = tool({
  description: "Update a Recipe object.",
  parameters: updateRecipeInputSchema,
  execute: async (
    parameters: UpdateRecipeInput
  ): Promise<ToolResult<Recipe>> => {
    try {
      const recipe = await updateRecipeAction(parameters);
      return { success: true, data: recipe };
    } catch {
      return { success: false, error: "Error updating recipe" };
    }
  },
});

export const updatePlannedMealTool = tool({
  description: "Update a PlannedMeal object.",
  parameters: updatePlannedMealInputSchema,
  execute: async (
    parameters: UpdatePlannedMealInput
  ): Promise<ToolResult<PlannedMeal>> => {
    try {
      const plannedMeal = await updatePlannedMealAction(parameters);
      return { success: true, data: plannedMeal };
    } catch {
      return { success: false, error: "Error updating planned meal" };
    }
  },  
});

export const deleteRecipeTool = tool({
  description: "Delete a Recipe object.",
  parameters: z.object({
    id: z.string().describe("The id of the recipe to be deleted"),
  }),
  execute: async (parameters: { id: string }): Promise<ToolResult<string>> => {
    try {
      await deleteRecipeAction(parameters.id);
      return { success: true, data: "Recipe deleted successfully" };
    } catch {
      return { success: false, error: "Error deleting recipe" };
    }
  },
});

export const deletePlannedMealTool = tool({
  description: "Delete a PlannedMeal object.",
  parameters: z.object({
    id: z.string().describe("The id of the planned meal to be deleted"),
  }),
  execute: async (parameters: { id: string }): Promise<ToolResult<string>> => {
    try {
      await deletePlannedMealAction(parameters.id);
      return { success: true, data: "Planned meal deleted successfully" };
    } catch {
      return { success: false, error: "Error deleting planned meal" };
    }
  },
});

export const renderRecipePreviewTool = tool({
  description: "Renders a preview of a full recipe.",
  parameters: createRecipeInputSchema,
});

export const enterCookingModeToolParametersSchema = z.object({
  id: z.string().describe("The id of the planned meal to be cooked"),
});
export const enterCookingModeTool = tool({
  description: "Enter cooking mode.",
  parameters: enterCookingModeToolParametersSchema,
});