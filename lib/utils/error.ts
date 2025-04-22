// TODO: Add pino logging, sentry monitoring and

export function handleDbError(error: unknown, context: string): never {
  console.error(`[DB] ${context}`, { error });
  throw new Error(`Failed to ${context.toLowerCase()}`);
}

export function handleActionError(error: unknown, context: string): never {
  console.error(`[ACTION] ${context}`, { error });
  throw new Error(`Failed to ${context.toLowerCase()}`);
}
