import {
  MESSAGE_PRESET_PARAM,
  MessagePresetId,
} from "@/lib/constants/message-presets";

export const routes = {
  home: "/",
  homeWithMessagePreset: (presetId: MessagePresetId) =>
    `/?${MESSAGE_PRESET_PARAM}=${presetId}`,
  recipes: {
    all: "/recipes",
    byId: (id: string) => `/recipes/${id}`,
  },
  preferences: "/preferences",
} as const;
