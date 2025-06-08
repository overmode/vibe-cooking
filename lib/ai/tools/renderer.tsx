import React from "react";
import { RecipeSuggestionCard } from "@/components/recipes/recipe-suggestion-card";
import { ToolInvocation } from "ai";
import {
  ToolSuccess,
  ToolSpinner,
  ToolError,
} from "@/components/chat/tool-feedback";
import { PlannedMealMetadata, RecipeMetadata } from "@/lib/types";
import { PlannedMeal, Recipe } from "@prisma/client";
import { ToolResult } from "@/lib/ai/tools/types";

// Simple type for tool rendering functions
type ToolRenderer = (toolInvocation: ToolInvocation) => React.ReactNode;

// Map of tool names to their rendering functions
const toolRenderers: Record<string, ToolRenderer> = {};

// Simple function to render a tool's output
export function renderToolInvocation(
  toolInvocation: ToolInvocation
): React.ReactNode {
  const renderer = toolRenderers[toolInvocation.toolName];
  if (!renderer)
    return (
      <ToolError
        message={`No renderer found for tool: ${toolInvocation.toolName}`}
      />
    );

  return renderer(toolInvocation);
}

// A simple tool renderer that renders a message for loading and success states
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
}): (toolInvocation: ToolInvocation) => React.ReactNode {
  const renderer = (toolInvocation: ToolInvocation) => {
    switch (toolInvocation.state) {
      case "partial-call":
        return <ToolSpinner message={loadingMessage} />;
      case "call":
        return <ToolSpinner message={loadingMessage} />;
      case "result":
        if (!toolInvocation.result.success) {
          return (
            <ToolError message={errorMessage(toolInvocation.result.error)} />
          );
        }
        return (
          <ToolSuccess message={successMessage(toolInvocation.result.data)} />
        );
      default:
        return <ToolError message="Unknown tool state" />;
    }
  };

  // Add display name to fix ESLint warning
  renderer.displayName = "ToolMessageRenderer";

  return renderer;
}

// TODO in all functions below, tighter typing for result.data => should be linked to the actual tool

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

const renderCreateRecipeTool = toolMessageRenderer<Recipe>({
  loadingMessage: "Creating recipe...",
  successMessage: (data) => `Recipe "${data.name}" created successfully!`,
});

const renderCreatePlannedMealTool = toolMessageRenderer<PlannedMeal>({
  loadingMessage: "Planning recipe...",
  successMessage: () => "Recipe planned successfully!",
});

const renderDeleteRecipeTool = toolMessageRenderer<Recipe>({
  loadingMessage: "Deleting recipe...",
  successMessage: () => "Recipe deleted successfully!",
});

const renderDeletePlannedMealTool = toolMessageRenderer<PlannedMeal>({
  loadingMessage: "Deleting planned meal...",
  successMessage: () => "Planned meal deleted successfully!",
});

const renderUpdateRecipeTool = toolMessageRenderer<Recipe>({
  loadingMessage: "Updating recipe...",
  successMessage: () => "Recipe updated successfully!",
});

const renderUpdatePlannedMealTool = toolMessageRenderer<PlannedMeal>({
  loadingMessage: "Updating planned meal...",
  successMessage: () => "Planned meal updated successfully!",
});

const renderGetRecipeByIdTool = toolMessageRenderer<Recipe>({
  loadingMessage: "Retrieving recipe...",
  successMessage: () => "Recipe retrieved successfully!",
});

const renderGetPlannedMealByIdTool = toolMessageRenderer<PlannedMeal>({
  loadingMessage: "Retrieving planned meal...",
  successMessage: () => "Planned meal retrieved successfully!",
});

const renderEnterCookingModeTool = toolMessageRenderer<void>({
  loadingMessage: "Entering cooking mode...",
  successMessage: () => "Cooking mode entered successfully!",
});

function renderRecipeSuggestionTool(
  toolInvocation: ToolInvocation
): React.ReactNode {
  switch (toolInvocation.state) {
    case "partial-call":
      return <ToolSpinner message={`Generating recipe suggestion...`} />;
    case "call":
      return <ToolSpinner message={`Generating recipe suggestion...`} />;
    case "result":
      return (
        <RecipeSuggestionCard
          cardData={toolInvocation.args}
          id={toolInvocation.toolCallId}
        />
      );
  }
}

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
