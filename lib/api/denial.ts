// Authz-denial vocabulary actions speak (transport-independent). Routes translate
// it to HTTP via DENIAL_STATUS, keeping the action layer API-agnostic.
export type Denial = "unauthorized" | "forbidden";

export const DENIAL_STATUS: Record<Denial, number> = {
  unauthorized: 401,
  forbidden: 403,
};
