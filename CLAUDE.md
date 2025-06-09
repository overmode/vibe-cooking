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

- **Recipes**: Base templates with name, ingredients, instructions, servings, duration, difficulty
- **Planned Meals**: Personalized versions of recipes with overrides (ingredients, instructions, servings, etc.)
- **User Dietary Preferences**: Stored preferences that influence AI suggestions

### Key Architecture Layers

1. **Data Access** (`lib/data-access/`): Direct database operations using Prisma
2. **Actions** (`lib/actions/`): Business logic with authentication and user context
3. **API Routes** (`app/api/`): Transport layer with Zod validation
4. **Client** (`lib/api/client.ts`): API interaction layer
5. **Hooks** (`lib/api/hooks/`): React Query for data fetching and caching
6. **Components**: UI layer with chat-based interface

### AI Assistant System

- **AI Tools** (`lib/ai/tools/`): Structured tools for recipe and planned meal operations
- **Multiple Assistant Endpoints**: Different assistants for planning vs cooking modes
- **Tool Execution**: Split between definitions, execution, and client-side rendering
- **Cooking Mode**: Special mode triggered by AI for step-by-step cooking guidance

### Two Core Modes

- **Planning Mode**: Browse recipes, create planned meals, get AI suggestions
- **Cooking Mode**: Real-time cooking guidance with ability to modify planned meals

### Technology Stack

- Next.js with App Router
- PostgreSQL with Prisma ORM
- Clerk for authentication
- React Query for state management
- Vercel AI SDK for assistant functionality
- Radix UI components with Tailwind CSS

### Key Patterns

- Chat-based UX for all interactions
- Planned meals are temporary variants of base recipes
- AI tools handle CRUD operations through structured definitions
- Rate limiting with Upstash Redis
- Client-side tool rendering for UI updates

## Claude rules

- Do not add mentions to Claude nor Anthropic to PR and commit messages
