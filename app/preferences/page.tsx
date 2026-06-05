"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  useUserDietaryPreferences,
  useUpdateUserDietaryPreferences,
} from "@/lib/api/hooks/preferences";
import { Check } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { debounce } from "lodash";
import { MAX_PREFERENCES_LENGTH } from "@/lib/constants/app_validation";

const SAVE_DEBOUNCE_MS = 1000;

export default function PreferencesPage() {
  const [localPreferences, setLocalPreferences] = useState("");
  const [hasEdited, setHasEdited] = useState(false);
  const hasInitialized = useRef(false);

  const {
    data: serverPreferences,
    isLoading,
    isError,
  } = useUserDietaryPreferences({});

  useEffect(() => {
    if (serverPreferences && !hasInitialized.current) {
      setLocalPreferences(serverPreferences.preferences);
      hasInitialized.current = true;
    }
  }, [serverPreferences]);

  const {
    mutate,
    isPending,
    isError: saveError,
  } = useUpdateUserDietaryPreferences({});

  const debouncedSave = useMemo(
    () => debounce((value: string) => mutate(value), SAVE_DEBOUNCE_MS),
    [mutate]
  );

  useEffect(() => () => debouncedSave.cancel(), [debouncedSave]);

  const serverValue = serverPreferences?.preferences ?? "";
  const isSaved = hasEdited && !isPending && localPreferences === serverValue;

  const handlePreferencesChange = (value: string) => {
    setLocalPreferences(value);
    setHasEdited(true);
    debouncedSave(value);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading preferences...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-destructive">Failed to load preferences</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mx-auto w-full max-w-2xl shrink-0 px-4 pt-6">
        <h1 className="mb-2 text-2xl font-semibold">Personal Profile</h1>
        <p className="text-sm text-muted-foreground">
          Tell us about yourself to get personalized cooking recommendations.
        </p>
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col gap-3 px-4 pb-6 pt-4">
        <Textarea
          id="preferences"
          placeholder={`• I'm vegetarian and allergic to nuts
• I love spicy food and prefer quick 30-minute meals
• I run 20 miles per week and sleep 7 hours nightly
• I work from home with busy weekdays
• I have intermediate cooking skills
• ...`}
          value={localPreferences}
          onChange={(e) => handlePreferencesChange(e.target.value)}
          className="field-sizing-fixed min-h-0 flex-1 resize-none overflow-y-auto border-border/50 focus-visible:border-border"
          maxLength={MAX_PREFERENCES_LENGTH}
        />
        <div className="flex shrink-0 items-center justify-between">
          {localPreferences.length >= MAX_PREFERENCES_LENGTH && (
            <p className="text-xs text-destructive">
              {localPreferences.length}/{MAX_PREFERENCES_LENGTH} characters
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
