-- CreateEnum
CREATE TYPE "PlannedMealStatus" AS ENUM ('PLANNED', 'COOKED');

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "servings" INTEGER NOT NULL,
    "ingredients" TEXT[],
    "instructions" TEXT NOT NULL,
    "duration" INTEGER,
    "difficulty" INTEGER,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cookCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannedMeal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "name" VARCHAR(100),
    "overrideIngredients" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "overrideInstructions" TEXT,
    "overrideServings" INTEGER,
    "overrideDuration" INTEGER,
    "overrideDifficulty" INTEGER,
    "status" "PlannedMealStatus" NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cookedAt" TIMESTAMP(3),

    CONSTRAINT "PlannedMeal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlannedMeal" ADD CONSTRAINT "PlannedMeal_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
