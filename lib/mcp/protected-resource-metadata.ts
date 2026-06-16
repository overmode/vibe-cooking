import {
  metadataCorsOptionsRequestHandler,
  protectedResourceHandler,
} from "mcp-handler";
import { authkitDomain, mcpResourceUrl } from "@/lib/mcp/env";

// RFC 9728 Protected Resource Metadata, pointing MCP clients at AuthKit. Shared
// by the root well-known path and the path-inserted one
// (/.well-known/oauth-protected-resource/api/mcp), which is what clients derive
// from a resource identifier that has a path. `resource` must match the `aud`
// AuthKit issues (configured as a Resource Indicator in the WorkOS dashboard).
export const GET = protectedResourceHandler({
  authServerUrls: [authkitDomain],
  resourceUrl: mcpResourceUrl,
});

export const OPTIONS = metadataCorsOptionsRequestHandler();
