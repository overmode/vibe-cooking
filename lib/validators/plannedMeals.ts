import { z } from "zod";
import {
  MAX_INGREDIENTS,
  MAX_NAME_LENGTH,
  MIN_INGREDIENTS,
  MIN_NAME_LENGTH,
  MIN_INSTRUCTIONS_LENGTH,
  MAX_INSTRUCTIONS_LENGTH,
  MIN_SERVINGS,
  MAX_SERVINGS,
  MIN_DURATION_MINUTES,
  MAX_DURATION_MINUTES,
  MIN_DIFFICULTY,
  MAX_DIFFICULTY,
  MIN_INGREDIENT_LENGTH,
  MAX_INGREDIENT_LENGTH,
} from "@/lib/constants/validation";
import { PlannedMealStatus } from "@prisma/client";

export const createPlannedMealInputSchema = z.object({
  recipeId: z.string(),
  name: z
    .string()
    .min(MIN_NAME_LENGTH, {
      message: `Name must be at least ${MIN_NAME_LENGTH} characters`,
    })
    .max(MAX_NAME_LENGTH, {
      message: `Name must be less than ${MAX_NAME_LENGTH} characters`,
    })
    .optional(),
  overrideIngredients: z
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
    })
    .optional(),
  overrideInstructions: z
    .string()
    .min(MIN_INSTRUCTIONS_LENGTH, {
      message: `Instructions must be at least ${MIN_INSTRUCTIONS_LENGTH} characters`,
    })
    .max(MAX_INSTRUCTIONS_LENGTH, {
      message: `Instructions must be less than ${MAX_INSTRUCTIONS_LENGTH} characters`,
    })
    .optional(),
  overrideServings: z
    .number()
    .min(MIN_SERVINGS, { message: `Servings must be at least ${MIN_SERVINGS}` })
    .max(MAX_SERVINGS, {
      message: `Servings must be less than ${MAX_SERVINGS}`,
    })
    .optional(),
  overrideDuration: z
    .number()
    .min(MIN_DURATION_MINUTES, {
      message: `Duration must be at least ${MIN_DURATION_MINUTES} minutes`,
    })
    .max(MAX_DURATION_MINUTES, {
      message: `Duration must be less than ${MAX_DURATION_MINUTES} minutes`,
    })
    .optional(),
  overrideDifficulty: z
    .number()
    .min(MIN_DIFFICULTY, {
      message: `Difficulty must be at least ${MIN_DIFFICULTY}`,
    })
    .max(MAX_DIFFICULTY, {
      message: `Difficulty must be less than ${MAX_DIFFICULTY}`,
    })
    .optional(),
  status: z.nativeEnum(PlannedMealStatus),
  cookedAt: z.date().optional(),
});

export const updatePlannedMealInputSchema =
  createPlannedMealInputSchema.partial();

export type CreatePlannedMealInput = z.infer<
  typeof createPlannedMealInputSchema
>;

export type UpdatePlannedMealInput = z.infer<
  typeof updatePlannedMealInputSchema
>;
