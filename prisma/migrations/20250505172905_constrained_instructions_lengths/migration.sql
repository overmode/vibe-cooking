/*
  Warnings:

  - You are about to alter the column `overrideInstructions` on the `PlannedMeal` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10000)`.
  - You are about to alter the column `instructions` on the `Recipe` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10000)`.

*/
-- AlterTable
ALTER TABLE "PlannedMeal" ALTER COLUMN "overrideInstructions" SET DATA TYPE VARCHAR(10000);

-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "instructions" SET DATA TYPE VARCHAR(10000);
