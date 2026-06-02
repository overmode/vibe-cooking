export const routes = {
  home: "/",
  recipes: {
    all: "/recipes",
    byId: (id: string) => `/recipes/${id}`,
  },
  preferences: "/preferences",
} as const;
