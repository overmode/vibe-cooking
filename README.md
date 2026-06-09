<p align="center">
  <img src="public/logo.svg" alt="Vibe Cooking logo" width="110" height="110" />
</p>

<h1 align="center">Vibe Cooking</h1>

<p align="center">An AI-powered cooking assistant — plan, tweak, and cook recipes through a relaxed chat interface.</p>

---

## Overview

**Vibe Cooking** pairs a recipe library with a chat assistant. You build and refine recipes by talking to the assistant; it can suggest recipes, save them, and edit them on your behalf. Every change — yours or the assistant's — is versioned, so the assistant can adapt a recipe freely without ever losing the original.

## Core Concepts (see `prisma/schema.prisma`)

### Recipes

A **Recipe** is a stable identity plus lifecycle state (`archivedAt`). Its content — name, ingredients, instructions, servings, duration, difficulty — lives in append-only **`RecipeRevision`** snapshots.

- The current recipe is always the **latest revision** (`max(revision)`).
- Editing **appends a new immutable snapshot** rather than mutating the previous one, so full history is preserved.
- Each revision records its **`Author`** (`USER` or `ASSISTANT`), so assistant edits can be distinguished from yours — and reverted by copying an earlier revision forward.
- Deletes are **soft** (`archivedAt`); history is never destroyed.

### User Profile

A free-text profile (dietary needs, tastes, context) that informs the assistant's suggestions. Like recipes, it's stored as append-only **`UserProfileRevision`** snapshots (latest = current), attributed via `Author`.

### Assistant

A single chat endpoint parameterized by an **app context**:

- **`mainAssistant`** — the recipe library: browse, get suggestions, save recipes, edit your profile.
- **`recipeView`** — a specific recipe: ask questions or request edits in place.

The assistant works through structured tools (recipe CRUD, profile updates, web search, recipe-suggestion rendering). Versioning is invisible to the model — it just creates/updates recipes, and the system records authorship and revisions underneath.

## Architecture

A layered architecture keeps concerns separate:

1. **Data Access** (`lib/data-access/`) — direct database operations via Prisma.
2. **Actions** (`lib/actions/`) — business logic, authentication, user context.
3. **API Routes** (`app/api/`) — transport, with Zod validation.
4. **Client** (`lib/api/client.ts`) — typed API calls.
5. **Hooks** (`lib/api/hooks/`) — data fetching and caching with React Query.
6. **Components** — the chat-based UI.

**AI tools** (`lib/ai/tools/`) are split across `definitions` (schemas), `execution` (server logic), `renderer` (client UI), `effects` (cache invalidation), and `tools` (wiring).

**Domain vs persistence types**: the app speaks in clean domain types (e.g. `Recipe` in `lib/types.ts` = identity + current content), while the Prisma row is aliased (`RecipeRow`) where raw rows are handled. See `CLAUDE.md` for the convention.

## Tech Stack

- **Next.js** (App Router) + **TypeScript**
- **PostgreSQL** with **Prisma ORM**
- **WorkOS AuthKit** for authentication
- **React Query** for state management
- **Vercel AI SDK** for the assistant
- **Radix UI** + **Tailwind CSS**

## Getting Started

```bash
# 1. Install
npm install

# 2. Configure environment (.env)
#    DATABASE_URL  — pooled connection used at runtime
#    DIRECT_URL    — direct connection used by the Prisma CLI / migrations
#    plus WorkOS AuthKit + AI provider keys

# 3. Apply migrations
npx prisma migrate deploy

# 4. Run
npm run dev          # http://localhost:3000
```

### Local database

For a throwaway local Postgres (migrations read `DIRECT_URL`, runtime reads `DATABASE_URL`):

```bash
createdb vibe_cooking_dev
DIRECT_URL="postgresql://<user>@localhost:5432/vibe_cooking_dev" npx prisma migrate deploy
# point the dev server at it via .env.local: DATABASE_URL="postgresql://<user>@localhost:5432/vibe_cooking_dev"
```

> Run `npx prisma generate` after any `schema.prisma` change (including `git stash`/`checkout`) so the client matches.

## Project Status

Under active development. Core functionality is stable; UX and features are evolving.
