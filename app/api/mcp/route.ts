import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { registerMCPTools } from "@/lib/mcp/tools";
import { verifyMcpToken } from "@/lib/mcp/verify-token";

export const maxDuration = 60;

// Advisory guidance the host MAY add to its system prompt (MCP `instructions`).
// Carries cross-tool workflow only — per-tool intent lives in tool descriptions.
const instructions = `Vibe Cooking manages a user's personal recipe library and their free-text cooking profile.

Personalize every recipe to the user: call get_user_profile to learn their diet, allergies, equipment, and tastes, and respect them when creating or updating recipes.

The profile is the source of truth for who the user is. update_user_profile replaces the entire profile rather than merging, so always read it with get_user_profile first and resend the full merged text. Only store what the user has explicitly stated — never infer or guess.
`;

const handler = createMcpHandler(
  (server) => {
    registerMCPTools(server);
  },
  { serverInfo: { name: "vibe-cooking", version: "0.1.0" }, instructions },
  {
    // Single clean endpoint; SSE is deprecated by the MCP spec (2025-03-26).
    streamableHttpEndpoint: "/api/mcp",
    disableSse: true,
    maxDuration: 60,
  }
);

const authHandler = withMcpAuth(handler, verifyMcpToken, {
  required: true,
  // Path-inserted per RFC 9728: the resource (/api/mcp) has a path, so clients
  // derive the metadata URL by inserting the well-known segment before it.
  resourceMetadataPath: "/.well-known/oauth-protected-resource/api/mcp",
});

export { authHandler as GET, authHandler as POST, authHandler as DELETE };
