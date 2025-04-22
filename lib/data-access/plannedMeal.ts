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

export async function getPlannedMealsMetadata({ userId }: { userId: string }) {
  try {
    // TODO: Add pagination
    const plannedMeals = await prisma.plannedMeal.findMany({
      where: { userId },
      select: {
        id: true,
        overrideName: true,
        createdAt: true,
        overrideDifficulty: true,
        overrideDuration: true,
        overrideServings: true,
        status: true,
        cookedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return plannedMeals;
  } catch (error) {
    handleDbError(error, "get planned meals metadata");
  }
}

export async function updatePlannedMeal({
  userId,
  data,
}: {
  userId: string;
  data: UpdatePlannedMealInput;
}) {
  try {
    const { id, ...updateData } = data;
    const plannedMeal = await prisma.plannedMeal.update({
      where: { id, userId },
      data: updateData,
    });
    return plannedMeal;
  } catch (error) {
    handleDbError(error, "update planned meal");
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
      userId,
      data: { id, cookedAt: new Date(), status: PlannedMealStatus.COOKED },
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
      userId,
      data: { id, cookedAt: undefined, status: PlannedMealStatus.PLANNED },
    });
    return plannedMeal;
  } catch (error) {
    handleDbError(error, "set planned meal uncooked");
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
