import { Prisma } from "@prisma/client";

export type ToolResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type RecipeMetadata = Prisma.RecipeGetPayload<{
  select: {
    id: true;
    name: true;
    createdAt: true;
    servings: true;
    duration: true;
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
  };
}>;
