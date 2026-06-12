export const MESSAGE_PRESET_PARAM = "preset";

export const messagePresetIds = ["about-you", "first-recipe"] as const;

export type MessagePresetId = (typeof messagePresetIds)[number];

export function isMessagePresetId(id: string): id is MessagePresetId {
  return (messagePresetIds as readonly string[]).includes(id);
}
