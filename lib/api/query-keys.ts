export const queryKeys = {
  recipes: {
    all: ["recipes"] as const,
    byId: (id: string) => ["recipes", id] as const,
  },
  preferences: {
    all: ["preferences"] as const,
  },
};
