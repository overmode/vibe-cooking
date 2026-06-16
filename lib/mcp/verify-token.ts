import { createRemoteJWKSet, jwtVerify } from "jose";
import { type AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { authkitDomain, mcpResourceUrl } from "@/lib/mcp/env";

// AuthKit (WorkOS) is the OAuth authorization server; this MCP server is the
// resource server. We only verify the bearer JWT AuthKit issued for us.
// See https://workos.com/docs/authkit/mcp
const JWKS = createRemoteJWKSet(new URL(`${authkitDomain}/oauth2/jwks`));

// `sub` is the WorkOS user id — the same identity `withAuth()` returns for the
// web session, so it flows straight into the userId-keyed action layer.
export async function verifyMcpToken(
  _req: Request,
  bearerToken?: string
): Promise<AuthInfo | undefined> {
  if (!bearerToken) return undefined;

  try {
    const { payload } = await jwtVerify(bearerToken, JWKS, {
      issuer: authkitDomain,
      audience: mcpResourceUrl,
    });
    if (!payload.sub) return undefined;

    const scope = typeof payload.scope === "string" ? payload.scope : "";
    return {
      token: bearerToken,
      clientId: payload.sub,
      scopes: scope ? scope.split(" ") : [],
      expiresAt: payload.exp,
      extra: { userId: payload.sub },
    };
  } catch {
    // Invalid/expired token: withMcpAuth turns `undefined` into a 401 + the
    // WWW-Authenticate challenge that drives client discovery.
    return undefined;
  }
}
