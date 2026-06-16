import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import {
  createRecipeInputSchema,
  updateRecipeInputSchema,
} from "@/lib/validators/recipe";
import { z } from "zod";
import { MAX_USER_PROFILE_LENGTH } from "@/lib/constants/app_validation";
import {
  createRecipeAction,
  getRecipeByIdAction,
  getRecipesMetadataAction,
  updateRecipeAction,
} from "@/lib/actions/recipe";
import {
  getUserProfileAction,
  updateUserProfileAction,
} from "@/lib/actions/user-profile";

// External MCP clients act on the user's behalf, so writes are attributed to
// the assistant author, matching the in-app AI tools.
const AUTHORED_BY = "ASSISTANT";

interface ToolExtra {
  authInfo?: { extra?: Record<string, unknown> };
}

function userIdFrom(extra: ToolExtra): string {
  const userId = extra.authInfo?.extra?.userId;
  if (typeof userId !== "string") {
    // withMcpAuth gates the handler, so a verified request always carries this.
    throw new Error("Missing authenticated user");
  }
  return userId;
}

// Run a tool body, serializing its result as text content and surfacing thrown
// errors as an MCP tool error (isError) rather than a transport-level failure.
async function run(fn: () => Promise<unknown>): Promise<CallToolResult> {
  try {
    const data = await fn();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: error instanceof Error ? error.message : "Unknown error",
        },
      ],
      isError: true,
    };
  }
}

export function registerMCPTools(server: McpServer): void {
  server.registerTool(
    "list_recipes",
    {
      title: "List recipes",
      description:
        "List metadata (id, name, servings, duration, difficulty) for every recipe in the user's library. Call this to discover a recipe's id before reading or updating it.",
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    (extra) => run(() => getRecipesMetadataAction(userIdFrom(extra)))
  );

  server.registerTool(
    "get_recipe",
    {
      title: "Get recipe",
      description:
        "Get a single recipe's full content (ingredients, instructions, servings, duration, difficulty) by its id. Use list_recipes first if you don't already have the id.",
      inputSchema: { id: z.string().describe("The id of the recipe to get") },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ id }, extra) => run(() => getRecipeByIdAction(userIdFrom(extra), id))
  );

  server.registerTool(
    "create_recipe",
    {
      title: "Create recipe",
      description:
        "Save a brand-new recipe to the user's library. Use this only to add a recipe that doesn't exist yet; to change an existing one, use update_recipe. Each library has a per-user recipe cap, so this can fail with a clear error when the library is full.",
      inputSchema: createRecipeInputSchema.shape,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    (input, extra) =>
      run(() => createRecipeAction(userIdFrom(extra), input, AUTHORED_BY))
  );

  server.registerTool(
    "update_recipe",
    {
      title: "Update recipe",
      description:
        "Update an existing recipe by id. Only the fields you provide change; omitted fields are preserved. Use this instead of create_recipe to modify a recipe the user already has.",
      inputSchema: updateRecipeInputSchema.shape,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    (input, extra) =>
      run(() => updateRecipeAction(userIdFrom(extra), input, AUTHORED_BY))
  );

  server.registerTool(
    "get_user_profile",
    {
      title: "Get user profile",
      description:
        "Get the user's free-text cooking profile (diet, allergies, equipment, household, tastes). Read it to personalize recipes, and always before update_user_profile so you can merge instead of overwrite.",
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    (extra) => run(() => getUserProfileAction(userIdFrom(extra)))
  );

  server.registerTool(
    "update_user_profile",
    {
      title: "Update user profile",
      description:
        "Overwrite the user's entire cooking profile with the provided first-person text. This REPLACES the whole profile — it does not merge. First call get_user_profile and include all still-relevant existing content alongside your additions, or that information will be permanently lost. Only store details the user has explicitly stated; never infer or extrapolate.",
      inputSchema: {
        profile: z
          .string()
          .max(MAX_USER_PROFILE_LENGTH)
          .describe(
            'The complete profile text that will replace the current one, written in first person (e.g. "I live in Paris and I\'m vegetarian...").'
          ),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    ({ profile }, extra) =>
      run(() =>
        updateUserProfileAction(userIdFrom(extra), profile, AUTHORED_BY)
      )
  );
}
