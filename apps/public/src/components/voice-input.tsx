import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface VoiceInputProps {
  onResult: (text: string) => void;
  className?: string;
  lang?: string;
}

type SpeechState = "idle" | "listening" | "processing" | "unsupported";

export function VoiceInput({ onResult, className, lang }: VoiceInputProps) {
    const { t } = useI18n();
  const [state, setState] = useState<SpeechState>("idle");
  const recognitionRef = useRef<any>(null);
  
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;
  
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setState("listening");
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          setState("processing");
          const transcript = event.results[0][0].transcript;
          onResultRef.current(transcript);
          setState("idle");
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setState("idle");
        };

        recognition.onend = () => {
          if (stateRef.current === "listening") {
            setState("idle");
          }
        };

        recognitionRef.current = recognition;
      } else {
        setState("unsupported");
      }
    }
  }, []);

  const toggleListen = () => {
    if (state === "unsupported") return;

    if (state === "listening") {
      recognitionRef.current?.stop();
      setState("idle");
    } else {
      if (lang && recognitionRef.current) {
        recognitionRef.current.lang = lang;
      }
      recognitionRef.current?.start();
    }
  };

  if (state === "unsupported") {
    return (
      <div className={cn("flex items-center gap-2 text-xs text-muted-foreground", className)}>
        <AlertCircle className="h-3.5 w-3.5 text-warning" />
        {t('ui.voice_input_not_supported_in_t')}</div>
    );
  }

  return (
    <GlassButton
      type="button"
      size="sm"
      variant={state === "listening" ? "danger" : "glass"}
      onClick={toggleListen}
      className={cn("transition-all duration-300", className)}
    >
      {state === "listening" ? (
        <>
          <MicOff className="h-3.5 w-3.5 animate-pulse" />
          {t('ui.listening')}</>
      ) : state === "processing" ? (
        <>
          <Mic className="h-3.5 w-3.5 opacity-50" />
          {t('ui.processing')}</>
      ) : (
        <>
          <Mic className="h-3.5 w-3.5" />
          {t('ui.describe_by_voice')}</>
      )}
    </GlassButton>
  );
}
