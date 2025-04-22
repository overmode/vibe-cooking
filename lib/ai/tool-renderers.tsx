import React from "react";
import { RecipePreviewCard } from "@/components/recipe/recipe-preview-card";
import { ToolInvocation } from "ai";
import {
  ToolSuccess,
  ToolSpinner,
  ToolError,
} from "@/components/chat/tool-feedback";

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
      const recipes = toolInvocation.result;
      return (
        <ToolSuccess
          message={`Retrieved ${recipes.length} recipes metadata!`}
        />
      );
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

toolRenderers["renderRecipePreviewTool"] = renderRecipePreviewTool;
toolRenderers["createRecipeTool"] = renderCreateRecipeTool;
toolRenderers["deleteRecipeTool"] = renderDeleteRecipeTool;
toolRenderers["getRecipesMetadataTool"] = renderGetRecipesMetadataTool;
toolRenderers["updateRecipeTool"] = renderUpdateRecipeTool;
