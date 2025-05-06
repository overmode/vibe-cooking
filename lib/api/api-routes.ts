export const apiRoutes = {
  plannedMeal: {
    all: '/api/planned-meal',
    byId: (id: string) => `/api/planned-meal/${id}`,
    cook: (id: string) => `/api/planned-meal/${id}/cook`,
    uncook: (id: string) => `/api/planned-meal/${id}/uncook`,
  },
  recipe: {
    all: '/api/recipe',
    plan: (id: string) => `/api/recipe/${id}/plan`,
    byId: (id: string) => `/api/recipe/${id}`,
  },
  assistants: {
    planning: '/api/assistants/planning',
    cooking: '/api/assistants/cooking',
    recipe: '/api/assistants/recipe',
    plannedMeal: '/api/assistants/planned-meal',
  },
} as const
