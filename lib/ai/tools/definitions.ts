import { z } from "zod";
import {
  createRecipeInputSchema,
  updateRecipeInputSchema,
} from "@/lib/validators/recipe";
import { defineTool } from "@/lib/ai/tools/types";
import { Recipe, RecipeMetadata, UserProfile, asTypedSchema } from "@/lib/types";
import { MAX_USER_PROFILE_LENGTH } from "@/lib/constants/app_validation";

export const getRecipesMetadataDefinition = defineTool({
  description: "Get the metadata of all recipes belonging to the user.",
  inputSchema: z.object({}),
  result: asTypedSchema<RecipeMetadata[]>(),
});

export const getRecipeByIdDefinition = defineTool({
  description: "Get a Recipe object by ID.",
  inputSchema: z.object({
    id: z.string().describe("The ID of the recipe to get"),
  }),
  result: asTypedSchema<Recipe>(),
});

export const createRecipeDefinition = defineTool({
  description:
    "Persist a recipe to the user's library. Precondition: the recipe must have been shown via renderRecipeSuggestionTool and the user must have explicitly agreed to save it. Never call this directly from a user request — render a suggestion first, ask, then save. To change an existing recipe, use updateRecipeTool instead.",
  inputSchema: createRecipeInputSchema,
  result: asTypedSchema<Recipe>(),
});

export const updateRecipeDefinition = defineTool({
  description: "Update a Recipe object.",
  inputSchema: updateRecipeInputSchema,
  result: asTypedSchema<Recipe>(),
});

export const deleteRecipeDefinition = defineTool({
  description: "Delete a Recipe object.",
  inputSchema: z.object({
    id: z.string().describe("The id of the recipe to be deleted"),
  }),
  result: asTypedSchema<string>(),
});

export const updateUserProfileDefinition = defineTool({
  description:
    "Save the user profile. Merge with existing. Only include information explicitly stated by the user — no inference or extrapolation. Ask before saving in normal chat; save incrementally during profile setup.",
  inputSchema: z.object({
    profile: z
      .string()
      .max(MAX_USER_PROFILE_LENGTH)
      .describe("The full user profile text, written in first person as if the user were writing naturally (e.g. \"I live in Paris and I'm vegetarian...\")"),
  }),
  result: asTypedSchema<UserProfile>(),
});

export const renderRecipeSuggestionDefinition = defineTool({
  description:
    "ALWAYS use this tool to present a new recipe to the user. NEVER write a full recipe (ingredients + instructions) as plain text in chat. The suggestion card renders the recipe in a structured, readable layout with proper sections — far better UX than a wall of markdown. It is rendering only: it does NOT save anything. After rendering, ask whether to save; only call createRecipeTool if they agree (createRecipeTool requires a prior suggestion). You can render several suggestions in sequence to offer options.",
  inputSchema: createRecipeInputSchema,
  result: asTypedSchema<string>(),
});
