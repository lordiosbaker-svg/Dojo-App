import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Share,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookOpen, Share2, Send, Trash2 } from "lucide-react-native";
import { useDojoStore, getEntriesForDate } from "@/lib/state/dojo-store";

// --- Constants ---

const ERN_PROMPTS: string[] = [
  "What arose? Name it. Accept it. Breathe longer on exhale.",
  "What error signal did you notice? How did you respond?",
  "What triggered your reaction? Can you observe it without judgment?",
  "Where did you feel the signal in your body?",
];

const COLORS = {
  bg: "#0A0A0F",
  card: "#1C1C2E",
  cardBorder: "#2A2A40",
  textPrimary: "#E8E8F0",
  textMuted: "#8888A0",
  accent: "#E8C547",
  inputBg: "#1C1C2E",
} as const;

// --- Helpers ---

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = String(minutes).padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

function formatDateLabel(dateKey: string): string {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

  if (dateKey === todayKey) return "Today";
  if (dateKey === yesterdayKey) return "Yesterday";

  const [year, month, day] = dateKey.split("-");
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// --- Types ---

interface DateGroup {
  date: string;
  label: string;
  entries: Array<{
    id: string;
    text: string;
    timestamp: number;
    date: string;
  }>;
}

// --- Component ---

export default function JournalScreen() {
  const [inputText, setInputText] = useState<string>("");
  const [promptIndex, setPromptIndex] = useState<number>(0);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const journalEntries = useDojoStore((s) => s.journalEntries);
  const addJournalEntry = useDojoStore((s) => s.addJournalEntry);
  const deleteJournalEntry = useDojoStore((s) => s.deleteJournalEntry);

  // Auto-rotate ERN prompts every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % ERN_PROMPTS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const cyclePrompt = useCallback(() => {
    setPromptIndex((prev) => (prev + 1) % ERN_PROMPTS.length);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = inputText.trim();
    if (trimmed.length === 0) return;
    addJournalEntry(trimmed);
    setInputText("");
    Keyboard.dismiss();
  }, [inputText, addJournalEntry]);

  const handleDelete = useCallback(
    (id: string) => {
      deleteJournalEntry(id);
      setDeleteTargetId(null);
    },
    [deleteJournalEntry]
  );

  const handleExport = useCallback(async () => {
    if (journalEntries.length === 0) return;

    const lines = journalEntries
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((entry) => {
        const dateLabel = formatDateLabel(entry.date);
        const time = formatTime(entry.timestamp);
        return `[${dateLabel} ${time}] ${entry.text}`;
      });

    const content = `Dojo Journal Export\n${"=".repeat(30)}\n\n${lines.join("\n\n")}`;

    try {
      await Share.share({ message: content });
    } catch {
      // User cancelled or share failed silently
    }
  }, [journalEntries]);

  // Group entries by date, sorted newest first
  const groupedEntries = useMemo<DateGroup[]>(() => {
    const dateSet = new Set<string>();
    journalEntries.forEach((e) => dateSet.add(e.date));
    const dates = Array.from(dateSet).sort((a, b) => b.localeCompare(a));

    return dates.map((date) => ({
      date,
      label: formatDateLabel(date),
      entries: getEntriesForDate(journalEntries, date).sort(
        (a, b) => b.timestamp - a.timestamp
      ),
    }));
  }, [journalEntries]);

  const renderEntry = useCallback(
    (item: DateGroup["entries"][number]) => {
      const isDeleteTarget = deleteTargetId === item.id;
      return (
        <Pressable
          key={item.id}
          testID={`journal-entry-${item.id}`}
          onLongPress={() => setDeleteTargetId(item.id)}
          style={{
            backgroundColor: COLORS.card,
            borderColor: COLORS.cardBorder,
            borderWidth: 1,
            borderRadius: 12,
            padding: 14,
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              color: COLORS.textPrimary,
              fontSize: 15,
              lineHeight: 22,
            }}
          >
            {item.text}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>
              {formatTime(item.timestamp)}
            </Text>
            {isDeleteTarget ? (
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Pressable
                  testID={`confirm-delete-${item.id}`}
                  onPress={() => handleDelete(item.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    backgroundColor: "#3D1515",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}
                >
                  <Trash2 size={14} color="#FF6B6B" />
                  <Text style={{ color: "#FF6B6B", fontSize: 12 }}>
                    Delete
                  </Text>
                </Pressable>
                <Pressable
                  testID={`cancel-delete-${item.id}`}
                  onPress={() => setDeleteTargetId(null)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </Pressable>
      );
    },
    [deleteTargetId, handleDelete]
  );

  const renderDateGroup = useCallback(
    ({ item }: { item: DateGroup }) => (
      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            color: COLORS.textMuted,
            fontSize: 13,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 10,
            paddingHorizontal: 2,
          }}
        >
          {item.label}
        </Text>
        {item.entries.map(renderEntry)}
      </View>
    ),
    [renderEntry]
  );

  const listEmptyComponent = useMemo(
    () => (
      <View
        testID="journal-empty-state"
        style={{ alignItems: "center", paddingTop: 60 }}
      >
        <BookOpen size={48} color={COLORS.textMuted} />
        <Text
          style={{
            color: COLORS.textMuted,
            fontSize: 15,
            textAlign: "center",
            marginTop: 16,
            lineHeight: 22,
            paddingHorizontal: 32,
          }}
        >
          No journal entries yet.{"\n"}Start by logging what arises.
        </Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView
      testID="journal-screen"
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <BookOpen size={24} color={COLORS.accent} />
            <Text
              style={{
                color: COLORS.textPrimary,
                fontSize: 28,
                fontWeight: "700",
              }}
            >
              Journal
            </Text>
          </View>
          <Pressable
            testID="export-button"
            onPress={handleExport}
            style={{
              padding: 10,
              borderRadius: 12,
              backgroundColor: COLORS.card,
              opacity: journalEntries.length > 0 ? 1 : 0.4,
            }}
            disabled={journalEntries.length === 0}
          >
            <Share2 size={20} color={COLORS.textPrimary} />
          </Pressable>
        </View>

        {/* Quick Entry Input */}
        <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.inputBg,
              borderColor: COLORS.cardBorder,
              borderWidth: 1,
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 4,
            }}
          >
            <TextInput
              testID="journal-input"
              value={inputText}
              onChangeText={setInputText}
              placeholder="What arose? Name it. Accept it."
              placeholderTextColor={COLORS.textMuted}
              multiline
              maxLength={500}
              returnKeyType="default"
              style={{
                flex: 1,
                color: COLORS.textPrimary,
                fontSize: 15,
                paddingVertical: 12,
                maxHeight: 100,
              }}
            />
            <Pressable
              testID="log-button"
              onPress={handleSubmit}
              style={{
                backgroundColor:
                  inputText.trim().length > 0 ? COLORS.accent : COLORS.cardBorder,
                borderRadius: 10,
                padding: 10,
                marginLeft: 10,
              }}
              disabled={inputText.trim().length === 0}
            >
              <Send
                size={18}
                color={
                  inputText.trim().length > 0 ? "#0A0A0F" : COLORS.textMuted
                }
              />
            </Pressable>
          </View>
        </View>

        {/* ERN Prompt Card */}
        <Pressable
          testID="ern-prompt-card"
          onPress={cyclePrompt}
          style={{
            marginHorizontal: 20,
            marginBottom: 16,
            backgroundColor: COLORS.card,
            borderColor: COLORS.cardBorder,
            borderWidth: 1,
            borderRadius: 14,
            padding: 16,
          }}
        >
          <Text
            style={{
              color: COLORS.accent,
              fontSize: 12,
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            ERN Reflection Prompts
          </Text>
          <Text
            style={{
              color: COLORS.textPrimary,
              fontSize: 14,
              lineHeight: 20,
              fontStyle: "italic",
            }}
          >
            {ERN_PROMPTS[promptIndex]}
          </Text>
          <Text
            style={{
              color: COLORS.textMuted,
              fontSize: 11,
              marginTop: 8,
            }}
          >
            Tap to see another prompt
          </Text>
        </Pressable>

        {/* Journal Entries List */}
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
