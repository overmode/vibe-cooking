import { Prisma } from "@prisma/client";

export type ToolResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type ToolResultSuccess<T> = Extract<ToolResult<T>, { success: true }>;
export type ToolResultError = Extract<ToolResult<unknown>, { success: false }>;

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
