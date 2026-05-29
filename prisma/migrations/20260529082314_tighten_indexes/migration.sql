-- DropIndex
DROP INDEX "RecipeInstance_templateId_idx";

-- DropIndex
DROP INDEX "RecipeInstance_userId_cookedAt_idx";

-- DropIndex
DROP INDEX "RecipeInstance_userId_plannedFor_idx";

-- DropIndex
DROP INDEX "RecipeInstance_userId_status_idx";

-- DropIndex
DROP INDEX "RecipeTemplate_userId_archivedAt_idx";

-- DropIndex
DROP INDEX "RecipeTemplate_userId_idx";

-- CreateIndex
CREATE INDEX "RecipeInstance_userId_status_createdAt_idx" ON "RecipeInstance"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "RecipeInstance_templateId_status_idx" ON "RecipeInstance"("templateId", "status");

-- CreateIndex
CREATE INDEX "RecipeTemplate_userId_archivedAt_createdAt_idx" ON "RecipeTemplate"("userId", "archivedAt", "createdAt");
