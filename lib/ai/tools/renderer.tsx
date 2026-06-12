import React from "react";
import type { useTranslations } from "next-intl";
import { RecipeSuggestionCard } from "@/components/recipes/recipe-suggestion-card";
import {
  ToolSuccess,
  ToolSpinner,
  ToolError,
} from "@/components/chat/tool-feedback";
import { type Recipe, type RecipeMetadata, type UserProfile } from "@/lib/types";
import { type ToolResult } from "@/lib/ai/tools/types";
import { type CreateRecipeInput } from "@/lib/validators/recipe";

export type ToolsTranslator = ReturnType<typeof useTranslations<"tools">>;

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

type ToolRenderer = (part: ToolUIPart, t: ToolsTranslator) => React.ReactNode;

const toolRenderers: Record<string, ToolRenderer> = {};

export function renderToolInvocation(
  part: ToolUIPart,
  t: ToolsTranslator
): React.ReactNode {
  const toolName = part.type.replace(/^tool-/, "");
  const renderer = toolRenderers[toolName];
  if (!renderer)
    return <ToolError message={`No renderer found for tool: ${toolName}`} />;

  return renderer(part, t);
}

function toolMessageRenderer<T>({
  loading,
  success,
  // Errors carry server-generated text, surfaced verbatim.
  error = (errorText: Extract<ToolResult<T>, { success: false }>["error"]) =>
    errorText,
}: {
  loading: (t: ToolsTranslator) => string;
  success: (
    t: ToolsTranslator,
    data: Extract<ToolResult<T>, { success: true }>["data"]
  ) => string;
  error?: (
    errorText: Extract<ToolResult<T>, { success: false }>["error"]
  ) => string;
}): ToolRenderer {
  const renderer = (part: ToolUIPart, t: ToolsTranslator) => {
    switch (part.state) {
      case "input-streaming":
      case "input-available":
        return <ToolSpinner message={loading(t)} />;
      case "output-available": {
        const result = part.output as ToolResult<T>;
        if (!result.success) {
          return <ToolError message={error(result.error)} />;
        }
        return <ToolSuccess message={success(t, result.data)} />;
      }
      case "output-error":
        return <ToolError message={part.errorText ?? t("executionFailed")} />;
      default:
        return <ToolError message={t("unknownState")} />;
    }
  };

  renderer.displayName = "ToolMessageRenderer";

  return renderer;
}

const renderRecipeSuggestionTool: ToolRenderer = (part, t) => {
  switch (part.state) {
    case "input-streaming":
    case "input-available":
      return <ToolSpinner message={t("generatingSuggestion")} />;
    case "output-available":
      return (
        <RecipeSuggestionCard
          cardData={part.input as CreateRecipeInput}
          id={part.toolCallId}
        />
      );
    default:
      return <ToolError message={t("unknownState")} />;
  }
};

toolRenderers["webSearch"] = (part, t) => {
  const query = (part.input as { query?: string } | undefined)?.query;
  switch (part.state) {
    case "input-streaming":
    case "input-available":
      return <ToolSpinner message={t("searchingWeb")} />;
    case "output-available":
      return (
        <ToolSuccess
          message={query ? t("searched", { query }) : t("webSearchComplete")}
        />
      );
    case "output-error":
      return <ToolError message={part.errorText ?? t("webSearchFailed")} />;
    default:
      return null;
  }
};

toolRenderers["renderRecipeSuggestionTool"] = renderRecipeSuggestionTool;
toolRenderers["createRecipeTool"] = toolMessageRenderer<Recipe>({
  loading: (t) => t("creatingRecipe"),
  success: (t, data) => t("recipeCreated", { name: data.name }),
});
toolRenderers["deleteRecipeTool"] = toolMessageRenderer<Recipe>({
  loading: (t) => t("deletingRecipe"),
  success: (t) => t("recipeDeleted"),
});
toolRenderers["getRecipesMetadataTool"] = toolMessageRenderer<RecipeMetadata[]>({
  loading: (t) => t("retrievingRecipesMetadata"),
  success: (t, data) => t("recipesMetadataRetrieved", { count: data.length }),
});
toolRenderers["updateRecipeTool"] = toolMessageRenderer<Recipe>({
  loading: (t) => t("updatingRecipe"),
  success: (t) => t("recipeUpdated"),
});
toolRenderers["getRecipeByIdTool"] = toolMessageRenderer<Recipe>({
  loading: (t) => t("retrievingRecipe"),
  success: (t) => t("recipeRetrieved"),
});
toolRenderers["updateUserProfileTool"] = (part, t) => {
  switch (part.state) {
    case "input-streaming":
    case "input-available":
      return (
        <p className="text-muted-foreground py-2">{t("updatingProfile")}</p>
      );
    case "output-available": {
      const result = part.output as ToolResult<UserProfile>;
      if (!result.success) {
        return <ToolError message={result.error} />;
      }
      return <p className="text-muted-foreground py-2">{t("profileUpdated")}</p>;
    }
    case "output-error":
      return <ToolError message={t("profileUpdateFailed")} />;
    default:
      return null;
  }
};
