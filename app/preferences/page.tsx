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
import { useState } from "react";
import { MAX_USER_PROFILE_LENGTH } from "@/lib/constants/app_validation";
import { cn } from "@/lib/utils";

const ABOUT_YOU_PLACEHOLDER = `• I'm vegetarian and allergic to nuts
• I love spicy food and prefer quick 30-minute meals
• I run 20 miles per week and sleep 7 hours nightly
• I work from home with busy weekdays
• I have intermediate cooking skills`;

export default function PreferencesPage() {
  const [draft, setDraft] = useState<string | null>(null);

  const {
    data: serverProfile,
    isLoading,
    isError,
  } = useUserProfile({});

  const serverValue = serverProfile?.content ?? "";
  const isEditing = draft !== null;

  const {
    mutate,
    isPending,
    isError: saveError,
  } = useUpdateUserProfile({
    options: { onSuccess: () => setDraft(null) },
  });

  const value = draft ?? serverValue;
  const hasChanges = isEditing && value !== serverValue;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-destructive">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mx-auto w-full max-w-2xl shrink-0 px-4 pt-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">About you</h1>
          <p className="text-sm text-muted-foreground">
            Tell us about yourself to get personalized cooking recommendations,
            or{" "}
            <Link
              href={routes.homeWithMessagePreset("about-you")}
              className="text-primary underline-offset-4 hover:underline"
            >
              take the quiz
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
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => !isEditing && setDraft(serverValue)}
            onBlur={() => !hasChanges && setDraft(null)}
            placeholder={ABOUT_YOU_PLACEHOLDER}
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
              {value.length}/{MAX_USER_PROFILE_LENGTH} characters
            </p>
          )}
          {isEditing && (
            <div className="ml-auto flex items-center gap-2">
              {saveError && (
                <span className="text-xs text-destructive">Failed to save</span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDraft(null)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => mutate(value)}
                disabled={!hasChanges || isPending}
              >
                {isPending && <LoadingSpinner size="sm" />}
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
