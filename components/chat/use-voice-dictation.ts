import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { transcribeAudio } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import { MAX_VOICE_SECONDS_PER_DAY } from "@/lib/constants/app_validation";
import {
  useVoiceRecorder,
  type RecorderErrorKind,
} from "@/components/chat/use-voice-recorder";

// Owns the whole dictation concern: recording lifecycle, transcription, the
// live timer, and all voice-specific toasts. The host stays a text-input that
// merely receives transcribed text via onTranscript.
export function useVoiceDictation({
  onTranscript,
  messageLimitReached,
  voiceLimitReached,
}: {
  onTranscript: (text: string) => void;
  messageLimitReached: boolean;
  voiceLimitReached: boolean;
}) {
  const t = useTranslations("chat");
  const queryClient = useQueryClient();
  const [isTranscribing, setIsTranscribing] = useState(false);

  const voiceLimitMessage = t("voiceRateLimit", {
    max: MAX_VOICE_SECONDS_PER_DAY / 60,
  });

  const handleTranscript = useCallback(
    (audio: Blob, durationMs: number) => {
      setIsTranscribing(true);
      transcribeAudio(audio, durationMs)
        .then((text) => {
          void queryClient.invalidateQueries({
            queryKey: queryKeys.rateLimit.all,
          });
          if (text) onTranscript(text);
        })
        .catch((error: unknown) => {
          const limited =
            error instanceof Error && error.message === "Rate Limit Exceeded";
          toast.error(limited ? voiceLimitMessage : t("voiceError"));
        })
        .finally(() => {
          setIsTranscribing(false);
        });
    },
    [onTranscript, t, queryClient, voiceLimitMessage]
  );

  const handleRecorderError = useCallback(
    (kind: RecorderErrorKind) => {
      toast.error(
        kind === "unsupported"
          ? t("voiceUnsupported")
          : t("voicePermissionDenied")
      );
    },
    [t]
  );

  const { isRecording, start, stop } = useVoiceRecorder({
    onComplete: handleTranscript,
    onError: handleRecorderError,
  });

  const [elapsedMs, setElapsedMs] = useState(0);
  useEffect(() => {
    if (!isRecording) return;
    const startedAt = Date.now();
    const id = setInterval(() => {
      setElapsedMs(Date.now() - startedAt);
    }, 250);
    return () => {
      clearInterval(id);
      setElapsedMs(0);
    };
  }, [isRecording]);

  const toggle = useCallback(() => {
    if (isRecording) {
      stop();
      return;
    }
    if (messageLimitReached) return;
    // Surfaced as a toast (not a no-op) so a tap on a touch device, where the
    // hover tooltip can't appear, still explains why the mic is muted.
    if (voiceLimitReached) {
      toast.error(voiceLimitMessage);
      return;
    }
    void start();
  }, [
    isRecording,
    stop,
    messageLimitReached,
    voiceLimitReached,
    voiceLimitMessage,
    start,
  ]);

  return { isRecording, isTranscribing, elapsedMs, voiceLimitMessage, toggle };
}
