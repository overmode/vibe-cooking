import type { UIMessage } from "ai";

export function truncateMessagesToTokenLimit(
  messages: UIMessage[],
  maxTokens: number,
): UIMessage[] {
  if (messages.length === 0) {
    return messages;
  }

  const kept: UIMessage[] = [];
  let totalTokens = 0;

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const messageTokens = estimateUIMessageTokens(message);
    if (totalTokens + messageTokens > maxTokens) {
      if (kept.length === 0) {
        return [];
      }
      break;
    }
    kept.unshift(message);
    totalTokens += messageTokens;
  }

  return kept;
}

function estimateUIMessageTokens(message: UIMessage): number {
  let total = roughTokenCount(message.role);
  for (const part of message.parts ?? []) {
    if (part.type === "text") {
      total += roughTokenCount(part.text);
    } else {
      total += roughTokenCount(JSON.stringify(part), 2);
    }
  }
  return total;
}

// Inspired by Claude Code's local token estimation (src/services/tokenEstimation.ts):
// ~4 bytes per token for text, ~2 for JSON-dense content (tool parts).
function roughTokenCount(content: string, bytesPerToken = 4): number {
  return Math.round(content.length / bytesPerToken);
}
