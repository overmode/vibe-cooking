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
  recipeId: z
    .string()
    .nonempty({ message: "Recipe ID is required" })
    .describe("The ID of the recipe to plan. Required."),
  overrideName: z
    .string()
    .describe(
      "The name of the planned meal. Leave empty if no change compared to the original recipe, otherwise adjust it to reflect the changes, e.g. 'Chicken Parmesan' -> 'Chicken Parmesan (with extra cheese)"
    )
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
    .describe(
      "The ingredients of the planned meal. Leave empty if no change compared to the original recipe, otherwise adjust it to reflect the changes."
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
    .describe(
      "The instructions of the planned meal. Leave empty if no change compared to the original recipe, otherwise adjust it to reflect the changes."
    )
    .min(MIN_INSTRUCTIONS_LENGTH, {
      message: `Instructions must be at least ${MIN_INSTRUCTIONS_LENGTH} characters`,
    })
    .max(MAX_INSTRUCTIONS_LENGTH, {
      message: `Instructions must be less than ${MAX_INSTRUCTIONS_LENGTH} characters`,
    })
    .optional(),
  overrideServings: z
    .number()
    .describe(
      "The number of servings of the planned meal. Leave empty if no change compared to the original recipe, otherwise adjust it to reflect the changes."
    )
    .min(MIN_SERVINGS, { message: `Servings must be at least ${MIN_SERVINGS}` })
    .max(MAX_SERVINGS, {
      message: `Servings must be less than ${MAX_SERVINGS}`,
    })
    .optional(),
  overrideDuration: z
    .number()
    .describe(
      "The duration of the planned meal in minutes. Leave empty if no change compared to the original recipe, otherwise adjust it to reflect the changes."
    )
    .min(MIN_DURATION_MINUTES, {
      message: `Duration must be at least ${MIN_DURATION_MINUTES} minutes`,
    })
    .max(MAX_DURATION_MINUTES, {
      message: `Duration must be less than ${MAX_DURATION_MINUTES} minutes`,
    })
    .optional(),
  overrideDifficulty: z
    .number()
    .describe(
      "The difficulty of the planned meal. Leave empty if no change compared to the original recipe, otherwise adjust it to reflect the changes."
    )
    .min(MIN_DIFFICULTY, {
      message: `Difficulty must be at least ${MIN_DIFFICULTY}`,
    })
    .max(MAX_DIFFICULTY, {
      message: `Difficulty must be less than ${MAX_DIFFICULTY}`,
    })
    .optional(),
  status: z
    .nativeEnum(PlannedMealStatus)
    .describe(
      "The status of the planned meal. PLANNED if the meal is not cooked yet, COOKED if the meal has been cooked."
    ),
  cookedAt: z
    .date()
    .describe(
      "The date and time the meal was cooked. Leave empty if the meal is not cooked yet."
    )
    .optional(),
});

export const updatePlannedMealInputSchema = createPlannedMealInputSchema
  .partial()
  .extend({
    id: z.string().describe("The ID of the planned meal to update"),
  });

export type CreatePlannedMealInput = z.infer<
  typeof createPlannedMealInputSchema
>;

export type UpdatePlannedMealInput = z.infer<
  typeof updatePlannedMealInputSchema
>;
