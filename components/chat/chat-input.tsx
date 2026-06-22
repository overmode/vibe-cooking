import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mic, SendHorizontal, Square } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  MAX_MESSAGES_PER_DAY,
  MAX_USER_MESSAGE_LENGTH,
  MESSAGE_COOLDOWN_DURATION,
  MIN_USER_MESSAGE_LENGTH,
} from "@/lib/constants/app_validation";
import { useRateLimit } from "@/lib/api/hooks/rate-limit";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useVoiceDictation } from "@/components/chat/use-voice-dictation";

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  onSend: (text: string) => void;
  maxLength?: number;
}

export function ChatInput({
  input,
  setInput,
  onSend,
  maxLength = MAX_USER_MESSAGE_LENGTH,
}: ChatInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const t = useTranslations("chat");
  const { messageLimitReached, voiceLimitReached } = useRateLimit();

  // Ref so the async transcription callback appends to the freshest input value
  // instead of the one captured when recording started.
  const inputRef = useRef(input);
  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => {
      setCooldown(false);
    }, MESSAGE_COOLDOWN_DURATION);
    return () => {
      clearTimeout(timer);
    };
  }, [cooldown]);

  // Defaults to the live input (via ref, so it stays stable across keystrokes);
  // the voice path passes the transcript explicitly.
  const submit = useCallback(
    (text: string = inputRef.current) => {
      if (messageLimitReached) return;

      if (text.length > maxLength) {
        toast.error(t("messageTooLong", { max: maxLength }));
        return;
      }

      if (text.length < MIN_USER_MESSAGE_LENGTH) {
        toast.error(t("messageTooShort", { min: MIN_USER_MESSAGE_LENGTH }));
        return;
      }

      if (cooldown || isSubmitting || text.trim().length === 0) {
        return;
      }

      setIsSubmitting(true);

      try {
        onSend(text);
        setInput("");
        setCooldown(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      messageLimitReached,
      maxLength,
      cooldown,
      isSubmitting,
      t,
      onSend,
      setInput,
    ]
  );

  // Mic is only offered from an empty box, so the transcript is the whole
  // message: persist it (an over-long clip can be trimmed instead of lost) and
  // send immediately. A valid send clears the box; too-long leaves it to edit.
  const sendTranscript = useCallback(
    (text: string) => {
      setInput(text);
      submit(text);
    },
    [setInput, submit]
  );

  const { isRecording, isTranscribing, elapsedMs, voiceLimitMessage, toggle } =
    useVoiceDictation({
      onTranscript: sendTranscript,
      messageLimitReached,
      voiceLimitReached,
    });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  // The trailing button is a dictaphone until there's text to send: empty + idle
  // shows the mic, recording shows stop, transcription shows a spinner, and any
  // text (typed or transcribed) turns it into the send button.
  const mode = isTranscribing
    ? "transcribing"
    : isRecording
      ? "recording"
      : input.trim().length > 0
        ? "send"
        : "mic";

  const buttonLabel = {
    transcribing: t("voiceTranscribing"),
    recording: t("voiceStop"),
    send: t("send"),
    mic: t("voiceStart"),
  }[mode];

  const buttonDisabled =
    mode === "transcribing" ||
    (mode === "send" && (isSubmitting || cooldown || messageLimitReached)) ||
    (mode === "mic" && messageLimitReached);

  // The voice cap mutes the mic without natively disabling it, so the button
  // still receives hover/focus/tap and can explain itself via tooltip + toast.
  const voiceCapOnly =
    mode === "mic" && voiceLimitReached && !messageLimitReached;

  // Message cap blocks everything, so it warrants a persistent banner; the
  // voice cap is explained contextually on the mic itself instead.
  const limitMessage = messageLimitReached
    ? t("rateLimit", { max: MAX_MESSAGES_PER_DAY })
    : null;

  const actionButton = (
    <Button
      type={mode === "send" ? "submit" : "button"}
      size="icon"
      onClick={mode === "send" ? undefined : toggle}
      disabled={buttonDisabled}
      aria-disabled={buttonDisabled || voiceCapOnly}
      aria-label={voiceCapOnly ? voiceLimitMessage : buttonLabel}
      title={voiceCapOnly ? undefined : buttonLabel}
      className={`h-10 w-10 sm:h-14 sm:w-14 shrink-0 transition-all ${
        voiceCapOnly ? "opacity-50" : ""
      }`}
    >
      {mode === "transcribing" ? (
        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
      ) : mode === "recording" ? (
        <Square className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
      ) : mode === "mic" ? (
        <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
      ) : (
        <SendHorizontal
          className={`h-4 w-4 sm:h-5 sm:w-5 ${
            isSubmitting || cooldown ? "opacity-50" : ""
          }`}
        />
      )}
    </Button>
  );

  return (
    <form onSubmit={handleFormSubmit} className="px-4 pb-4">
      {limitMessage && (
        <p className="mb-2 text-xs text-muted-foreground">{limitMessage}</p>
      )}
      <div className="flex gap-2 sm:gap-3 items-end">
        {mode === "recording" || mode === "transcribing" ? (
          <div className="flex h-10 sm:h-14 w-full items-center gap-3 rounded-md border border-input bg-background px-4 text-sm">
            {mode === "recording" ? (
              <>
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                </span>
                <span className="font-medium">{t("voiceRecording")}</span>
                <span className="ml-auto tabular-nums text-muted-foreground">
                  {formatElapsed(elapsedMs)}
                </span>
              </>
            ) : (
              <>
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">
                  {t("voiceTranscribing")}
                </span>
              </>
            )}
          </div>
        ) : (
          <Textarea
            placeholder={t("askAnything")}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            disabled={messageLimitReached}
            className="min-h-10 sm:min-h-14 w-full max-h-48 resize-none"
            rows={1}
            maxLength={maxLength}
          />
        )}
        {voiceCapOnly ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{actionButton}</TooltipTrigger>
              <TooltipContent>{voiceLimitMessage}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          actionButton
        )}
      </div>
    </form>
  );
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
