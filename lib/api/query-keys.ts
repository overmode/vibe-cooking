export const queryKeys = {
  recipes: {
    all: ["recipes"] as const,
    byId: (id: string) => ["recipes", id] as const,
  },
  userProfile: {
    all: ["user-profile"] as const,
  },
};
