import React from "react";
import { RecipeSuggestionCard } from "@/components/recipes/recipe-suggestion-card";
import {
  ToolSuccess,
  ToolSpinner,
  ToolError,
} from "@/components/chat/tool-feedback";
import { RecipeMetadata } from "@/lib/types";
import { Recipe, UserDietaryPreferences } from "@/generated/prisma/browser";
import { ToolResult } from "@/lib/ai/tools/types";
import { CreateRecipeInput } from "@/lib/validators/recipe";

export type ToolUIPart = {
  type: `tool-${string}`;
  toolCallId: string;
  state:
    | "input-streaming"
    | "input-available"
    | "approval-requested"
    | "approval-responded"
    | "output-available"
    | "output-error"
    | "output-denied";
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

type ToolRenderer = (part: ToolUIPart) => React.ReactNode;

const toolRenderers: Record<string, ToolRenderer> = {};

export function renderToolInvocation(part: ToolUIPart): React.ReactNode {
  const toolName = part.type.replace(/^tool-/, "");
  const renderer = toolRenderers[toolName];
  if (!renderer)
    return <ToolError message={`No renderer found for tool: ${toolName}`} />;

  return renderer(part);
}

function toolMessageRenderer<T>({
  loadingMessage,
  successMessage,
  errorMessage = (error: Extract<ToolResult<T>, { success: false }>["error"]) =>
    error,
}: {
  loadingMessage: string;
  successMessage: (
    data: Extract<ToolResult<T>, { success: true }>["data"]
  ) => string;
  errorMessage?: (
    error: Extract<ToolResult<T>, { success: false }>["error"]
  ) => string;
}): ToolRenderer {
  const renderer = (part: ToolUIPart) => {
    switch (part.state) {
      case "input-streaming":
      case "input-available":
        return <ToolSpinner message={loadingMessage} />;
      case "output-available": {
        const result = part.output as ToolResult<T>;
        if (!result.success) {
          return <ToolError message={errorMessage(result.error)} />;
        }
        return <ToolSuccess message={successMessage(result.data)} />;
      }
      case "output-error":
        return <ToolError message={part.errorText ?? "Tool execution failed"} />;
      default:
        return <ToolError message="Unknown tool state" />;
    }
  };

  renderer.displayName = "ToolMessageRenderer";

  return renderer;
}

const renderRecipeSuggestionTool: ToolRenderer = (part) => {
  switch (part.state) {
    case "input-streaming":
    case "input-available":
      return <ToolSpinner message={`Generating recipe suggestion...`} />;
    case "output-available":
      return (
        <RecipeSuggestionCard
          cardData={part.input as CreateRecipeInput}
          id={part.toolCallId}
        />
      );
    default:
      return <ToolError message="Unknown tool state" />;
  }
};

toolRenderers["webSearch"] = (part: ToolUIPart) => {
  const query = (part.input as { query?: string } | undefined)?.query;
  switch (part.state) {
    case "input-streaming":
    case "input-available":
      return <ToolSpinner message="Searching the web..." />;
    case "output-available":
      return <ToolSuccess message={query ? `Searched: "${query}"` : "Web search complete"} />;
    case "output-error":
      return <ToolError message={part.errorText ?? "Web search failed"} />;
    default:
      return null;
  }
};

toolRenderers["renderRecipeSuggestionTool"] = renderRecipeSuggestionTool;
toolRenderers["createRecipeTool"] = toolMessageRenderer<Recipe>({
  loadingMessage: "Creating recipe...",
  successMessage: (data) => `Recipe "${data.name}" created successfully!`,
});
toolRenderers["deleteRecipeTool"] = toolMessageRenderer<Recipe>({
  loadingMessage: "Deleting recipe...",
  successMessage: () => "Recipe deleted successfully!",
});
toolRenderers["getRecipesMetadataTool"] = toolMessageRenderer<RecipeMetadata[]>({
  loadingMessage: `Retrieving recipes metadata...`,
  successMessage: (data) =>
    `Retrieved ${data.length} recipe${data.length > 1 ? "s" : ""} metadata!`,
});
toolRenderers["updateRecipeTool"] = toolMessageRenderer<Recipe>({
  loadingMessage: "Updating recipe...",
  successMessage: () => "Recipe updated successfully!",
});
toolRenderers["getRecipeByIdTool"] = toolMessageRenderer<Recipe>({
  loadingMessage: "Retrieving recipe...",
  successMessage: () => "Recipe retrieved successfully!",
});
toolRenderers["updateUserProfileTool"] = (part) => {
  switch (part.state) {
    case "input-streaming":
    case "input-available":
      return (
        <p className="text-muted-foreground py-2">Updating your profile...</p>
      );
    case "output-available": {
      const result = part.output as ToolResult<UserDietaryPreferences>;
      if (!result.success) {
        return <ToolError message={result.error} />;
      }
      return (
        <p className="text-muted-foreground py-2">Updated your profile</p>
      );
    }
    case "output-error":
      return <ToolError message={"Couldn't update your profile"} />;
    default:
      return null;
  }
};
