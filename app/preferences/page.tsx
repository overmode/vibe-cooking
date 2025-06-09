"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  useUserDietaryPreferences,
  useUpdateUserDietaryPreferences,
} from "@/lib/api/hooks/preferences";
import { Check } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { debounce } from "lodash";

export default function PreferencesPage() {
  const [localPreferences, setLocalPreferences] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasUserMadeChanges, setHasUserMadeChanges] = useState(false);
  const hasInitialized = useRef(false);

  // Load continuously but only initialize text box once
  const {
    data: serverPreferences,
    isLoading,
    isError,
  } = useUserDietaryPreferences({});

  // Initialize text box only once when data first loads
  useEffect(() => {
    if (serverPreferences && !hasInitialized.current) {
      setLocalPreferences(serverPreferences.preferences);
      hasInitialized.current = true;
    }
  }, [serverPreferences]);

  const updateMutation = useUpdateUserDietaryPreferences({
    options: {
      onMutate: () => {
        if (!isSaving) {
          setIsSaving(true);
        }
      },
      onSettled: () => {
        setIsSaving(false);
      },
    },
  });

  // Derived state - saved when not currently saving and local matches server
  const isSaved =
    !isSaving &&
    hasUserMadeChanges &&
    localPreferences === (serverPreferences?.preferences || "");

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((value: string) => {
      updateMutation.mutate(value);
    }, 1000),
    [updateMutation.mutate]
  );

  const handlePreferencesChange = (value: string) => {
    setLocalPreferences(value);
    setHasUserMadeChanges(true);
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
    <div className="h-full overflow-auto">
      <div className="container mx-auto px-4 py-6 max-w-2xl min-h-full">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Personal Profile</h1>
          <p className="text-muted-foreground text-sm">
            Tell us about yourself to get personalized cooking recommendations.
          </p>
        </div>

        <div className="space-y-4 pb-6">
          <div className="space-y-3">
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
              className="min-h-40 max-h-96 resize-none border-border/50 focus-visible:border-border"
              maxLength={10000}
            />
            <div className="flex justify-between items-center">
              {localPreferences.length > 10000 && (
                <p className="text-xs text-destructive">
                  {localPreferences.length}/10,000 characters (limit exceeded)
                </p>
              )}
              <div className="flex items-center gap-2 ml-auto">
                {isSaving && (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="text-xs text-muted-foreground">
                      Saving...
                    </span>
                  </>
                )}
                {updateMutation.isError && (
                  <span className="text-xs text-destructive">
                    Failed to save
                  </span>
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
      </div>
    </div>
  );
}
