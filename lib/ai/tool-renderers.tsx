import React from "react";
import { RecipePreviewCard } from "@/components/recipe/recipe-preview-card";
import { ToolInvocation } from "ai";
import {
  ToolSuccess,
  ToolSpinner,
  ToolError,
} from "@/components/chat/tool-feedback";
import { PlannedMealMetadata, RecipeMetadata, ToolResult } from "@/lib/types";

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

function renderGetRecipesMetadataTool(
  toolInvocation: ToolInvocation
): React.ReactNode {
  switch (toolInvocation.state) {
    case "partial-call":
      return <ToolSpinner message={`Retrieving recipes metadata...`} />;
    case "call":
      return <ToolSpinner message={`Retrieving recipes metadata...`} />;
    case "result":
      const recipes = toolInvocation.result as ToolResult<RecipeMetadata[]>;
      if (!recipes.success) {
        return <ToolError message={recipes.error} />;
      }
      const message =
        recipes.data.length > 0
          ? `Retrieved ${recipes.data.length} recipe${
              recipes.data.length > 1 ? "s" : ""
            } metadata!`
          : `No recipes found`;
      return <ToolSuccess message={message} />;
  }
}

function renderGetPlannedMealsMetadataTool(
  toolInvocation: ToolInvocation
): React.ReactNode {
  switch (toolInvocation.state) {
    case "partial-call":
      return <ToolSpinner message={`Retrieving planned meals metadata...`} />;
    case "call":
      return <ToolSpinner message={`Retrieving planned meals metadata...`} />;
    case "result":
      const plannedMeals = toolInvocation.result as ToolResult<
        PlannedMealMetadata[]
      >;
      if (!plannedMeals.success) {
        return <ToolError message={plannedMeals.error} />;
      }
      const message =
        plannedMeals.data.length > 0
          ? `Retrieved ${plannedMeals.data.length} planned meal${
              plannedMeals.data.length > 1 ? "s" : ""
            } metadata!`
          : `No planned meals found`;
      return <ToolSuccess message={message} />;
  }
}

function renderGetPlannedMealsTool(
  toolInvocation: ToolInvocation
): React.ReactNode {
  switch (toolInvocation.state) {
    case "partial-call":
      return <ToolSpinner message={`Retrieving planned meals...`} />;
    case "call":
      return <ToolSpinner message={`Retrieving planned meals...`} />;
    case "result":
      const plannedMeals = toolInvocation.result as ToolResult<
        PlannedMealMetadata[]
      >;
      if (!plannedMeals.success) {
        return <ToolError message={plannedMeals.error} />;
      }
      const message =
        plannedMeals.data.length > 0
          ? `Retrieved ${plannedMeals.data.length} planned meal${
              plannedMeals.data.length > 1 ? "s" : ""
            }!`
          : `No planned meals found`;
      return <ToolSuccess message={message} />;
  }
}

function renderRecipePreviewTool(
  toolInvocation: ToolInvocation
): React.ReactNode {
  switch (toolInvocation.state) {
    case "partial-call":
      return <ToolSpinner message={`Rendering recipe preview...`} />;
    case "call":
      return <ToolSpinner message={`Rendering recipe preview...`} />;
    case "result":
      return (
        <RecipePreviewCard
          cardData={toolInvocation.args}
          id={toolInvocation.toolCallId}
        />
      );
  }
}

function renderCreateRecipeTool(
  toolInvocation: ToolInvocation
): React.ReactNode {
  switch (toolInvocation.state) {
    case "partial-call":
      return (
        <ToolSpinner message={`Creating "${toolInvocation.args.name}"...`} />
      );
    case "call":
      return (
        <ToolSpinner message={`Creating "${toolInvocation.args.name}"...`} />
      );
    case "result":
      return (
        <ToolSuccess
          message={`"${toolInvocation.args.name}" created successfully!`}
        />
      );
  }
}

function renderCreatePlannedMealTool(
  toolInvocation: ToolInvocation
): React.ReactNode {
  switch (toolInvocation.state) {
    case "partial-call":
      return <ToolSpinner message={`Planning recipe...`} />;
    case "call":
      return <ToolSpinner message={`Planning recipe...`} />;
    case "result":
      return <ToolSuccess message={`Recipe planned successfully!`} />;
  }
}
function renderDeleteRecipeTool(
  toolInvocation: ToolInvocation
): React.ReactNode {
  switch (toolInvocation.state) {
    case "partial-call":
      return <ToolSpinner message={`Deleting recipe...`} />;
    case "call":
      return <ToolSpinner message={`Deleting recipe...`} />;
    case "result":
      return <ToolSuccess message={`Recipe deleted successfully!`} />;
  }
}

function renderDeletePlannedMealTool(
  toolInvocation: ToolInvocation
): React.ReactNode {
  switch (toolInvocation.state) {
    case "partial-call":
      return <ToolSpinner message={`Deleting planned meal...`} />;
    case "call":
      return <ToolSpinner message={`Deleting planned meal...`} />;
    case "result":
      return <ToolSuccess message={`Planned meal deleted successfully!`} />;
  }
}

function renderUpdateRecipeTool(
  toolInvocation: ToolInvocation
): React.ReactNode {
  switch (toolInvocation.state) {
    case "partial-call":
      return <ToolSpinner message={`Updating recipe...`} />;
    case "call":
      return <ToolSpinner message={`Updating recipe...`} />;
    case "result":
      return <ToolSuccess message={`Recipe updated successfully!`} />;
  }
}

function renderUpdatePlannedMealTool(
  toolInvocation: ToolInvocation
): React.ReactNode {
  switch (toolInvocation.state) {
    case "partial-call":
      return <ToolSpinner message={`Updating planned meal...`} />;
    case "call":
      return <ToolSpinner message={`Updating planned meal...`} />;
    case "result":
      return <ToolSuccess message={`Planned meal updated successfully!`} />;
  }
}
function renderGetRecipeByIdTool(
  toolInvocation: ToolInvocation
): React.ReactNode {
  switch (toolInvocation.state) {
    case "partial-call":
      return <ToolSpinner message={`Retrieving recipe...`} />;
    case "call":
      return <ToolSpinner message={`Retrieving recipe...`} />;
    case "result":
      return <ToolSuccess message={`Recipe retrieved successfully!`} />;
  }
}
function renderGetPlannedMealByIdTool(
  toolInvocation: ToolInvocation
): React.ReactNode {
  switch (toolInvocation.state) {
    case "partial-call":
      return <ToolSpinner message={`Retrieving planned meal...`} />;
    case "call":
      return <ToolSpinner message={`Retrieving planned meal...`} />;
    case "result":
      return <ToolSuccess message={`Planned meal retrieved successfully!`} />;
  }
}

toolRenderers["renderRecipePreviewTool"] = renderRecipePreviewTool;
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
