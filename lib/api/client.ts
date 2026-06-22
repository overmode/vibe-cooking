import { type UIMessage } from "ai";
import { apiRoutes } from "@/lib/api/api-routes";
import { del, get, post } from "@/lib/api/fetchers";
import {
  type Limits,
  type Recipe,
  type RecipeMetadata,
  type ThreadMetadata,
  type UserProfile,
} from "@/lib/types";

export const getRecipesMetadata = async () => {
  return get<RecipeMetadata[]>(apiRoutes.recipe.all);
};

export const getRecipeById = async (id: string) => {
  return get<Recipe>(apiRoutes.recipe.byId(id));
};

export const deleteRecipeById = async (
  id: string
): Promise<{ success: boolean }> => {
  return del<{ success: boolean }>(apiRoutes.recipe.byId(id));
};

export const getThreads = async () => {
  return get<ThreadMetadata[]>(apiRoutes.chatThread.all);
};

export const getThreadMessages = async (threadId: string) => {
  return get<UIMessage[]>(apiRoutes.chatThread.byId(threadId));
};

export const getUserProfile = async () => {
  return get<UserProfile | null>(apiRoutes.userProfile.all);
};

export const getLimits = async () => {
  return get<Limits>(apiRoutes.rateLimit);
};

export const updateUserProfile = async (content: string) => {
  return post<UserProfile>(apiRoutes.userProfile.all, {
    content,
  });
};

// Posts the raw recording; the server sniffs the container and resolves the
// language from the user's locale. Surfaces the daily-cap rejection with the
// same "Rate Limit Exceeded" message the chat path uses.
export const transcribeAudio = async (
  audio: Blob,
  durationMs: number
): Promise<string> => {
  const res = await fetch(apiRoutes.transcribe, {
    method: "POST",
    body: audio,
    headers: { "x-voice-duration-ms": String(Math.round(durationMs)) },
  });
  if (!res.ok) {
    throw new Error(
      res.status === 429 ? "Rate Limit Exceeded" : "Transcription failed"
    );
  }
  const { text } = (await res.json()) as { text: string };
  return text;
};
