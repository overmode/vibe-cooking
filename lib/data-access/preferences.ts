import prisma from "@/prisma/client";
import { handleDbError } from "../utils/error";

export async function getUserDietaryPreferences({
  userId,
}: {
  userId: string;
}) {
  try {
    const preferences = await prisma.userDietaryPreferences.findUnique({
      where: { userId },
    });

    return preferences;
  } catch (error) {
    handleDbError(error, "get user dietary preferences");
  }
}

export async function updateUserDietaryPreferences({
  userId,
  preferences,
}: {
  userId: string;
  preferences: string;
}) {
  try {
    const updatedPreferences = await prisma.userDietaryPreferences.upsert({
      where: { userId },
      update: {
        preferences,
      },
      create: {
        userId,
        preferences,
      },
    });
    return updatedPreferences;
  } catch (error) {
    handleDbError(error, "update user dietary preferences");
  }
}
