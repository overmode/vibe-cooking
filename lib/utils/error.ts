// TODO: Add pino logging, sentry monitoring and error tracking

export function handleDbError(error: unknown, context: string): never {
  console.error(`[DB] ${context}`, { error })
  throw new Error(
    `Failed to ${context.toLowerCase()}: ${
      error instanceof Error ? error.message : `${error}`
    }`
  )
}

export function handleActionError(error: unknown, context: string): never {
  console.error(`[ACTION] ${context}`, { error })
  throw new Error(
    `Failed to ${context.toLowerCase()}: ${
      error instanceof Error ? error.message : `${error}`
    }`
  )
}

export function handleApiError(error: unknown, context: string): never {
  console.error(`[API] ${context}`, { error })
  throw new Error(
    `Failed to ${context.toLowerCase()}: ${
      error instanceof Error ? error.message : `${error}`
    }`
  )
}
