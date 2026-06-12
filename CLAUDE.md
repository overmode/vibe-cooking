# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Install dependencies**: `npm install`
- **Development server**: `npm run dev`
- **Build**: `npm run build`
- **Production server**: `npm start`
- **Lint**: `npm run lint`
- **Tests**: `npm test` (uses Vitest)
- **Database migrations**: `npx prisma migrate dev`
- **Generate Prisma client**: `npx prisma generate` (runs automatically on postinstall)

## Architecture Overview

This is a Next.js app with a layered architecture for an AI-powered cooking assistant:

### Core Domain Models

- **Recipes**: A `Recipe` is a stable identity plus lifecycle state (`archivedAt`). Its content (name, ingredients, instructions, servings, duration, difficulty) lives in append-only `RecipeRevision` snapshots; the current recipe is the latest revision (`max(revision)`). Each revision records its `Author` (USER or ASSISTANT), so assistant edits can be told apart from the user's.
- **User Profile**: Free-text profile that influences AI suggestions, stored as append-only `UserProfileRevision` snapshots (latest = current), also attributed via `Author`.
- **Rate limiting**: `RateLimit` model, per user per day.

### Key Architecture Layers

1. **Data Access** (`lib/data-access/`): Direct database operations using Prisma
2. **Actions** (`lib/actions/`): Business logic with authentication and user context
3. **API Routes** (`app/api/`): Transport layer with Zod validation
4. **Client** (`lib/api/client.ts`): API interaction layer
5. **Hooks** (`lib/api/hooks/`): React Query for data fetching and caching
6. **Components**: UI layer with chat-based interface

### Authorization & error handling

Responsibilities are split by layer; do not blur them.

- **Authorization lives at the route boundary**, checked up front, surfaced as
  HTTP status codes (`401` unauthenticated, `403` not the caller's resource,
  `404` absent). Never defer an auth check into a post-response hook (e.g. an
  `onFinish` save) — by then the work is already done.
- **Data-access trusts the authorized caller.** It does not re-check ownership;
  the route is the single source of truth for authorization. Keep these
  functions focused on persistence.
- **Side-effect persistence is best-effort.** Work that runs after the response
  has started streaming (saving messages in `onFinish`, etc.) is wrapped at the
  call site, logged on failure, and must never break the user-facing stream —
  but must never be silently swallowed in the data layer either.
- **No silent failures.** Expected errors surface via status codes; unexpected
  ones are logged (`console.error` today; pino/Sentry is a pending sweep).

### AI Assistant System

- **AI Tools** (`lib/ai/tools/`): Structured tools for recipe and user-profile operations, plus web search and recipe-suggestion rendering. Each tool is split across `definitions` (schemas), `execution` (server logic), `renderer` (client UI), `effects` (React Query cache invalidation), and `tools` (wiring).
- **Single assistant endpoint** (`app/api/assistant/route.ts`) parameterized by an **app context** (`lib/ai/app-context.ts`): `mainAssistant` (the recipe library) or `recipeView` (a specific recipe).
- **Authorship**: tool writes set `authoredBy = ASSISTANT`; user-initiated actions default to `USER`. Versioning is invisible to the model — tool input/output schemas expose no revision concept.

### Internationalization (i18n)

`next-intl` with **no URL routing**. Locale is resolved from the `NEXT_LOCALE`
cookie, then `Accept-Language`, falling back to `defaultLocale` (**English**).
French is the primary audience, so it gets first-class translation/tone care,
but English remains the default fallback.

- **Locale resolution**: `getUserLocale()` (`i18n/user-locale.ts`, marked
  `server-only`) is the single source of truth. `setUserLocale()` lives in its
  own `"use server"` file (`i18n/set-user-locale.ts`) — keep the pure resolver
  and the cookie-writing action separate.
- **Catalogs**: `messages/{en,fr}.json`, kept at key parity. `global.ts`
  augments next-intl from `en.json` so keys/params are type-checked at compile
  time.
- **Usage**: `useTranslations` in client components, `getTranslations` in
  server components/`generateMetadata`. Use `t.rich` when interpolating React
  nodes.
- **Lint guard**: `eslint-plugin-i18next`'s `no-literal-string`
  (`jsx-text-only`) runs over `app/**` and `components/**`, excluding
  `components/ui/**`. Hardcoded JSX text fails lint; allow genuine exceptions
  (brand name, etc.) with a scoped `eslint-disable-next-line`.
- **AI language**: the resolved locale is threaded into the assistant prompt
  (`compileAssistantPrompt`) so replies default to the UI language when the
  user's message is too short to infer one.
- **French tone**: friendly, informal **"tu"** register; the mascot speaks in
  the first person singular ("Parle-moi de toi", not "Parle-nous").
- **Layout robustness**: shadcn `Button`/`TabsTrigger`/`Badge` are
  `whitespace-nowrap`, so long labels clip rather than wrap. Keep button labels
  short (verb + icon); reserve `truncate` for variable/user data (emails,
  recipe names, thread titles), not for static copy.

### Technology Stack

- Next.js with App Router
- next-intl for internationalization (cookie-based, no routing)
- PostgreSQL with Prisma ORM
- WorkOS AuthKit for authentication
- React Query for state management
- Vercel AI SDK for assistant functionality
- Radix UI components with Tailwind CSS

### Key Patterns

- Chat-based UX for all interactions
- Append-only revisions: recipe and profile content are versioned; current = latest revision
- AI tools handle CRUD operations through structured definitions
- Rate limiting with Postgres (`RateLimit` model)
- Client-side tool rendering for UI updates

### Naming: domain types vs persistence rows

The domain owns the clean name; persistence is qualified. When an app-layer
shape differs from its Prisma row (e.g. a model assembled from a normalized
identity + its current versioned content), the domain type keeps the plain
name and the Prisma row is aliased.

- The domain type (defined in `lib/types.ts`) gets the canonical name, e.g.
  `Recipe`. App layers (client, hooks, components, AI tool result types,
  app-context) import it from `@/lib/types`.
- The Prisma row is imported aliased only where raw rows are handled (mostly
  `lib/data-access/`): `import { Recipe as RecipeRow } from "@/generated/prisma/client"`.
- Projection shapes are purpose-qualified off the domain type:
  `RecipeMetadata` (list view), `RecipeContent` (the versioned fields).
- Do not use a `Dto` suffix. Suffix-free domain names are the house style
  (`UserProfile`, `Recipe`).
- Prefer this only when the shapes genuinely differ. If the domain and row are
  identical, use the single Prisma type rather than inventing a second name.

## Claude rules

- Do not add mentions to Claude nor Anthropic to PR and commit messages
