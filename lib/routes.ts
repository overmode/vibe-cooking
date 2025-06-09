export const routes = {
  home: "/",
  plannedMeal: {
    all: "/planned-meals",
    byId: (id: string) => `/planned-meals/${id}`,
    cooking: (id: string) => `/planned-meals/${id}/cook`,
  },
  recipes: {
    all: "/recipes",
    byId: (id: string) => `/recipes/${id}`,
  },
  preferences: "/preferences",
} as const;
