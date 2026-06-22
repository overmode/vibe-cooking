import { openai } from "@ai-sdk/openai";
import { experimental_transcribe as transcribe } from "ai";
import { type Locale } from "@/i18n/locale";

// Records come from MediaRecorder, whose container varies by platform
// (webm/opus on Chrome, mp4/aac on iOS). transcribe() sniffs the container
// from the audio bytes, so no mediaType plumbing is needed. The locale
// doubles as the ISO-639-1 language hint, improving accuracy and latency.
export default async function transcribeAudio({
  audio,
  locale,
}: {
  audio: Uint8Array;
  locale: Locale;
}): Promise<string> {
  const { text } = await transcribe({
    model: openai.transcription("gpt-4o-mini-transcribe"),
    audio,
    providerOptions: { openai: { language: locale } },
  });

  return text.trim();
}
