import { Prisma } from "@prisma/client";
import { z } from "zod";
export type RecipeMetadata = Prisma.RecipeGetPayload<{
  select: {
    id: true;
    name: true;
    createdAt: true;
    servings: true;
    duration: true;
    difficulty: true;
    cookCount: true;
    isFavorite: true;
  };
}>;

export type PlannedMealMetadata = Prisma.PlannedMealGetPayload<{
  select: {
    id: true;
    overrideName: true;
    createdAt: true;
    overrideDifficulty: true;
    overrideDuration: true;
    overrideServings: true;
    status: true;
    cookedAt: true;
    recipe: {
      select: {
        name: true;
        servings: true;
        duration: true;
        difficulty: true;
      };
    };
  };
}>;

export type PlannedMealWithRecipe = Prisma.PlannedMealGetPayload<{
  include: {
    recipe: true;
  };
}>;

// bypasses a zod schema and accept a type instead. Can be used to type safe values
export const asTypedSchema = <T>() => ({} as unknown as z.ZodType<T>);
