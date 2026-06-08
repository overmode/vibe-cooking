-- CreateEnum
CREATE TYPE "ProfileAuthor" AS ENUM ('USER', 'ASSISTANT');

-- CreateTable
CREATE TABLE "UserProfileRevision" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "revision" INTEGER NOT NULL,
    "content" VARCHAR(10000) NOT NULL,
    "authoredBy" "ProfileAuthor" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProfileRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfileRevision_userId_revision_key" ON "UserProfileRevision"("userId", "revision");

-- Backfill existing preferences as revision 1 authored by the user
INSERT INTO "UserProfileRevision" ("id", "userId", "revision", "content", "authoredBy", "createdAt")
SELECT gen_random_uuid()::text, "userId", 1, "preferences", 'USER', "createdAt"
FROM "UserDietaryPreferences";

-- DropTable (single-row preferences superseded by append-only revisions)
DROP TABLE "UserDietaryPreferences";
