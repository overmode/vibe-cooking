export function handleDbError(error: unknown, context: string): never {
  console.error(`[DB] ${context}`, { error });
  throw new Error(`Failed to ${context.toLowerCase()}`);
}
