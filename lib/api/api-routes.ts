export const apiRoutes = {
  plannedMeal: {
    all: '/api/planned-meal',
    byId: (id: string) => `/api/planned-meal/${id}`,
    cook: (id: string) => `/api/planned-meal/${id}/cook`,
    uncook: (id: string) => `/api/planned-meal/${id}/uncook`,
  },
  recipe: {
    all: '/api/recipe',
    byId: (id: string) => `/api/recipe/${id}`,
  },
}
