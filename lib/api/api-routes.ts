export const apiRoutes = {
  recipe: {
    all: "/api/recipe",
    byId: (id: string) => `/api/recipe/${id}`,
  },
  assistant: "/api/assistant",
  chatThread: {
    byId: (threadId: string) => `/api/chat-threads/${threadId}`,
  },
  userProfile: {
    all: "/api/user-profile",
  },
} as const;
