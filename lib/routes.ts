export const routes = {
    home: "/",
    plannedMeal: {
        cooking: (id: string) => `/planned-meal/${id}/cook`,
    },
} as const;
