import { getCurrentUserId } from "@/lib/auth/get-current-user-id";
import { handleActionError } from "../utils/error";
import { type Author } from "@/generated/prisma/client";
import { type UserProfile } from "@/lib/types";
import {
  appendUserProfileRevision,
  getLatestUserProfileRevision,
} from "@/lib/data-access/user-profile";

export const getUserProfileAction = async (): Promise<UserProfile | null> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    handleActionError("Unauthorized", "get user profile");
  }
  try {
    const revision = await getLatestUserProfileRevision({ userId });
    return revision ? { content: revision.content } : null;
  } catch (error) {
    handleActionError(error, "get user profile");
  }
};

export const updateUserProfileAction = async (
  content: string,
  authoredBy: Author = "USER"
): Promise<UserProfile> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    handleActionError("Unauthorized", "update user profile");
  }
  try {
    const revision = await appendUserProfileRevision({
      userId,
      content,
      authoredBy,
    });
    return { content: revision.content };
  } catch (error) {
    handleActionError(error, "update user profile");
  }
};
