import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Share,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { BookOpen, Share2, Send, Trash2, Mic, MicOff } from "lucide-react-native";
import { useDojoStore, getEntriesForDate, TEXT_SCALE } from "@/lib/state/dojo-store";
import { useTranslation } from "@/lib/i18n";
import { LANGUAGE_SPEECH_CODE } from "@/lib/i18n/translations";
import { useSpeechRecognition } from "@/lib/hooks/useSpeechRecognition";

const COLORS = {
  bg: "#0A0A0F",
  card: "#1C1C2E",
  cardBorder: "#2A2A40",
  textPrimary: "#E8E8F0",
  textMuted: "#8888A0",
  accent: "#E8C547",
  inputBg: "#1C1C2E",
} as const;

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = String(minutes).padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

function formatDateLabel(dateKey: string, today: string, yesterday: string): string {
  const nowDate = new Date();
  const todayKey = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, "0")}-${String(nowDate.getDate()).padStart(2, "0")}`;
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  const yesterdayKey = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, "0")}-${String(yest.getDate()).padStart(2, "0")}`;
  if (dateKey === todayKey) return today;
  if (dateKey === yesterdayKey) return yesterday;
  const [year, month, day] = dateKey.split("-");
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

interface DateGroup {
  date: string;
  label: string;
  entries: Array<{ id: string; text: string; timestamp: number; date: string }>;
}

export default function JournalScreen() {
  const t = useTranslation();
  const language = useDojoStore((s) => s.language);
  const textSize  = useDojoStore((s) => s.textSize);
  const scale     = TEXT_SCALE[textSize];

  const [inputText, setInputText]     = useState<string>("");
  const [promptIndex, setPromptIndex] = useState<number>(0);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Tracks the speech-contributed portion so new transcript appends to manually typed text
  const speechBaseRef = useRef<string>("");

  // Ref for TextInput to allow programmatic focus on tab return
  const inputRef = useRef<TextInput>(null);

  const journalEntries  = useDojoStore((s) => s.journalEntries);
  const addJournalEntry = useDojoStore((s) => s.addJournalEntry);
  const deleteJournalEntry = useDojoStore((s) => s.deleteJournalEntry);

  // Speech recognition
  const speech = useSpeechRecognition();

  // Re-focus input and reset stale speech state when the tab gains focus.
  // Also stop speech recognition on tab leave to avoid stuck state.
  useFocusEffect(
    useCallback(() => {
      // Reset stale speech state when entering screen
      speechBaseRef.current = "";
      speech.reset();

      // Re-focus input with small delay to avoid animation conflict
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);

      return () => {
        // Stop speech when leaving screen
        clearTimeout(timer);
        if (speech.isListening) {
          speech.stop();
        }
        speech.reset();
      };
    }, [speech])
  );

  // Merge live transcript into input, appending to any text that was already typed
  useEffect(() => {
    const speechPart = [speech.transcript, speech.interimTranscript].filter(Boolean).join(" ");
    if (speechPart) {
      const base = speechBaseRef.current;
      const newText = base ? `${base} ${speechPart}` : speechPart;
      setInputText(newText);
    }
  }, [speech.transcript, speech.interimTranscript]);

  // Auto-rotate prompts
  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % t.journal.prompts.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [t.journal.prompts.length]);

  const cyclePrompt = useCallback(() => {
    setPromptIndex((prev) => (prev + 1) % t.journal.prompts.length);
  }, [t.journal.prompts.length]);

  const handleSubmit = useCallback(() => {
    const trimmed = inputText.trim();
    if (trimmed.length === 0) return;
    if (speech.isListening) speech.stop();
    speech.reset();
    speechBaseRef.current = "";
    addJournalEntry(trimmed);
    setInputText("");
    Keyboard.dismiss();
  }, [inputText, addJournalEntry, speech]);

  const handleMicToggle = useCallback(() => {
    if (speech.isListening) {
      speech.stop();
      // Commit whatever speech produced into the base so typing continues from here
      speechBaseRef.current = inputText;
    } else {
      // Snapshot existing typed text as the base; speech will append to it
      speechBaseRef.current = inputText.trimEnd();
      speech.reset();
      speech.start(LANGUAGE_SPEECH_CODE[language]);
    }
  }, [speech, language, inputText]);

  const handleDelete = useCallback((id: string) => {
    deleteJournalEntry(id);
    setDeleteTargetId(null);
  }, [deleteJournalEntry]);

  const handleExport = useCallback(async () => {
    if (journalEntries.length === 0) return;
    const lines = journalEntries
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((entry) => {
        const dateLabel = formatDateLabel(entry.date, t.journal.today, t.journal.yesterday);
        return `[${dateLabel} ${formatTime(entry.timestamp)}] ${entry.text}`;
      });
    const content = `Dojo Journal Export\n${"=".repeat(30)}\n\n${lines.join("\n\n")}`;
    try { await Share.share({ message: content }); } catch { /* user cancelled */ }
  }, [journalEntries, t.journal.today, t.journal.yesterday]);

  const groupedEntries = useMemo<DateGroup[]>(() => {
    const dateSet = new Set<string>();
    journalEntries.forEach((e) => dateSet.add(e.date));
    const dates = Array.from(dateSet).sort((a, b) => b.localeCompare(a));
    return dates.map((date) => ({
      date,
      label: formatDateLabel(date, t.journal.today, t.journal.yesterday),
      entries: getEntriesForDate(journalEntries, date).sort((a, b) => b.timestamp - a.timestamp),
    }));
  }, [journalEntries, t.journal.today, t.journal.yesterday]);

  const renderEntry = useCallback(
    (item: DateGroup["entries"][number]) => {
      const isDeleteTarget = deleteTargetId === item.id;
      return (
        <Pressable
          key={item.id}
          testID={`journal-entry-${item.id}`}
          onLongPress={() => setDeleteTargetId(item.id)}
          style={{ backgroundColor: COLORS.card, borderColor: COLORS.cardBorder, borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 10 }}
        >
          <Text style={{ color: COLORS.textPrimary, fontSize: 15 * scale, lineHeight: 22 * scale }}>
            {item.text}
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <Text style={{ color: COLORS.textMuted, fontSize: 12 * scale }}>
              {formatTime(item.timestamp)}
            </Text>
            {isDeleteTarget ? (
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Pressable
                  testID={`confirm-delete-${item.id}`}
                  onPress={() => handleDelete(item.id)}
                  style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#3D1515", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}
                >
                  <Trash2 size={14} color="#FF6B6B" />
                  <Text style={{ color: "#FF6B6B", fontSize: 12 * scale }}>{t.journal.del}</Text>
                </Pressable>
                <Pressable
                  testID={`cancel-delete-${item.id}`}
                  onPress={() => setDeleteTargetId(null)}
                  style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}
                >
                  <Text style={{ color: COLORS.textMuted, fontSize: 12 * scale }}>{t.journal.cancel}</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </Pressable>
      );
    },
    [deleteTargetId, handleDelete, scale, t.journal]
  );

  const renderDateGroup = useCallback(
    ({ item }: { item: DateGroup }) => (
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: COLORS.textMuted, fontSize: 13 * scale, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, paddingHorizontal: 2 }}>
          {item.label}
        </Text>
        {item.entries.map(renderEntry)}
      </View>
    ),
    [renderEntry, scale]
  );

  const listEmptyComponent = useMemo(() => (
    <View testID="journal-empty-state" style={{ alignItems: "center", paddingTop: 60 }}>
      <BookOpen size={48} color={COLORS.textMuted} />
      <Text style={{ color: COLORS.textMuted, fontSize: 15 * scale, textAlign: "center", marginTop: 16, lineHeight: 22 * scale, paddingHorizontal: 32 }}>
        {t.journal.emptyTitle}{"\n"}{t.journal.emptyBody}
      </Text>
    </View>
  ), [scale, t.journal.emptyTitle, t.journal.emptyBody]);

  const micAvailable = speech.isSupported;
  const isActive = inputText.trim().length > 0;

  return (
    <SafeAreaView testID="journal-screen" style={{ flex: 1, backgroundColor: COLORS.bg }} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={0}>
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <BookOpen size={24} color={COLORS.accent} />
            <Text style={{ color: COLORS.textPrimary, fontSize: 28 * scale, fontWeight: "700" }}>
              {t.journal.header}
            </Text>
          </View>
          <Pressable
            testID="export-button"
            onPress={handleExport}
            style={{ padding: 10, borderRadius: 12, backgroundColor: COLORS.card, opacity: journalEntries.length > 0 ? 1 : 0.4 }}
            disabled={journalEntries.length === 0}
          >
            <Share2 size={20} color={COLORS.textPrimary} />
          </Pressable>
        </View>

        {/* Input area */}
        <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
          {/* Listening indicator */}
          {speech.isListening ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6, paddingHorizontal: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#FF6B6B" }} />
              <Text style={{ color: "#FF6B6B", fontSize: 12 * scale, fontWeight: "600" }}>
                {t.journal.mic.listening}
              </Text>
            </View>
          ) : null}

          {/* Not-supported warning */}
          {!speech.isSupported && Platform.OS === "web" ? (
            <Text style={{ color: COLORS.textMuted, fontSize: 11 * scale, marginBottom: 6, paddingHorizontal: 4 }}>
              {t.journal.mic.notSupported}
            </Text>
          ) : null}

          <View style={{
            flexDirection: "row", alignItems: "center",
            backgroundColor: COLORS.inputBg, borderColor: speech.isListening ? "#FF6B6B" : COLORS.cardBorder,
            borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 4,
          }}>
            <TextInput
              testID="journal-input"
              ref={inputRef}
              value={inputText}
              onChangeText={setInputText}
              placeholder={speech.isListening ? t.journal.mic.listening : t.journal.placeholder}
              placeholderTextColor={COLORS.textMuted}
              multiline
              autoFocus
              maxLength={500}
              style={{ flex: 1, color: COLORS.textPrimary, fontSize: 15 * scale, paddingVertical: 12, maxHeight: 100 }}
            />

            {/* Mic button (web only or always render but disable on native) */}
            {micAvailable ? (
              <Pressable
                testID="mic-button"
                onPress={handleMicToggle}
                style={{
                  borderRadius: 12, padding: 14, marginLeft: 6, minWidth: 48, alignItems: "center", justifyContent: "center",
                  backgroundColor: speech.isListening ? "#FF6B6B" : COLORS.card,
                  borderWidth: speech.isListening ? 0 : 1,
                  borderColor: COLORS.cardBorder,
                }}
                accessibilityLabel={speech.isListening ? t.journal.mic.stop : t.journal.mic.start}
              >
                {speech.isListening
                  ? <MicOff size={22} color="#FFFFFF" />
                  : <Mic size={22} color={COLORS.accent} />}
              </Pressable>
            ) : null}

            {/* Send button */}
            <Pressable
              testID="log-button"
              onPress={handleSubmit}
              style={{
                backgroundColor: isActive ? COLORS.accent : COLORS.cardBorder,
                borderRadius: 10, padding: 10, marginLeft: 6,
              }}
              disabled={!isActive}
            >
              <Send size={18} color={isActive ? "#0A0A0F" : COLORS.textMuted} />
            </Pressable>
          </View>
        </View>

        {/* ERN Prompt */}
        <Pressable
          testID="ern-prompt-card"
          onPress={cyclePrompt}
          style={{ marginHorizontal: 20, marginBottom: 16, backgroundColor: COLORS.card, borderColor: COLORS.cardBorder, borderWidth: 1, borderRadius: 14, padding: 16 }}
        >
          <Text style={{ color: COLORS.accent, fontSize: 12 * scale, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
            {t.journal.ernHeader}
          </Text>
          <Text style={{ color: COLORS.textPrimary, fontSize: 14 * scale, lineHeight: 20 * scale, fontStyle: "italic" }}>
            {t.journal.prompts[promptIndex % t.journal.prompts.length]}
          </Text>
          <Text style={{ color: COLORS.textMuted, fontSize: 11 * scale, marginTop: 8 }}>
            {t.journal.tapPrompt}
          </Text>
        </Pressable>

        {/* Entries */}
        <FlatList
          testID="journal-entries-list"
          data={groupedEntries}
          keyExtractor={(item) => item.date}
          renderItem={renderDateGroup}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          ListEmptyComponent={listEmptyComponent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
