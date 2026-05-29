/*
  Warnings:

  - You are about to drop the `PlannedMeal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RecipeInstanceStatus" AS ENUM ('PLANNED', 'COOKING', 'COOKED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "PlannedMeal" DROP CONSTRAINT "PlannedMeal_recipeId_fkey";

-- DropTable
DROP TABLE "PlannedMeal";

-- DropTable
DROP TABLE "Recipe";

-- DropEnum
DROP TYPE "PlannedMealStatus";

-- CreateTable
CREATE TABLE "RecipeTemplate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "servings" INTEGER NOT NULL,
    "ingredients" TEXT[],
    "instructions" VARCHAR(10000) NOT NULL,
    "duration" INTEGER,
    "difficulty" INTEGER,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeInstance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "servings" INTEGER NOT NULL,
    "ingredients" TEXT[],
    "instructions" VARCHAR(10000) NOT NULL,
    "duration" INTEGER,
    "difficulty" INTEGER,
    "status" "RecipeInstanceStatus" NOT NULL DEFAULT 'PLANNED',
    "plannedFor" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "cookedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeInstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecipeTemplate_userId_idx" ON "RecipeTemplate"("userId");

-- CreateIndex
CREATE INDEX "RecipeTemplate_userId_archivedAt_idx" ON "RecipeTemplate"("userId", "archivedAt");

-- CreateIndex
CREATE INDEX "RecipeInstance_userId_status_idx" ON "RecipeInstance"("userId", "status");

-- CreateIndex
CREATE INDEX "RecipeInstance_userId_plannedFor_idx" ON "RecipeInstance"("userId", "plannedFor");

-- CreateIndex
CREATE INDEX "RecipeInstance_userId_cookedAt_idx" ON "RecipeInstance"("userId", "cookedAt");

-- CreateIndex
CREATE INDEX "RecipeInstance_templateId_idx" ON "RecipeInstance"("templateId");

-- AddForeignKey
ALTER TABLE "RecipeInstance" ADD CONSTRAINT "RecipeInstance_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "RecipeTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
