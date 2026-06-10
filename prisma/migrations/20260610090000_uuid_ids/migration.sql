-- Re-key every server-minted id from cuid (TEXT) to native UUID (@db.Uuid).
--
-- Existing rows are re-keyed with gen_random_uuid() (v4 — standard, not deprecated)
-- since this Postgres (17) has no built-in uuidv7(). New rows mint uuidv7 app-side
-- (@default(uuid(7))) and client-side; both versions are valid uuid and coexist in
-- the same column. Every hot query orders by createdAt, so id version never affects
-- ordering. Requires downtime: parents are re-keyed and child FKs remapped in one
-- transaction. userId stays TEXT (external WorkOS id).
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. New uuid primary keys: add nullable, backfill, then enforce NOT NULL.
ALTER TABLE "Recipe" ADD COLUMN "id_new" UUID;
UPDATE "Recipe" SET "id_new" = gen_random_uuid();
ALTER TABLE "Recipe" ALTER COLUMN "id_new" SET NOT NULL;

ALTER TABLE "ChatThread" ADD COLUMN "id_new" UUID;
UPDATE "ChatThread" SET "id_new" = gen_random_uuid();
ALTER TABLE "ChatThread" ALTER COLUMN "id_new" SET NOT NULL;

ALTER TABLE "RecipeRevision" ADD COLUMN "id_new" UUID;
UPDATE "RecipeRevision" SET "id_new" = gen_random_uuid();
ALTER TABLE "RecipeRevision" ALTER COLUMN "id_new" SET NOT NULL;

ALTER TABLE "UserProfileRevision" ADD COLUMN "id_new" UUID;
UPDATE "UserProfileRevision" SET "id_new" = gen_random_uuid();
ALTER TABLE "UserProfileRevision" ALTER COLUMN "id_new" SET NOT NULL;

ALTER TABLE "ChatMessage" ADD COLUMN "id_new" UUID;
UPDATE "ChatMessage" SET "id_new" = gen_random_uuid();
ALTER TABLE "ChatMessage" ALTER COLUMN "id_new" SET NOT NULL;

-- 2. Remap foreign-key columns onto the parents' new ids.
ALTER TABLE "RecipeRevision" ADD COLUMN "recipeId_new" UUID;
UPDATE "RecipeRevision" c SET "recipeId_new" = p."id_new"
  FROM "Recipe" p WHERE c."recipeId" = p."id";
ALTER TABLE "RecipeRevision" ALTER COLUMN "recipeId_new" SET NOT NULL;

-- recipeId is optional; rows with a NULL or dangling ref stay NULL.
ALTER TABLE "ChatThread" ADD COLUMN "recipeId_new" UUID;
UPDATE "ChatThread" c SET "recipeId_new" = p."id_new"
  FROM "Recipe" p WHERE c."recipeId" = p."id";

ALTER TABLE "ChatMessage" ADD COLUMN "threadId_new" UUID;
UPDATE "ChatMessage" c SET "threadId_new" = p."id_new"
  FROM "ChatThread" p WHERE c."threadId" = p."id";
ALTER TABLE "ChatMessage" ALTER COLUMN "threadId_new" SET NOT NULL;

-- 3. Drop FKs (before the PKs they reference), then the old PKs.
ALTER TABLE "RecipeRevision" DROP CONSTRAINT "RecipeRevision_recipeId_fkey";
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_threadId_fkey";

ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_pkey";
ALTER TABLE "RecipeRevision" DROP CONSTRAINT "RecipeRevision_pkey";
ALTER TABLE "UserProfileRevision" DROP CONSTRAINT "UserProfileRevision_pkey";
ALTER TABLE "ChatThread" DROP CONSTRAINT "ChatThread_pkey";
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_pkey";

-- 4. Drop old columns (cascades their dependent unique/index), swap new into place.
ALTER TABLE "Recipe" DROP COLUMN "id";
ALTER TABLE "Recipe" RENAME COLUMN "id_new" TO "id";

ALTER TABLE "RecipeRevision" DROP COLUMN "id";
ALTER TABLE "RecipeRevision" DROP COLUMN "recipeId";
ALTER TABLE "RecipeRevision" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "RecipeRevision" RENAME COLUMN "recipeId_new" TO "recipeId";

ALTER TABLE "UserProfileRevision" DROP COLUMN "id";
ALTER TABLE "UserProfileRevision" RENAME COLUMN "id_new" TO "id";

ALTER TABLE "ChatThread" DROP COLUMN "id";
ALTER TABLE "ChatThread" DROP COLUMN "recipeId";
ALTER TABLE "ChatThread" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "ChatThread" RENAME COLUMN "recipeId_new" TO "recipeId";

ALTER TABLE "ChatMessage" DROP COLUMN "id";
ALTER TABLE "ChatMessage" DROP COLUMN "threadId";
ALTER TABLE "ChatMessage" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "ChatMessage" RENAME COLUMN "threadId_new" TO "threadId";

-- 5. Recreate primary keys.
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id");
ALTER TABLE "RecipeRevision" ADD CONSTRAINT "RecipeRevision_pkey" PRIMARY KEY ("id");
ALTER TABLE "UserProfileRevision" ADD CONSTRAINT "UserProfileRevision_pkey" PRIMARY KEY ("id");
ALTER TABLE "ChatThread" ADD CONSTRAINT "ChatThread_pkey" PRIMARY KEY ("id");
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id");

-- 6. Recreate unique constraints / indexes that referenced the swapped columns.
CREATE UNIQUE INDEX "RecipeRevision_recipeId_revision_key" ON "RecipeRevision"("recipeId", "revision");
CREATE INDEX "ChatThread_userId_recipeId_updatedAt_idx" ON "ChatThread"("userId", "recipeId", "updatedAt");
CREATE INDEX "ChatMessage_threadId_createdAt_idx" ON "ChatMessage"("threadId", "createdAt");

-- 7. Recreate foreign keys, including the newly-promoted ChatThread.recipeId.
ALTER TABLE "RecipeRevision" ADD CONSTRAINT "RecipeRevision_recipeId_fkey"
  FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_threadId_fkey"
  FOREIGN KEY ("threadId") REFERENCES "ChatThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChatThread" ADD CONSTRAINT "ChatThread_recipeId_fkey"
  FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
