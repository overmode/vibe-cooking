export const apiRoutes = {
  recipe: {
    all: "/api/recipe",
    byId: (id: string) => `/api/recipe/${id}`,
  },
  assistant: "/api/assistant",
  transcribe: "/api/transcribe",
  rateLimit: "/api/rate-limit",
  chatThread: {
    all: "/api/chat-threads",
    byId: (threadId: string) => `/api/chat-threads/${threadId}`,
  },
  userProfile: {
    all: "/api/user-profile",
  },
} as const;
