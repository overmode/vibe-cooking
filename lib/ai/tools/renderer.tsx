import React from "react";
import { RecipeSuggestionCard } from "@/components/recipes/recipe-suggestion-card";
import {
  ToolSuccess,
  ToolSpinner,
  ToolError,
} from "@/components/chat/tool-feedback";
import { PlannedMealMetadata, RecipeMetadata } from "@/lib/types";
import { RecipeInstance, RecipeTemplate } from "@/generated/prisma/browser";
import { ToolResult } from "@/lib/ai/tools/types";
import { CreateRecipeInput } from "@/lib/validators/recipe";

// v6 tool UI parts are typed `tool-${name}` with flat state/input/output.
// We keep a narrow shape so all tools can share a single renderer signature.
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

const renderGetRecipesMetadataTool = toolMessageRenderer<RecipeMetadata[]>({
  loadingMessage: `Retrieving recipes metadata...`,
  successMessage: (data) =>
    `Retrieved ${data.length} recipe${data.length > 1 ? "s" : ""} metadata!`,
});

const renderGetPlannedMealsMetadataTool = toolMessageRenderer<
  PlannedMealMetadata[]
>({
  loadingMessage: `Retrieving planned meals metadata...`,
  successMessage: (data) =>
    `Retrieved ${data.length} planned meal${
      data.length > 1 ? "s" : ""
    } metadata!`,
});

const renderGetPlannedMealsTool = toolMessageRenderer<PlannedMealMetadata[]>({
  loadingMessage: `Retrieving planned meals...`,
  successMessage: (data) =>
    `Retrieved ${data.length} planned meal${data.length > 1 ? "s" : ""}!`,
});

const renderCreateRecipeTool = toolMessageRenderer<RecipeTemplate>({
  loadingMessage: "Creating recipe...",
  successMessage: (data) => `Recipe "${data.name}" created successfully!`,
});

const renderCreatePlannedMealTool = toolMessageRenderer<RecipeInstance>({
  loadingMessage: "Planning recipe...",
  successMessage: () => "Recipe planned successfully!",
});

const renderDeleteRecipeTool = toolMessageRenderer<RecipeTemplate>({
  loadingMessage: "Deleting recipe...",
  successMessage: () => "Recipe deleted successfully!",
});

const renderDeletePlannedMealTool = toolMessageRenderer<RecipeInstance>({
  loadingMessage: "Deleting planned meal...",
  successMessage: () => "Planned meal deleted successfully!",
});

const renderUpdateRecipeTool = toolMessageRenderer<RecipeTemplate>({
  loadingMessage: "Updating recipe...",
  successMessage: () => "Recipe updated successfully!",
});

const renderUpdatePlannedMealTool = toolMessageRenderer<RecipeInstance>({
  loadingMessage: "Updating planned meal...",
  successMessage: () => "Planned meal updated successfully!",
});

const renderGetRecipeByIdTool = toolMessageRenderer<RecipeTemplate>({
  loadingMessage: "Retrieving recipe...",
  successMessage: () => "Recipe retrieved successfully!",
});

const renderGetPlannedMealByIdTool = toolMessageRenderer<RecipeInstance>({
  loadingMessage: "Retrieving planned meal...",
  successMessage: () => "Planned meal retrieved successfully!",
});

const renderEnterCookingModeTool = toolMessageRenderer<void>({
  loadingMessage: "Entering cooking mode...",
  successMessage: () => "Cooking mode entered successfully!",
});

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

toolRenderers["renderRecipeSuggestionTool"] = renderRecipeSuggestionTool;
toolRenderers["createRecipeTool"] = renderCreateRecipeTool;
toolRenderers["deleteRecipeTool"] = renderDeleteRecipeTool;
toolRenderers["getRecipesMetadataTool"] = renderGetRecipesMetadataTool;
toolRenderers["updateRecipeTool"] = renderUpdateRecipeTool;
toolRenderers["getRecipeByIdTool"] = renderGetRecipeByIdTool;
toolRenderers["getPlannedMealsMetadataTool"] =
  renderGetPlannedMealsMetadataTool;
toolRenderers["getPlannedMealsTool"] = renderGetPlannedMealsTool;
toolRenderers["createPlannedMealTool"] = renderCreatePlannedMealTool;
toolRenderers["deletePlannedMealTool"] = renderDeletePlannedMealTool;
toolRenderers["updatePlannedMealTool"] = renderUpdatePlannedMealTool;
toolRenderers["getPlannedMealByIdTool"] = renderGetPlannedMealByIdTool;
toolRenderers["enterCookingModeTool"] = renderEnterCookingModeTool;
