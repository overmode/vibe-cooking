import { getCurrentUserId } from "@/lib/auth/get-current-user-id";
import { handleActionError } from "../utils/error";
import { UserDietaryPreferences } from "@/generated/prisma/client";
import {
  getUserDietaryPreferences,
  updateUserDietaryPreferences,
} from "@/lib/data-access/preferences";

export const getUserDietaryPreferencesAction =
  async (): Promise<UserDietaryPreferences | null> => {
    const userId = await getCurrentUserId();
    if (!userId) {
      handleActionError("Unauthorized", "get user dietary preferences");
    }
    try {
      const preferences = await getUserDietaryPreferences({ userId });
      return preferences;
    } catch (error) {
      handleActionError(error, "get user dietary preferences");
    }
  };

export const updateUserDietaryPreferencesAction = async (
  preferences: string
) => {
  const userId = await getCurrentUserId();
  if (!userId) {
    handleActionError("Unauthorized", "update user dietary preferences");
  }
  try {
    const updatedPreferences = await updateUserDietaryPreferences({
      userId,
      preferences,
    });
    return updatedPreferences;
  } catch (error) {
    handleActionError(error, "update user dietary preferences");
  }
};
