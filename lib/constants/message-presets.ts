export const MESSAGE_PRESET_PARAM = "preset";

export const messagePresets = {
  "about-you": "Let's get to know each other.",
} as const;

export type MessagePresetId = keyof typeof messagePresets;

export function isMessagePresetId(id: string): id is MessagePresetId {
  return id in messagePresets;
}
