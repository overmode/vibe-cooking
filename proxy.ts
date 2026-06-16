import { authkitProxy } from "@workos-inc/authkit-nextjs";

export default authkitProxy({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: [
      "/callback",
      "/login",
      "/signup",
      // Public legal pages — must be reachable without a session (e.g. for
      // marketplace reviewers and signed-out visitors).
      "/privacy",
      "/terms",
      // MCP uses OAuth bearer tokens (verified in the route), not the AuthKit
      // session cookie, so it must bypass the session-redirect guard. Same for
      // the public OAuth discovery metadata endpoints.
      "/api/mcp",
      "/.well-known/oauth-protected-resource",
      "/.well-known/oauth-protected-resource/api/mcp",
      "/.well-known/oauth-authorization-server",
      // OpenAI domain-verification challenge for app submission.
      "/.well-known/openai-apps-challenge",
    ],
  },
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
