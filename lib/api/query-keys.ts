export const queryKeys = {
  plannedMeals: {
    all: ["planned-meals"] as const,
    byId: (id: string) => ["planned-meals", id] as const,
  },
  recipes: {
    all: ["recipes"] as const,
    byId: (id: string) => ["recipes", id] as const,
  },
  preferences: {
    all: ["preferences"] as const,
  },
};
