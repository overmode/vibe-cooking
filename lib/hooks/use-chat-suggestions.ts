"use client";

import { useTranslations } from "next-intl";
import { type ChatSuggestion } from "@/lib/types";

// Labels and click-messages are localized so a click in a French UI sends
// French text and the assistant answers in French.
export function useChatSuggestions(): ChatSuggestion[] {
  const t = useTranslations("suggestions");
  return [
    { label: t("quickMeal.label"), message: t("quickMeal.message") },
    { label: t("brainstorm.label"), message: t("brainstorm.message") },
    { label: t("learnTastes.label"), message: t("learnTastes.message") },
  ];
}

export function useRecipeChatSuggestions(): ChatSuggestion[] {
  const t = useTranslations("suggestions");
  return [
    { label: t("suggestUpgrade.label"), message: t("suggestUpgrade.message") },
  ];
}
