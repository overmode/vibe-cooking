import { z } from 'zod'
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
} from '@/lib/constants/models_validation'
import { RecipeInstanceStatus } from '@/generated/prisma/browser'

export const createPlannedMealInputSchema = z
  .object({
    templateId: z
      .string()
      .nonempty({ message: 'Recipe template ID is required' })
      .describe('The ID of the recipe to plan. Required.'),
    name: z
      .string()
      .describe(
        "The name of the planned meal. Defaults to the recipe's name; set it to reflect changes, e.g. 'Chicken Parmesan' -> 'Chicken Parmesan (with extra cheese)'."
      )
      .min(MIN_NAME_LENGTH, {
        message: `Name must be at least ${MIN_NAME_LENGTH} characters`,
      })
      .max(MAX_NAME_LENGTH, {
        message: `Name must be less than ${MAX_NAME_LENGTH} characters`,
      })
      .optional(),
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
      .describe(
        "The ingredients of the planned meal. Defaults to the recipe's ingredients; set it to reflect changes."
      )
      .min(MIN_INGREDIENTS, {
        message: `Ingredients must be at least ${MIN_INGREDIENTS}`,
      })
      .max(MAX_INGREDIENTS, {
        message: `Ingredients must be less than ${MAX_INGREDIENTS}`,
      })
      .optional(),
    instructions: z
      .string()
      .describe(
        "The instructions of the planned meal. Defaults to the recipe's instructions; set it to reflect changes."
      )
      .min(MIN_INSTRUCTIONS_LENGTH, {
        message: `Instructions must be at least ${MIN_INSTRUCTIONS_LENGTH} characters`,
      })
      .max(MAX_INSTRUCTIONS_LENGTH, {
        message: `Instructions must be less than ${MAX_INSTRUCTIONS_LENGTH} characters`,
      })
      .optional(),
    servings: z
      .number()
      .describe(
        "The number of servings of the planned meal. Defaults to the recipe's servings; set it to reflect changes."
      )
      .min(MIN_SERVINGS, {
        message: `Servings must be at least ${MIN_SERVINGS}`,
      })
      .max(MAX_SERVINGS, {
        message: `Servings must be less than ${MAX_SERVINGS}`,
      })
      .optional(),
    duration: z
      .number()
      .describe(
        "The duration of the planned meal in minutes. Defaults to the recipe's duration; set it to reflect changes."
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
        "The difficulty of the planned meal. Defaults to the recipe's difficulty; set it to reflect changes."
      )
      .min(MIN_DIFFICULTY, {
        message: `Difficulty must be at least ${MIN_DIFFICULTY}`,
      })
      .max(MAX_DIFFICULTY, {
        message: `Difficulty must be less than ${MAX_DIFFICULTY}`,
      })
      .optional(),
    status: z
      .nativeEnum(RecipeInstanceStatus)
      .describe(
        'The status of the planned meal. Defaults to PLANNED if not provided.'
      )
      .optional(),
    cookedAt: z
      .date()
      .describe(
        'The date and time the meal was cooked. Leave empty if the meal is not cooked yet.'
      )
      .optional(),
  })
  .strict()

export const updatePlannedMealInputSchema = createPlannedMealInputSchema
  .omit({ templateId: true })
  .partial()
  .extend({
    id: z.string().describe('The ID of the planned meal to update'),
  })
  .strict()

export type CreatePlannedMealInput = z.infer<
  typeof createPlannedMealInputSchema
>

export type UpdatePlannedMealInput = z.infer<
  typeof updatePlannedMealInputSchema
>
