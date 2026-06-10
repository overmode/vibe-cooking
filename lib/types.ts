import { type Recipe as RecipeRow, type RecipeRevision } from '@/generated/prisma/browser'
import { type z } from 'zod'

export type RecipeContent = Pick<
  RecipeRevision,
  'name' | 'servings' | 'ingredients' | 'instructions' | 'duration' | 'difficulty'
>

// Domain recipe: stable identity merged with its current revision's content.
export type Recipe = Pick<RecipeRow, 'id' | 'createdAt'> & RecipeContent

export type CardDisplayMetadata = Pick<
  Recipe,
  'id' | 'name' | 'duration' | 'difficulty' | 'servings'
>

export type RecipeMetadata = Pick<
  Recipe,
  'id' | 'name' | 'createdAt' | 'servings' | 'duration' | 'difficulty'
>


export type UserProfile = {
  content: string
}

export const asTypedSchema = <T>() => ({} as unknown as z.ZodType<T>)

export type ChatSuggestion = {
  label: string
  message: string
}
