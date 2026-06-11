import {
  MESSAGE_PRESET_PARAM,
  type MessagePresetId,
} from "@/lib/constants/message-presets";

export const routes = {
  home: "/",
  chat: (threadId: string) => `/c/${threadId}`,
  homeWithMessagePreset: (presetId: MessagePresetId) =>
    `/?${MESSAGE_PRESET_PARAM}=${presetId}`,
  recipes: {
    all: "/recipes",
    byId: (id: string) => `/recipes/${id}`,
  },
  preferences: "/preferences",
} as const;
