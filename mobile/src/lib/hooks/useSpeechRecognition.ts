import { useState, useRef, useCallback, useEffect } from "react";
import { Platform } from "react-native";

export interface SpeechRecognitionHook {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  start: (langCode?: string) => void;
  stop: () => void;
  reset: () => void;
}

interface WebSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onerror: ((e: any) => void) | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onresult: ((e: any) => void) | null;
}

// Augment Window to include the non-standard webkitSpeechRecognition
declare global {
  interface Window {
    // These are non-standard / vendor-prefixed; not in the base DOM lib
    webkitSpeechRecognition?: new () => WebSpeechRecognition;
    // Standard SpeechRecognition exists in lib.dom but typed as a class — cast via any
  }
}

function getSpeechAPI(): (new () => WebSpeechRecognition) | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<WebSpeechRecognition | null>(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    setIsSupported(getSpeechAPI() !== null);
  }, []);

  const start = useCallback((langCode = "en-US") => {
    if (Platform.OS !== "web") return;
    const API = getSpeechAPI();
    if (!API) return;

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
    }

    const recognition = new API();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = langCode;

    recognition.onstart = () => { setIsListening(true); setError(null); };
    recognition.onend   = () => { setIsListening(false); setInterimTranscript(""); };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (e: any) => { setError(e.error as string); setIsListening(false); };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      let finalChunk = "";
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) {
          finalChunk += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      if (finalChunk) {
        setTranscript((prev) => prev + (prev ? " " : "") + finalChunk.trim());
      }
      setInterimTranscript(interim);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const reset = useCallback(() => {
    try { recognitionRef.current?.abort(); } catch { /* ignore */ }
    setIsListening(false);
    setTranscript("");
    setInterimTranscript("");
    setError(null);
  }, []);

  return { isSupported, isListening, transcript, interimTranscript, error, start, stop, reset };
}
