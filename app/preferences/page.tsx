"use client";

import { EmptyAboutYou } from "@/components/preferences/empty-about-you";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  useUserDietaryPreferences,
  useUpdateUserDietaryPreferences,
} from "@/lib/api/hooks/preferences";
import { routes } from "@/lib/routes";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { debounce } from "lodash";
import { MAX_USER_PROFILE_LENGTH } from "@/lib/constants/app_validation";

const SAVE_DEBOUNCE_MS = 1000;

export default function PreferencesPage() {
  const [draft, setDraft] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const {
    data: serverPreferences,
    isLoading,
    isError,
  } = useUserDietaryPreferences({});

  const serverValue = serverPreferences?.preferences ?? "";

  // show local edits while dirty, otherwise follow the server value
  const value = isDirty ? draft : serverValue;

  const {
    mutate,
    isPending,
    isSuccess,
    isError: saveError,
  } = useUpdateUserDietaryPreferences({
    options: { onSuccess: () => setIsDirty(false) },
  });

  const debouncedSave = useMemo(
    () => debounce((next: string) => mutate(next), SAVE_DEBOUNCE_MS),
    [mutate]
  );

  useEffect(() => () => debouncedSave.cancel(), [debouncedSave]);

  const isSaved = isSuccess && !isPending && !isDirty;
  const isProfileEmpty = !serverValue.trim();

  const handlePreferencesChange = (next: string) => {
    setDraft(next);
    setIsDirty(true);
    debouncedSave(next);
  };

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

  if (isProfileEmpty) {
    return <EmptyAboutYou />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mx-auto w-full max-w-2xl shrink-0 px-4 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-2 text-2xl font-semibold">About you</h1>
            <p className="text-sm text-muted-foreground">
              Tell us about yourself to get personalized cooking recommendations.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href={routes.homeWithMessagePreset("about-you")}>
              Let&apos;s get to know each other
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col gap-3 px-4 pb-6 pt-4">
        <Textarea
          id="preferences"
          value={value}
          onChange={(e) => handlePreferencesChange(e.target.value)}
          className="field-sizing-fixed min-h-0 flex-1 resize-none overflow-y-auto border-border/50 focus-visible:border-border"
          maxLength={MAX_USER_PROFILE_LENGTH}
        />
        <div className="flex h-5 shrink-0 items-center justify-between">
          {value.length >= MAX_USER_PROFILE_LENGTH && (
            <p className="text-xs text-destructive">
              {value.length}/{MAX_USER_PROFILE_LENGTH} characters
            </p>
          )}
          <div className="ml-auto flex items-center gap-2">
            {isPending && (
              <>
                <LoadingSpinner size="sm" />
                <span className="text-xs text-muted-foreground">Saving...</span>
              </>
            )}
            {saveError && (
              <span className="text-xs text-destructive">Failed to save</span>
            )}
            {isSaved && (
              <>
                <Check className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Saved</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
