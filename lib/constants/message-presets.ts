export const MESSAGE_PRESET_PARAM = "preset";

export const messagePresets = {
  "about-you": "Learn my tastes.",
  "first-recipe": "Let's create my first recipe!",
} as const;

export type MessagePresetId = keyof typeof messagePresets;

export function isMessagePresetId(id: string): id is MessagePresetId {
  return id in messagePresets;
}
