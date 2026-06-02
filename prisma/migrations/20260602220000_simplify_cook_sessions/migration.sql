-- Remove planning/cancelled rows; only in-progress and completed cooks remain.
DELETE FROM "RecipeInstance" WHERE "status" IN ('PLANNED', 'CANCELLED');

UPDATE "RecipeInstance" SET "cookedAt" = NULL WHERE "status" = 'COOKING';
UPDATE "RecipeInstance"
SET "cookedAt" = COALESCE("cookedAt", "updatedAt")
WHERE "status" = 'COOKED';

DROP INDEX "RecipeInstance_userId_status_createdAt_idx";
DROP INDEX "RecipeInstance_templateId_status_idx";

ALTER TABLE "RecipeInstance" DROP COLUMN "plannedFor";
ALTER TABLE "RecipeInstance" DROP COLUMN "startedAt";
ALTER TABLE "RecipeInstance" DROP COLUMN "cancelledAt";
ALTER TABLE "RecipeInstance" DROP COLUMN "status";

ALTER TABLE "RecipeInstance" RENAME COLUMN "templateId" TO "recipeId";

ALTER TABLE "RecipeTemplate" RENAME TO "Recipe";
ALTER TABLE "RecipeInstance" RENAME TO "CookSession";

ALTER INDEX "RecipeTemplate_userId_archivedAt_createdAt_idx"
RENAME TO "Recipe_userId_archivedAt_createdAt_idx";

ALTER TABLE "CookSession" RENAME CONSTRAINT "RecipeInstance_pkey" TO "CookSession_pkey";
ALTER TABLE "CookSession" RENAME CONSTRAINT "RecipeInstance_templateId_fkey" TO "CookSession_recipeId_fkey";

CREATE INDEX "CookSession_userId_cookedAt_createdAt_idx" ON "CookSession"("userId", "cookedAt", "createdAt");
CREATE INDEX "CookSession_recipeId_cookedAt_idx" ON "CookSession"("recipeId", "cookedAt");

DROP TYPE "RecipeInstanceStatus";

DROP INDEX "UserDietaryPreferences_userId_key";
