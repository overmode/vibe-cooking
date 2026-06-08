export const apiRoutes = {
  recipe: {
    all: "/api/recipe",
    byId: (id: string) => `/api/recipe/${id}`,
  },
  assistant: "/api/assistant",
  userProfile: {
    all: "/api/user-profile",
  },
} as const;
