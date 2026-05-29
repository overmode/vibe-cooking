import {
  RecipeTemplate,
  RecipeInstance,
  RecipeInstanceStatus,
} from '@/generated/prisma/browser'
import { z } from 'zod'

export type CardDisplayMetadata = Pick<
  RecipeTemplate,
  'id' | 'name' | 'duration' | 'difficulty' | 'servings'
>

export type RecipeMetadata = Pick<
  RecipeTemplate,
  | 'id'
  | 'name'
  | 'createdAt'
  | 'servings'
  | 'duration'
  | 'difficulty'
  | 'isFavorite'
> & {
  cookCount: number
  plannedMeals: { id: string; status: RecipeInstanceStatus }[]
}

export type PlannedMealMetadata = Pick<
  RecipeInstance,
  | 'id'
  | 'name'
  | 'createdAt'
  | 'difficulty'
  | 'duration'
  | 'servings'
  | 'status'
  | 'cookedAt'
>

export type PlannedMealWithRecipe = RecipeInstance

// bypasses a zod schema and accept a type instead. Can be used to type safe values
export const asTypedSchema = <T>() => ({} as unknown as z.ZodType<T>)

export type ChatSuggestion = {
  label: string
  message: string
}
