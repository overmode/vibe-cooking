import prisma from "@/prisma/client";
import {
  CreatePlannedMealInput,
  UpdatePlannedMealInput,
} from "@/lib/validators/plannedMeals";
import { PlannedMealStatus } from "@prisma/client";
import { handleDbError } from "@/lib/utils/error";
export async function createPlannedMeal({
  userId,
  data,
}: {
  userId: string;
  data: CreatePlannedMealInput;
}) {
  try {
    const plannedMeal = await prisma.plannedMeal.create({
      data: {
        ...data,
        userId,
      },
    });
    return plannedMeal;
  } catch (error) {
    handleDbError(error, "create planned meal");
  }
}

export async function getPlannedMealById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  try {
    const plannedMeal = await prisma.plannedMeal.findUnique({
      where: { id, userId },
    });
    return plannedMeal;
  } catch (error) {
    handleDbError(error, "get planned meal by id");
  }
}

export async function listUserPlannedMeals(userId: string) {
  // TODO: Add pagination
  try {
    const plannedMeals = await prisma.plannedMeal.findMany({
      where: { userId },
    });
    return plannedMeals;
  } catch (error) {
    handleDbError(error, "list user planned meals");
  }
}

export async function updatePlannedMeal({
  id,
  userId,
  data,
}: {
  id: string;
  userId: string;
  data: UpdatePlannedMealInput;
}) {
  try {
    const plannedMeal = await prisma.plannedMeal.update({
      where: { id, userId },
      data,
    });
    return plannedMeal;
  } catch (error) {
    handleDbError(error, "update planned meal");
  }
}

export async function deletePlannedMeal({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  try {
    await prisma.plannedMeal.delete({
      where: { id, userId },
    });
    return true;
  } catch (error) {
    handleDbError(error, "delete planned meal");
  }
}

export async function setPlannedMealCooked({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  try {
    const plannedMeal = await updatePlannedMeal({
      id,
      userId,
      data: { cookedAt: new Date(), status: PlannedMealStatus.COOKED },
    });
    return plannedMeal;
  } catch (error) {
    handleDbError(error, "set planned meal cooked");
  }
}

export async function setPlannedMealUnCooked({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  try {
    const plannedMeal = await updatePlannedMeal({
      id,
      userId,
      data: { cookedAt: undefined, status: PlannedMealStatus.PLANNED },
    });
    return plannedMeal;
  } catch (error) {
    handleDbError(error, "set planned meal uncooked");
  }
}
