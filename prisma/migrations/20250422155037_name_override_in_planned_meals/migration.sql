/*
  Warnings:

  - You are about to drop the column `name` on the `PlannedMeal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlannedMeal" DROP COLUMN "name",
ADD COLUMN     "overrideName" VARCHAR(100);
