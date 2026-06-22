import { useCallback, useEffect, useRef, useState } from "react";
import {
  MAX_VOICE_RECORDING_DURATION_MS,
  VOICE_AUDIO_BITRATE,
} from "@/lib/constants/app_validation";

export type RecorderErrorKind = "permission" | "unsupported" | "generic";

// Headless MediaRecorder lifecycle. The container is left to the platform
// (webm/opus on Chrome, mp4/aac on iOS) and read back from recorder.mimeType;
// the server sniffs it, so nothing here hardcodes a format. Recording auto-stops
// at the configured cap to bound upload size and transcription cost.
export function useVoiceRecorder({
  onComplete,
  onError,
}: {
  onComplete: (audio: Blob, durationMs: number) => void;
  onError: (kind: RecorderErrorKind) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAtRef = useRef(0);

  const stop = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }, []);

  const start = useCallback(async () => {
    // lib.dom types these as always present, but insecure contexts and older
    // mobile browsers omit them — hence the runtime guard the types deny.
    const mediaDevices = navigator.mediaDevices as MediaDevices | undefined;
    if (
      typeof MediaRecorder === "undefined" ||
      typeof mediaDevices?.getUserMedia !== "function"
    ) {
      onError("unsupported");
      return;
    }

    let stream: MediaStream;
    try {
      stream = await mediaDevices.getUserMedia({ audio: true });
    } catch {
      // Covers denied permission and absent hardware alike — both block recording.
      onError("permission");
      return;
    }

    const recorder = new MediaRecorder(stream, {
      audioBitsPerSecond: VOICE_AUDIO_BITRATE,
    });
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setIsRecording(false);
      const audio = new Blob(chunksRef.current, { type: recorder.mimeType });
      if (audio.size > 0) onComplete(audio, Date.now() - startedAtRef.current);
    };

    recorder.start();
    recorderRef.current = recorder;
    setIsRecording(true);
    startedAtRef.current = Date.now();
    timeoutRef.current = setTimeout(stop, MAX_VOICE_RECORDING_DURATION_MS);
  }, [onComplete, onError, stop]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      recorderRef.current?.stream.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);

  return { isRecording, start, stop };
}
