function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// WorkOS AuthKit is the OAuth authorization server (issuer + JWKS host); the
// MCP endpoint URL is the resource identifier and the token `aud`. Resolved
// once here so the env-var names live in a single place.
export const authkitDomain = requireEnv("WORKOS_AUTHKIT_DOMAIN");
export const mcpResourceUrl = requireEnv("MCP_RESOURCE_URL");
