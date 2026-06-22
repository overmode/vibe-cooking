// Assistant messages
export const MAX_USER_MESSAGE_LENGTH = 1000;
export const MIN_USER_MESSAGE_LENGTH = 1;
export const MAX_MESSAGES_PER_DAY = 100;
export const MESSAGE_COOLDOWN_DURATION = 500;
export const MAX_CONTEXT_TOKENS = 100_000;
export const MAX_ASSISTANT_STEPS = 10;

// Web search (assistant tool). Per-call cost guard for free users; the model
// fires searches mid-stream, so this caps availability per day, not per call.
export const MAX_SEARCHES_PER_DAY = 30;

// Voice input
// Daily quota measured in seconds of audio (fairer than a message count): 10 min.
export const MAX_VOICE_SECONDS_PER_DAY = 600;
export const MAX_VOICE_RECORDING_DURATION_MS = 60_000;
// Pinned so the upload size is a controlled invariant; 64 kbps is ample for
// speech recognition.
export const VOICE_AUDIO_BITRATE = 64_000;
// Anti-abuse guard, not the cost lever (that's the 60s + per-day caps). A
// full-length clip is VOICE_AUDIO_BITRATE * 60s ≈ 0.48 MB; the 2 MB cap leaves
// ~4x headroom for container overhead or a browser that ignores the bitrate
// hint, so a legitimate 60s recording is never rejected.
export const MAX_VOICE_UPLOAD_BYTES = 2 * 1024 * 1024;

// Recipes
export const MAX_NUM_RECIPES_PER_USER = 100;

// User profile
export const MAX_USER_PROFILE_LENGTH = 10_000;
