import { Recipe } from '@/generated/prisma/browser'
import { z } from 'zod'

export type CardDisplayMetadata = Pick<
  Recipe,
  'id' | 'name' | 'duration' | 'difficulty' | 'servings'
>

export type RecipeMetadata = Pick<
  Recipe,
  | 'id'
  | 'name'
  | 'createdAt'
  | 'servings'
  | 'duration'
  | 'difficulty'
  | 'isFavorite'
>


export type UserProfile = {
  content: string
}

export const asTypedSchema = <T>() => ({} as unknown as z.ZodType<T>)

export type ChatSuggestion = {
  label: string
  message: string
}
