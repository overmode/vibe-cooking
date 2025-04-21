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
    .min(MIN_NAME_LENGTH, {
      message: `Name must be at least ${MIN_NAME_LENGTH} characters`,
    })
    .max(MAX_NAME_LENGTH, {
      message: `Name must be less than ${MAX_NAME_LENGTH} characters`,
    }),
  servings: z
    .number()
    .min(MIN_SERVINGS, { message: `Servings must be at least ${MIN_SERVINGS}` })
    .max(MAX_SERVINGS, {
      message: `Servings must be less than ${MAX_SERVINGS}`,
    }),
  ingredients: z
    .array(
      z
        .string()
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
    .min(MIN_INSTRUCTIONS_LENGTH, {
      message: `Instructions must be at least ${MIN_INSTRUCTIONS_LENGTH} characters`,
    })
    .max(MAX_INSTRUCTIONS_LENGTH, {
      message: `Instructions must be less than ${MAX_INSTRUCTIONS_LENGTH} characters`,
    }),
  duration: z
    .number()
    .min(MIN_DURATION_MINUTES, {
      message: `Duration must be at least ${MIN_DURATION_MINUTES} minutes`,
    })
    .max(MAX_DURATION_MINUTES, {
      message: `Duration must be less than ${MAX_DURATION_MINUTES} minutes`,
    })
    .optional(),
  difficulty: z
    .number()
    .min(MIN_DIFFICULTY, {
      message: `Difficulty must be at least ${MIN_DIFFICULTY}`,
    })
    .max(MAX_DIFFICULTY, {
      message: `Difficulty must be less than ${MAX_DIFFICULTY}`,
    })
    .optional(),
  isFavorite: z.boolean().optional(),
  cookCount: z
    .number()
    .min(0, { message: `Cook count must be at least ${MIN_COOK_COUNT}` })
    .optional(),
});

export const updateRecipeInputSchema = createRecipeInputSchema.partial();

export type CreateRecipeInput = z.infer<typeof createRecipeInputSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeInputSchema>;
