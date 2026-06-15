"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  useUserProfile,
  useUpdateUserProfile,
} from "@/lib/api/hooks/user-profile";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { MAX_USER_PROFILE_LENGTH } from "@/lib/constants/app_validation";
import { cn } from "@/lib/utils";

export default function PreferencesPage() {
  const t = useTranslations("preferences");
  const tCommon = useTranslations("common");
  const [draft, setDraft] = useState<string | null>(null);

  const { data: serverProfile, isLoading, isError } = useUserProfile({});

  const serverValue = serverProfile?.content ?? "";
  const isEditing = draft !== null;

  const {
    mutate,
    isPending,
    isError: saveError,
  } = useUpdateUserProfile({
    options: {
      onSuccess: () => {
        setDraft(null);
      },
    },
  });

  const value = draft ?? serverValue;
  const hasChanges = isEditing && value !== serverValue;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">{tCommon("loading")}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-destructive">{t("failedToLoad")}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mx-auto w-full max-w-2xl shrink-0 px-4 pt-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("subtitlePrefix")}
            <Link
              href={routes.homeWithMessagePreset("about-you")}
              className="text-primary underline-offset-4 hover:underline"
            >
              {t("takeQuiz")}
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col gap-3 px-4 pb-6 pt-4">
        <div className="min-h-0 flex-1">
          <Textarea
            id="preferences"
            value={value}
            onChange={(e) => {
              setDraft(e.target.value);
            }}
            onFocus={() => {
              if (!isEditing) setDraft(serverValue);
            }}
            onBlur={() => {
              if (!hasChanges) setDraft(null);
            }}
            placeholder={t("placeholder")}
            className={cn(
              "field-sizing-fixed h-full min-h-0 resize-none overflow-y-auto transition-colors",
              isEditing
                ? "border-border focus-visible:border-border"
                : "cursor-text border-transparent bg-transparent shadow-none hover:border-border hover:bg-accent/40 focus-visible:ring-0 [@media(hover:none)]:border-border/60"
            )}
            maxLength={MAX_USER_PROFILE_LENGTH}
          />
        </div>
        <div className="flex h-9 shrink-0 items-center justify-between">
          {isEditing && value.length >= MAX_USER_PROFILE_LENGTH && (
            <p className="text-xs text-destructive">
              {t("charCount", {
                count: value.length,
                max: MAX_USER_PROFILE_LENGTH,
              })}
            </p>
          )}
          {(hasChanges || isPending) && (
            <div className="ml-auto flex items-center gap-2">
              {saveError && (
                <span className="text-xs text-destructive">
                  {t("failedToSave")}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDraft(null);
                }}
                disabled={isPending}
              >
                {tCommon("cancel")}
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  mutate(value);
                }}
                disabled={isPending}
              >
                {isPending && <LoadingSpinner size="sm" />}
                {isPending ? tCommon("saving") : tCommon("save")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
