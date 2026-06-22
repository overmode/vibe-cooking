import {
  type Recipe as RecipeRow,
  type RecipeRevision,
} from "@/generated/prisma/browser";
import { type z } from "zod";

export type RecipeContent = Pick<
  RecipeRevision,
  | "name"
  | "servings"
  | "ingredients"
  | "instructions"
  | "duration"
  | "difficulty"
>;

// Domain recipe: stable identity merged with its current revision's content.
export type Recipe = Pick<RecipeRow, "id" | "createdAt"> & RecipeContent;

export type CardDisplayMetadata = Pick<
  Recipe,
  "id" | "name" | "duration" | "difficulty" | "servings"
>;

export type RecipeMetadata = Pick<
  Recipe,
  "id" | "name" | "createdAt" | "servings" | "duration" | "difficulty"
>;

export interface UserProfile {
  content: string;
}

// Today's usage plus per-dimension verdicts. The single source of truth for
// rate-limit decisions, shared by server gates and the client's proactive UI.
export interface Limits {
  messageCount: number;
  voiceSeconds: number;
  searchCount: number;
  messageLimitReached: boolean;
  voiceLimitReached: boolean;
  searchLimitReached: boolean;
}

// Sidebar list row: thread identity + label + recency, no message payload.
export interface ThreadMetadata {
  id: string;
  title: string | null;
  updatedAt: Date;
}

export const asTypedSchema = <T>() => ({}) as unknown as z.ZodType<T>;

export interface ChatSuggestion {
  label: string;
  message: string;
}
