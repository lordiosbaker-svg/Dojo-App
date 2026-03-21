import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- Types ---

export type BlockType = "morning" | "midday" | "evening";
export type TextSize = "small" | "medium" | "large";

interface ActiveTimer {
  blockType: BlockType;
  phase: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
}

interface DayBlocks {
  morning: boolean;
  midday: boolean;
  evening: boolean;
}

interface JournalEntry {
  id: string;
  text: string;
  timestamp: number;
  date: string;
}

export interface TimerDurations {
  morning: number; // minutes
  midday: number;
  evening: number;
}

export const DEFAULT_TIMER_DURATIONS: TimerDurations = {
  morning: 60,
  midday: 10,
  evening: 20,
};

// --- Store interface ---

interface DojoState {
  // Ephemeral (not persisted)
  activeTimer: ActiveTimer | null;

  // Persisted
  completedBlocks: Record<string, DayBlocks>;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  journalEntries: JournalEntry[];

  // Preferences (persisted)
  textSize: TextSize;
  timerDurations: TimerDurations;
  simpleMode: boolean;

  // Timer actions
  startTimer: (blockType: BlockType, phase: string, totalSeconds: number) => void;
  tickTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  completeTimer: () => void;

  // Block actions
  completeBlock: (blockType: BlockType) => void;

  // Streak actions
  updateStreak: () => void;

  // Journal actions
  addJournalEntry: (text: string) => void;
  deleteJournalEntry: (id: string) => void;

  // Preference actions
  setTextSize: (size: TextSize) => void;
  setTimerDuration: (block: BlockType, minutes: number) => void;
  toggleSimpleMode: () => void;
}

// --- Helpers ---

export function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function getEntriesForDate(
  entries: JournalEntry[],
  date: string
): JournalEntry[] {
  return entries.filter((entry) => entry.date === date);
}

// --- Default day blocks ---

function defaultDayBlocks(): DayBlocks {
  return { morning: false, midday: false, evening: false };
}

// --- Text size scale helper ---

export const TEXT_SCALE: Record<TextSize, number> = {
  small: 0.85,
  medium: 1.0,
  large: 1.2,
};

// --- Store ---

export const useDojoStore = create<DojoState>()(
  persist(
    (set, get) => ({
      // Ephemeral state
      activeTimer: null,

      // Persisted state
      completedBlocks: {},
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      journalEntries: [],

      // Preference defaults
      textSize: "medium",
      timerDurations: DEFAULT_TIMER_DURATIONS,
      simpleMode: false,

      // Timer actions
      startTimer: (blockType, phase, totalSeconds) =>
        set({
          activeTimer: {
            blockType,
            phase,
            totalSeconds,
            remainingSeconds: totalSeconds,
            isRunning: true,
          },
        }),

      tickTimer: () => {
        const { activeTimer } = get();
        if (activeTimer === null || !activeTimer.isRunning) return;
        const next = activeTimer.remainingSeconds - 1;
        if (next <= 0) {
          set({
            activeTimer: {
              ...activeTimer,
              remainingSeconds: 0,
              isRunning: false,
            },
          });
        } else {
          set({
            activeTimer: { ...activeTimer, remainingSeconds: next },
          });
        }
      },

      pauseTimer: () => {
        const { activeTimer } = get();
        if (activeTimer === null) return;
        set({ activeTimer: { ...activeTimer, isRunning: false } });
      },

      resumeTimer: () => {
        const { activeTimer } = get();
        if (activeTimer === null) return;
        set({ activeTimer: { ...activeTimer, isRunning: true } });
      },

      resetTimer: () => set({ activeTimer: null }),

      completeTimer: () => set({ activeTimer: null }),

      // Block actions
      completeBlock: (blockType) => {
        const today = getTodayKey();
        const { completedBlocks } = get();
        const dayBlocks = completedBlocks[today] ?? defaultDayBlocks();
        set({
          completedBlocks: {
            ...completedBlocks,
            [today]: { ...dayBlocks, [blockType]: true },
          },
        });
        get().updateStreak();
      },

      // Streak actions
      updateStreak: () => {
        const today = getTodayKey();
        const { lastCompletedDate, currentStreak, longestStreak } = get();

        if (lastCompletedDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

        let newStreak: number;
        if (lastCompletedDate === yesterdayKey) {
          newStreak = currentStreak + 1;
        } else if (lastCompletedDate === null) {
          newStreak = 1;
        } else {
          newStreak = 1;
        }

        const newLongest = Math.max(longestStreak, newStreak);

        set({
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastCompletedDate: today,
        });
      },

      // Journal actions
      addJournalEntry: (text) => {
        const entry: JournalEntry = {
          id: generateId(),
          text,
          timestamp: Date.now(),
          date: getTodayKey(),
        };
        set({ journalEntries: [...get().journalEntries, entry] });
      },

      deleteJournalEntry: (id) => {
        set({
          journalEntries: get().journalEntries.filter(
            (entry) => entry.id !== id
          ),
        });
      },

      // Preference actions
      setTextSize: (size) => set({ textSize: size }),

      setTimerDuration: (block, minutes) => {
        const { timerDurations } = get();
        set({ timerDurations: { ...timerDurations, [block]: minutes } });
      },

      toggleSimpleMode: () => set({ simpleMode: !get().simpleMode }),
    }),
    {
      name: "dojo-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        completedBlocks: state.completedBlocks,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastCompletedDate: state.lastCompletedDate,
        journalEntries: state.journalEntries,
        textSize: state.textSize,
        timerDurations: state.timerDurations,
        simpleMode: state.simpleMode,
      }),
    }
  )
);

export default useDojoStore;
