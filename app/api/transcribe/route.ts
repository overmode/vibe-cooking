import { NextResponse } from "next/server";
import { getLocale } from "next-intl/server";
import { requireUserId } from "@/lib/auth/require-user-id";
import { getLimits, incrementVoiceSeconds } from "@/lib/rate-limiter";
import transcribeAudio from "@/lib/ai/transcribe-audio";
import { isLocale } from "@/i18n/locale";
import {
  MAX_VOICE_RECORDING_DURATION_MS,
  MAX_VOICE_UPLOAD_BYTES,
} from "@/lib/constants/app_validation";

export async function POST(req: Request) {
  const { userId, response } = await requireUserId();
  if (response) return response;

  const audio = new Uint8Array(await req.arrayBuffer());
  if (audio.byteLength === 0) {
    return NextResponse.json({ error: "Empty audio" }, { status: 400 });
  }
  if (audio.byteLength > MAX_VOICE_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Audio too large" }, { status: 413 });
  }

  const { voiceLimitReached } = await getLimits(userId);
  if (voiceLimitReached) {
    return NextResponse.json({ error: "Rate Limit Exceeded" }, { status: 429 });
  }

  const locale = await getLocale();
  try {
    const text = await transcribeAudio({
      audio,
      locale: isLocale(locale) ? locale : "en",
    });
    // Count only successful transcriptions, so our own failures don't burn a slot.
    await incrementVoiceSeconds(userId, clampDurationSeconds(req));
    return NextResponse.json({ text });
  } catch (error) {
    console.error("[transcribe] failed to transcribe audio", error);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 502 }
    );
  }
}

// Duration is client-reported, so clamp it to the recording cap before billing.
function clampDurationSeconds(req: Request): number {
  const ms = Number(req.headers.get("x-voice-duration-ms"));
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  return Math.ceil(Math.min(ms, MAX_VOICE_RECORDING_DURATION_MS) / 1000);
}
