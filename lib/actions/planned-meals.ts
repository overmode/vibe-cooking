"use server";

import { auth } from "@clerk/nextjs/server";
import { handleActionError } from "@/lib/utils/error";
import {
  createPlannedMeal,
  deletePlannedMeal,
  getPlannedMealById,
  getPlannedMeals,
  getPlannedMealsMetadata,
  updatePlannedMeal,
} from "@/lib/data-access/planned-meal";
import {
  CreatePlannedMealInput,
  UpdatePlannedMealInput,
} from "@/lib/validators/plannedMeals";
import { PlannedMealMetadata, PlannedMealWithRecipe } from "@/lib/types";

export const getPlannedMealsMetadataAction = async (): Promise<
  PlannedMealMetadata[]
> => {
  const { userId } = await auth();
  if (!userId) {
    handleActionError("Unauthorized", "getPlannedMealsMetadataAction");
  }
  const plannedMeals = await getPlannedMealsMetadata({ userId });
  return plannedMeals;
};

export const getPlannedMealsAction = async () => {
  const { userId } = await auth();
  if (!userId) {
    handleActionError("Unauthorized", "getPlannedMealsAction");
  }
  const plannedMeals = await getPlannedMeals({ userId });
  return plannedMeals;
};

export const createPlannedMealAction = async (
  plannedMealData: CreatePlannedMealInput
) => {
  const { userId } = await auth();
  if (!userId) {
    handleActionError("Unauthorized", "createPlannedMealAction");
  }
  const plannedMeal = await createPlannedMeal({
    userId,
    data: plannedMealData,
  });
  return plannedMeal;
};

export const deletePlannedMealAction = async (plannedMealId: string) => {
  const { userId } = await auth();
  if (!userId) {
    handleActionError("Unauthorized", "deletePlannedMealAction");
  }
  const plannedMeal = await deletePlannedMeal({ id: plannedMealId, userId });
  return plannedMeal;
};

export const updatePlannedMealAction = async (
  plannedMealData: UpdatePlannedMealInput
) => {
  const { userId } = await auth();
  if (!userId) {
    handleActionError("Unauthorized", "updatePlannedMealAction");
  }
  const plannedMeal = await updatePlannedMeal({
    userId,
    data: plannedMealData,
  });
  return plannedMeal;
};

export const getPlannedMealByIdAction = async (id: string): Promise<PlannedMealWithRecipe> => {
  const { userId } = await auth();
  if (!userId) {
    handleActionError("Unauthorized", "getPlannedMealByIdAction");
  }
  const plannedMeal = await getPlannedMealById({ id, userId });
  return plannedMeal;
};
