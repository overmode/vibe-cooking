import { z } from "zod";
import {
  createRecipeInputSchema,
  updateRecipeInputSchema,
} from "@/lib/validators/recipe";
import {
  createPlannedMealInputSchema,
  updatePlannedMealInputSchema,
} from "@/lib/validators/plannedMeals";
import { defineTool } from "@/lib/ai/tools/types";
import { RecipeMetadata, PlannedMealMetadata, asTypedSchema } from "@/lib/types";
import { Recipe, PlannedMeal } from "@prisma/client";

export const getRecipesMetadataDefinition = defineTool({
  description: "Get the metadata of all recipes belonging to the user.",
  parameters: z.object({}),
  result: asTypedSchema<RecipeMetadata[]>(),
});

export const getPlannedMealsMetadataDefinition = defineTool({
  description: "Get the metadata of all planned meals with status PLANNED belonging to the user.",
  parameters: z.object({}),
  result: asTypedSchema<PlannedMealMetadata[]>(),
});

export const getPlannedMealsDefinition = defineTool({
  description: "Get all planned meals with status PLANNED belonging to the user. Useful for fetching all ingredients of upcoming meals.",
  parameters: z.object({}),
  result: asTypedSchema<PlannedMeal[]>(),
});

export const getRecipeByIdDefinition = defineTool({
  description: "Get a Recipe object by ID.",
  parameters: z.object({
    id: z.string().describe("The ID of the recipe to get"),
  }),
  result: asTypedSchema<Recipe>(),
});

export const getPlannedMealByIdDefinition = defineTool({
  description: "Get a PlannedMeal object by ID.",
  parameters: z.object({
    id: z.string().describe("The ID of the planned meal to get"),
  }),
  result: asTypedSchema<PlannedMeal>(),
});

export const createRecipeDefinition = defineTool({
  description: "Create a Recipe object.",
  parameters: createRecipeInputSchema,
  result: asTypedSchema<Recipe>(),
});

export const createPlannedMealDefinition = defineTool({
  description: "Create a PlannedMeal object.",
  parameters: createPlannedMealInputSchema,
  result: asTypedSchema<PlannedMeal>(),
});

export const updateRecipeDefinition = defineTool({
  description: "Update a Recipe object.",
  parameters: updateRecipeInputSchema,
  result: asTypedSchema<Recipe>(),
});

export const updatePlannedMealDefinition = defineTool({
  description: "Update a PlannedMeal object.",
  parameters: updatePlannedMealInputSchema,
  result: asTypedSchema<PlannedMeal>(),
});

export const deleteRecipeDefinition = defineTool({
  description: "Delete a Recipe object.",
  parameters: z.object({
    id: z.string().describe("The id of the recipe to be deleted"),
  }),
  result: asTypedSchema<string>(),
});

export const deletePlannedMealDefinition = defineTool({
  description: "Delete a PlannedMeal object.",
  parameters: z.object({
    id: z.string().describe("The id of the planned meal to be deleted"),
  }),
  result: asTypedSchema<string>(),
});

export const renderRecipePreviewDefinition = defineTool({
  description: "Renders a preview of a full recipe.",
  parameters: createRecipeInputSchema,
  result: asTypedSchema<string>(),
});

export const enterCookingModeDefinition = defineTool({
  description: "Enter cooking mode.",
  parameters: z.object({
    id: z.string().describe("The id of the planned meal to be cooked"),
  }),
  result: asTypedSchema<string>(),
});