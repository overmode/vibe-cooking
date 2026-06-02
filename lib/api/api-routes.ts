export const apiRoutes = {
  recipe: {
    all: "/api/recipe",
    byId: (id: string) => `/api/recipe/${id}`,
  },
  assistant: "/api/assistant",
  preferences: {
    all: "/api/preferences",
  },
} as const;
