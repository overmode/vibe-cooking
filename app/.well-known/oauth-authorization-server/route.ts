import { NextResponse } from "next/server";
import { authkitDomain } from "@/lib/mcp/env";

// Compatibility shim: some MCP clients fetch Authorization Server Metadata
// (RFC 8414) directly from the resource server instead of following the
// Protected Resource Metadata. Proxy AuthKit as the upstream source of truth.
// https://workos.com/docs/authkit/mcp
export async function GET() {
  const upstream = await fetch(
    `${authkitDomain}/.well-known/oauth-authorization-server`
  );
  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Failed to fetch authorization server metadata" },
      { status: 502 }
    );
  }
  const metadata: unknown = await upstream.json();
  return NextResponse.json(metadata, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}
