/*
  Warnings:

  - You are about to drop the columns `name`, `servings`, `ingredients`, `instructions`,
    `duration`, `difficulty` on the `Recipe` table. Their values are preserved as the
    first revision in the new `RecipeRevision` table.
*/
-- CreateTable
CREATE TABLE "RecipeRevision" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "revision" INTEGER NOT NULL,
    "authoredBy" "Author" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(100) NOT NULL,
    "servings" INTEGER NOT NULL,
    "ingredients" TEXT[],
    "instructions" VARCHAR(10000) NOT NULL,
    "duration" INTEGER,
    "difficulty" INTEGER,

    CONSTRAINT "RecipeRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeRevision_recipeId_revision_key" ON "RecipeRevision"("recipeId", "revision");

-- AddForeignKey
ALTER TABLE "RecipeRevision" ADD CONSTRAINT "RecipeRevision_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill existing recipe content as revision 1, authored by the user.
INSERT INTO "RecipeRevision" ("id", "recipeId", "revision", "authoredBy", "createdAt", "name", "servings", "ingredients", "instructions", "duration", "difficulty")
SELECT gen_random_uuid()::text, "id", 1, 'USER', "createdAt", "name", "servings", "ingredients", "instructions", "duration", "difficulty"
FROM "Recipe";

-- DropColumn (content now lives on RecipeRevision)
ALTER TABLE "Recipe" DROP COLUMN "name",
                     DROP COLUMN "servings",
                     DROP COLUMN "ingredients",
                     DROP COLUMN "instructions",
                     DROP COLUMN "duration",
                     DROP COLUMN "difficulty";
