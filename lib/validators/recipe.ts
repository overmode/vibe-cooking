// lib/validators/recipe.ts
import { z } from "zod";
import {
  MAX_NAME_LENGTH,
  MIN_NAME_LENGTH,
  MAX_SERVINGS,
  MIN_SERVINGS,
  MIN_INGREDIENTS,
  MIN_DURATION_MINUTES,
  MAX_DURATION_MINUTES,
  MIN_DIFFICULTY,
  MAX_DIFFICULTY,
  MIN_INGREDIENT_LENGTH,
  MAX_INGREDIENT_LENGTH,
  MIN_INSTRUCTIONS_LENGTH,
  MAX_INSTRUCTIONS_LENGTH,
  MIN_COOK_COUNT,
  MAX_INGREDIENTS,
} from "@/lib/constants/validation";

export const createRecipeInputSchema = z.object({
  name: z
    .string()
    .describe("The name of the recipe")
    .min(MIN_NAME_LENGTH, {
      message: `Name must be at least ${MIN_NAME_LENGTH} characters`,
    })
    .max(MAX_NAME_LENGTH, {
      message: `Name must be less than ${MAX_NAME_LENGTH} characters`,
    }),
  servings: z
    .number()
    .describe("The number of servings the recipe makes")
    .min(MIN_SERVINGS, { message: `Servings must be at least ${MIN_SERVINGS}` })
    .max(MAX_SERVINGS, {
      message: `Servings must be less than ${MAX_SERVINGS}`,
    }),
  ingredients: z
    .array(
      z
        .string()
        .describe(
          `The ingredients of the recipe (with amounts and units, e.g. "2 cups of rice", "1 cup of water", "1 tablespoon of salt")`
        )
        .min(MIN_INGREDIENT_LENGTH, {
          message: `Ingredients must be at least ${MIN_INGREDIENT_LENGTH} characters`,
        })
        .max(MAX_INGREDIENT_LENGTH, {
          message: `Ingredients must be less than ${MAX_INGREDIENT_LENGTH} characters`,
        })
    )
    .min(MIN_INGREDIENTS, {
      message: `Ingredients must be at least ${MIN_INGREDIENTS}`,
    })
    .max(MAX_INGREDIENTS, {
      message: `Ingredients must be less than ${MAX_INGREDIENTS}`,
    }),
  instructions: z
    .string()
    .describe(
      `The instructions of the recipe (with steps, e.g. "1. Boil the rice", "2. Add the salt and water", "3. Cook the rice") beautifully formatted in markdown.`
    )
    .min(MIN_INSTRUCTIONS_LENGTH, {
      message: `Instructions must be at least ${MIN_INSTRUCTIONS_LENGTH} characters`,
    })
    .max(MAX_INSTRUCTIONS_LENGTH, {
      message: `Instructions must be less than ${MAX_INSTRUCTIONS_LENGTH} characters`,
    }),
  duration: z
    .number()
    .describe(
      `The duration of the recipe in minutes. The recipe should take this long to make.`
    )
    .min(MIN_DURATION_MINUTES, {
      message: `Duration must be at least ${MIN_DURATION_MINUTES} minutes`,
    })
    .max(MAX_DURATION_MINUTES, {
      message: `Duration must be less than ${MAX_DURATION_MINUTES} minutes`,
    })
    .optional(),
  difficulty: z
    .number()
    .describe(
      `The difficulty of the recipe. 1 is the easiest, 10 is the hardest. Levels go as follow: 1: Heat pre‑cooked food, no prep. 2: Combine uncooked items, minimal tools. 3: One‑pan cooking with basic knife work. 4: Two‑component dishes, juggle doneness. 5: Main plus side timed and plated. 6: Simple baking, precise ratios matter. 7: Multi‑technique dishes, critical timing. 8: Advanced pastries or tricky proteins, narrow error margin. 9: Restaurant‑style plates with synchronized components. 10: Professional showpieces needing multi‑day prep and specialized skills.`
    )
    .min(MIN_DIFFICULTY, {
      message: `Difficulty must be at least ${MIN_DIFFICULTY}`,
    })
    .max(MAX_DIFFICULTY, {
      message: `Difficulty must be less than ${MAX_DIFFICULTY}`,
    })
    .optional(),
  isFavorite: z
    .boolean()
    .describe("Whether the recipe is a favorite")
    .optional(),
  cookCount: z
    .number()
    .describe("The number of times the recipe has been cooked")
    .min(0, { message: `Cook count must be at least ${MIN_COOK_COUNT}` })
    .optional(),
}).strict();

export const updateRecipeInputSchema = createRecipeInputSchema
  .partial()
  .extend({
    id: z.string().describe("The ID of the recipe to update"),
  }).strict();

export type CreateRecipeInput = z.infer<typeof createRecipeInputSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeInputSchema>;
