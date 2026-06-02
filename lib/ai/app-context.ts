import { z } from "zod";
import { Recipe } from "@/generated/prisma/client";

export const appContextSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("mainAssistant") }),
  z.object({ kind: z.literal("recipeView"), recipeId: z.string().min(1) }),
]);

export type AppContext = z.infer<typeof appContextSchema>;

export type ResolvedAppContext =
  | { kind: "mainAssistant" }
  | { kind: "recipeView"; recipe: Recipe };
