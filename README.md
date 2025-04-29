# Vibe Cooking App

Welcome to **Vibe Cooking**, an AI-powered cooking assistant designed to make your kitchen experience seamless.

---

## Project Overview

**Vibe Cooking** combines AI-driven meal suggestions, recipe management, and live cooking guidance to help users prepare meals in a relaxed and intuitive way.

### Key Concepts (see schema.prisma)

#### 🍲 **Recipes**

**Recipes** serve as the foundation of this app. They consist of:
- Name, ingredients, and instructions
- Servings, difficulty, and duration

Planning to cook a recipe leads to the creation of a **Planned Meal**, derived from the recipe, but with possible variations and overrides based on available ingredients or preferences.

#### 🍽 **Planned Meals**

A **Planned Meal** is a **personalized version** of a recipe. It allows users to:
- Modify ingredients (e.g., substitute, remove, or adjust)
- Change the cooking instructions
- Adjust servings, difficulty, or duration

Planned Meals are **temporary variants** of recipes, intended for real-time adaptations when cooking. These modifications don't affect the original recipe, ensuring flexibility without breaking the consistency of core recipe data.

---

## 🏛️ Architecture

The project follows a **Layered Architecture** to maintain a clear separation of concerns and facilitate scalability. Key layers include:

1. **Data Access**: Low-level interaction with the database (Prisma).
2. **Actions**: Contains business logic, authentication, and user-specific context.
3. **API Routes**: Simple transport routes, validating inputs with Zod.
4. **Client**: Encapsulates API calls and fetches data.
5. **Hooks**: Manages data fetching and caching with React Query/SWR.
6. **Components**: The UI layer — React components that handle the presentation.

---

## ⚙️ Features & Functionality

### Two Core Modes: **Planning** & **Cooking**

- **Planning Mode**:
  - This is the mode you are in when landing in the app
  - Browse recipes, create planned meals, and manage meal schedules.
  - The AI assistant helps suggest recipes and personalize meal plans.

- **Cooking Mode**:
  - Provides step-by-step cooking guidance based on the user’s planned meal.
  - Allows for real-time ingredient and instruction modifications.
  - Helps the user adjust servings and other parameters as they cook.
  - This mode is triggered by the AI directly.

The assistant triggers **Cooking** mode based on user input, guiding them through meal preparation from start to finish.

---

## 🔧 Technologies Used

- **React / Next.js**
- **TypeScript**
- **Prisma**
- **React Query**
- **Zod**
- **Vercel AI SDK**

---

## 🧩 How It Works

1. **Recipe Creation & Planning**: Users can create recipes and plan meals by customizing them based on their needs and preferences.
2. **Cooking Assistance**: The assistant guides the user through cooking, allowing for adjustments along the way.
3. **Chat-Based UX**: The user interacts with the assistant through a chat interface, asking questions or requesting adjustments.
4. **Data Storage**: All data (recipes, planned meals, user history) is stored in a PostgreSQL database.
5. **Querying & Caching**: React Query manages efficient data fetching, caching, and mutation.
6. **API Routes**: API routes handle CRUD operations for recipes and planned meals, validating inputs via Zod.
7. **Action Layer**: Centralized business logic ensures a clean separation of concerns between data access, user context, and UI rendering.

---

## 📝 To-Do / Future Features

The project is still in active development, and several key features are in progress or planned for future releases:

- **Shopping List Integration**: Generate detailed, shelf-organized shopping lists based on planned meals.
- **Detailed Recipe Tracking**: Track calories, nutrition, and other metrics for meals.
- **Dedicated Recipes View**: Offer a place where users can track their cooking history and saved recipes.

---

## 🚀 Getting Started

To get started with the Vibe Cooking app, follow these steps:

1. Clone the repository: `git clone https://github.com/your-repo-url`
2. Install dependencies: `npm install`
3. Set up the database with Prisma: `npx prisma migrate dev`
4. Start the development server: `npm run dev`
5. Open the app in your browser at `http://localhost:3000`

---

## 🔄 Project Status

The project is **under active development**. The core functionality is stable-ish, and I'm continuously refining the user experience and adding new features.
