import { describe, expect, it } from "vitest";
import type { UIMessage } from "ai";
import { truncateMessagesToTokenLimit } from "./truncate-messages";

function textMessage(
  id: string,
  role: UIMessage["role"],
  text: string
): UIMessage {
  return { id, role, parts: [{ type: "text", text }] };
}

describe("truncateMessagesToTokenLimit", () => {
  it("returns an empty array unchanged", () => {
    expect(truncateMessagesToTokenLimit([], 100_000)).toEqual([]);
  });

  it("keeps all messages when under the limit", () => {
    const messages = [
      textMessage("1", "user", "hello"),
      textMessage("2", "assistant", "hi there"),
    ];

    expect(truncateMessagesToTokenLimit(messages, 1_000)).toEqual(messages);
  });

  it("drops older messages and keeps the newest within the limit", () => {
    const messages = [
      textMessage("1", "user", "a".repeat(400)),
      textMessage("2", "assistant", "b".repeat(400)),
      textMessage("3", "user", "c".repeat(400)),
    ];

    expect(truncateMessagesToTokenLimit(messages, 150)).toEqual([messages[2]]);
  });

  it("returns an empty array when the last message alone exceeds the limit", () => {
    const message = textMessage("1", "user", "a".repeat(10_000));

    expect(truncateMessagesToTokenLimit([message], 10)).toEqual([]);
  });

  it("counts tool parts with the JSON-dense ratio", () => {
    const toolPart = {
      type: "tool-createRecipe" as const,
      toolCallId: "call-1",
      state: "output-available" as const,
      input: { name: "Pasta" },
      output: { id: "recipe-1" },
    };
    const messages: UIMessage[] = [
      {
        id: "1",
        role: "assistant",
        parts: [toolPart],
      },
      textMessage("2", "user", "thanks"),
    ];

    const toolTokens = Math.round(JSON.stringify(toolPart).length / 2) + 2;
    const thanksTokens = Math.round("thanks".length / 4) + 1;

    expect(truncateMessagesToTokenLimit(messages, toolTokens)).toEqual([
      messages[1],
    ]);
    expect(
      truncateMessagesToTokenLimit(messages, toolTokens + thanksTokens)
    ).toEqual(messages);
  });
});
