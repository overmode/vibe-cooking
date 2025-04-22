import {
  CreateRecipeInput,
  createRecipeInputSchema,
} from "@/lib/validators/recipe";
import { auth } from "@clerk/nextjs/server";
import { createRecipeAction, deleteRecipeAction } from "@/lib/actions/recipe";
import { z } from "zod";

export const createRecipeTool = {
  description: "Create a Recipe object.",
  parameters: createRecipeInputSchema,
  execute: async (parameters: CreateRecipeInput) => {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const recipe = await createRecipeAction(parameters);
    return recipe;
  },
};

export const deleteRecipeTool = {
  description: "Delete a Recipe object.",
  parameters: z.object({
    id: z.string().describe("The id of the recipe to be deleted"),
  }),
  execute: async (parameters: { id: string }) => {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }
    await deleteRecipeAction(parameters.id);
    return "Recipe deleted successfully";
  },
};
