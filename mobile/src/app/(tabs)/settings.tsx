import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Share, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Flame,
  Settings,
  Share2,
  Trash2,
  Shield,
  BookOpen,
  Minus,
  Plus,
  AlignJustify,
  Type,
  Zap,
} from 'lucide-react-native';
import { useDojoStore, getTodayKey, TEXT_SCALE } from '@/lib/state/dojo-store';
import type { TextSize, BlockType, Language } from '@/lib/state/dojo-store';
import { useTranslation } from '@/lib/i18n';
import { LANGUAGE_NAMES } from '@/lib/i18n/translations';

const LANGUAGES: Language[] = ['en', 'es', 'fr', 'de', 'pt', 'ar'];

const TIMER_LIMITS: Record<BlockType, { min: number; max: number; step: number }> = {
  morning: { min: 5, max: 180, step: 5 },
  midday:  { min: 2, max:  60, step: 2 },
  evening: { min: 5, max: 120, step: 5 },
};

const BLOCK_LABELS: Record<BlockType, string> = {
  morning: 'Morning Dojo',
  midday:  'Midday Reset',
  evening: 'Evening Mastery',
};

const BLOCK_COLORS: Record<BlockType, string> = {
  morning: '#F4A261',
  midday:  '#2EC4B6',
  evening: '#7B68EE',
};

const TEXT_SIZE_LABELS: Record<TextSize, string> = {
  small:  'S',
  medium: 'M',
  large:  'L',
};

export default function SettingsScreen() {
  const currentStreak    = useDojoStore((s) => s.currentStreak);
  const longestStreak    = useDojoStore((s) => s.longestStreak);
  const lastCompletedDate = useDojoStore((s) => s.lastCompletedDate);
  const journalEntries   = useDojoStore((s) => s.journalEntries);
  const completedBlocks  = useDojoStore((s) => s.completedBlocks);
  const textSize         = useDojoStore((s) => s.textSize);
  const timerDurations   = useDojoStore((s) => s.timerDurations);
  const simpleMode       = useDojoStore((s) => s.simpleMode);
  const language         = useDojoStore((s) => s.language);

  const setTextSize      = useDojoStore((s) => s.setTextSize);
  const setTimerDuration = useDojoStore((s) => s.setTimerDuration);
  const toggleSimpleMode = useDojoStore((s) => s.toggleSimpleMode);
  const setLanguage      = useDojoStore((s) => s.setLanguage);

  const t = useTranslation();

  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  const scale = TEXT_SCALE[textSize];

  useEffect(() => {
    if (!confirmReset) return;
    const timeout = setTimeout(() => setConfirmReset(false), 3000);
    return () => clearTimeout(timeout);
  }, [confirmReset]);

  const journalCount = journalEntries.length;

  const blocksCompleted = useMemo(() => {
    let count = 0;
    const keys = Object.keys(completedBlocks);
    for (let i = 0; i < keys.length; i++) {
      const day = completedBlocks[keys[i]];
      if (day.morning) count++;
      if (day.midday)  count++;
      if (day.evening) count++;
    }
    return count;
  }, [completedBlocks]);

  const handleExportJournal = useCallback(async () => {
    if (journalEntries.length === 0) {
      await Share.share({ message: 'Dojo Journal\n\nNo entries yet.' });
      return;
    }
    const lines = journalEntries
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((entry) => `[${entry.date}]\n${entry.text}\n`);
    const text = `Dojo Journal\n${'='.repeat(30)}\n\n${lines.join('\n')}`;
    await Share.share({ message: text });
  }, [journalEntries]);

  const handleReset = useCallback(() => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    useDojoStore.setState({
      completedBlocks: {},
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      journalEntries: [],
      activeTimer: null,
    });
    setConfirmReset(false);
  }, [confirmReset]);

  const adjustTimer = useCallback(
    (block: BlockType, delta: number) => {
      const limits = TIMER_LIMITS[block];
      const current = timerDurations[block];
      const next = Math.min(limits.max, Math.max(limits.min, current + delta));
      setTimerDuration(block, next);
    },
    [timerDurations, setTimerDuration]
  );

  const formattedLastDate = lastCompletedDate ?? 'Never';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        testID="settings-screen"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Settings size={22} color="#E8E8F0" />
          </View>
          <Text style={[styles.headerTitle, { fontSize: 28 * scale }]}>Settings</Text>
        </View>

        {/* ── Simple Mode ── */}
        <Text style={[styles.sectionTitle, { fontSize: 12 * scale }]}>Mode</Text>
        <Pressable
          testID="simple-mode-toggle"
          style={({ pressed }) => [
            styles.simpleModeCard,
            simpleMode && styles.simpleModeCardActive,
            pressed && { opacity: 0.85 },
          ]}
          onPress={toggleSimpleMode}
          accessibilityRole="switch"
          accessibilityState={{ checked: simpleMode }}
        >
          <View style={styles.simpleModeLeft}>
            <Zap size={22} color={simpleMode ? '#0A0A0F' : '#E8C547'} />
            <View style={{ marginLeft: 14 }}>
              <Text style={[
                styles.simpleModeTitle,
                simpleMode && { color: '#0A0A0F' },
                { fontSize: 16 * scale },
              ]}>
                Simple Mode
              </Text>
              <Text style={[
                styles.simpleModeDesc,
                simpleMode && { color: 'rgba(10,10,15,0.65)' },
                { fontSize: 12 * scale },
              ]}>
                {simpleMode
                  ? 'On — beginner-friendly view enabled'
                  : 'Off — tap to show gentle guides & shorter text'}
              </Text>
            </View>
          </View>
          <View style={[
            styles.togglePill,
            simpleMode ? styles.togglePillOn : styles.togglePillOff,
          ]}>
            <View style={[
              styles.toggleDot,
              simpleMode ? styles.toggleDotOn : styles.toggleDotOff,
            ]} />
          </View>
        </Pressable>

        {/* ── Language ── */}
        <Text style={[styles.sectionTitle, { fontSize: 12 * scale }]}>{t.settings.sections.language}</Text>
        <View style={styles.card}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.langPillsRow}
          >
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang}
                testID={`language-pill-${lang}`}
                onPress={() => setLanguage(lang)}
                style={[
                  styles.langPill,
                  language === lang && styles.langPillActive,
                ]}
              >
                <Text style={[
                  styles.langPillText,
                  language === lang && styles.langPillTextActive,
                  { fontSize: 14 * scale },
                ]}>
                  {LANGUAGE_NAMES[lang]}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ── Text Size ── */}
        <Text style={[styles.sectionTitle, { fontSize: 12 * scale }]}>Text Size</Text>
        <View style={styles.card}>
          <View style={styles.textSizeRow}>
            <Type size={18} color="#8888A0" />
            <Text style={[styles.textSizeLabel, { fontSize: 14 * scale }]}>
              Font Size
            </Text>
            <View style={styles.textSizePills}>
              {(['small', 'medium', 'large'] as TextSize[]).map((size) => (
                <Pressable
                  key={size}
                  testID={`text-size-${size}`}
                  onPress={() => setTextSize(size)}
                  style={[
                    styles.textSizePill,
                    textSize === size && styles.textSizePillActive,
                  ]}
                >
                  <Text style={[
                    styles.textSizePillText,
                    textSize === size && styles.textSizePillTextActive,
                  ]}>
                    {TEXT_SIZE_LABELS[size]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* ── Timer Durations ── */}
        <Text style={[styles.sectionTitle, { fontSize: 12 * scale }]}>Block Timers</Text>
        <View style={styles.card}>
          {(['morning', 'midday', 'evening'] as BlockType[]).map((block, idx) => {
            const accent = BLOCK_COLORS[block];
            const limits = TIMER_LIMITS[block];
            const mins   = timerDurations[block];
            return (
              <React.Fragment key={block}>
                {idx > 0 && <View style={styles.timerDivider} />}
                <View style={styles.timerRow}>
                  <View style={[styles.timerDot, { backgroundColor: accent }]} />
                  <Text style={[styles.timerLabel, { fontSize: 14 * scale, color: accent }]}>
                    {BLOCK_LABELS[block]}
                  </Text>
                  <View style={styles.timerControls}>
                    <Pressable
                      testID={`timer-minus-${block}`}
                      onPress={() => adjustTimer(block, -limits.step)}
                      disabled={mins <= limits.min}
                      style={[
                        styles.timerBtn,
                        mins <= limits.min && styles.timerBtnDisabled,
                      ]}
                    >
                      <Minus size={16} color={mins <= limits.min ? '#444455' : '#E8E8F0'} />
                    </Pressable>
                    <View style={styles.timerValue}>
                      <Text style={[styles.timerValueText, { fontSize: 18 * scale }]}>
                        {mins}
                      </Text>
                      <Text style={[styles.timerValueUnit, { fontSize: 10 * scale }]}>
                        min
                      </Text>
                    </View>
                    <Pressable
                      testID={`timer-plus-${block}`}
                      onPress={() => adjustTimer(block, limits.step)}
                      disabled={mins >= limits.max}
                      style={[
                        styles.timerBtn,
                        mins >= limits.max && styles.timerBtnDisabled,
                      ]}
                    >
                      <Plus size={16} color={mins >= limits.max ? '#444455' : '#E8E8F0'} />
                    </Pressable>
                  </View>
                </View>
              </React.Fragment>
            );
          })}
        </View>

        {/* ── Streak Card ── */}
        <Text style={[styles.sectionTitle, { fontSize: 12 * scale }]}>Streak</Text>
        <View style={styles.streakCard} testID="streak-card">
          <Flame size={44} color="#E8C547" />
          <Text style={[styles.streakNumber, { fontSize: 52 * scale }]}>{currentStreak}</Text>
          <Text style={[styles.streakLabel, { fontSize: 14 * scale }]}>day streak</Text>
          <View style={styles.streakDivider} />
          <Text style={[styles.streakBest, { fontSize: 14 * scale }]}>Best: {longestStreak} days</Text>
          <Text style={[styles.streakLast, { fontSize: 12 * scale }]}>Last completed: {formattedLastDate}</Text>
        </View>

        {/* ── Stats ── */}
        <Text style={[styles.sectionTitle, { fontSize: 12 * scale }]}>Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard} testID="stat-journal-entries">
            <BookOpen size={24} color="#E8C547" />
            <Text style={[styles.statNumber, { fontSize: 30 * scale }]}>{journalCount}</Text>
            <Text style={[styles.statLabel, { fontSize: 12 * scale }]}>Journal Entries</Text>
          </View>
          <View style={styles.statCard} testID="stat-blocks-completed">
            <Shield size={24} color="#E8C547" />
            <Text style={[styles.statNumber, { fontSize: 30 * scale }]}>{blocksCompleted}</Text>
            <Text style={[styles.statLabel, { fontSize: 12 * scale }]}>Blocks Completed</Text>
          </View>
        </View>

        {/* ── About ── */}
        <Text style={[styles.sectionTitle, { fontSize: 12 * scale }]}>About</Text>
        <View style={styles.card}>
          <Text style={[styles.aboutAppName, { fontSize: 20 * scale }]}>Dojo</Text>
          <Text style={[styles.aboutDetail, { fontSize: 13 * scale }]}>Version 1.0.0</Text>
          <Text style={[styles.aboutDetail, { fontSize: 13 * scale }]}>License: MIT — Open Source</Text>
          <View style={styles.aboutDivider} />
          <Text style={[styles.aboutPhilosophy, { fontSize: 13 * scale }]}>
            No accounts. No tracking. No ads. No cloud.
          </Text>
          <Text style={[styles.aboutLocal, { fontSize: 12 * scale }]}>
            All data stored locally on your device.
          </Text>
        </View>

        {/* ── Data ── */}
        <Text style={[styles.sectionTitle, { fontSize: 12 * scale }]}>Data</Text>
        <Pressable
          testID="export-journal-button"
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={handleExportJournal}
        >
          <Share2 size={20} color="#E8E8F0" />
          <Text style={[styles.actionButtonText, { fontSize: 15 * scale }]}>Export Journal</Text>
        </Pressable>

        <Pressable
          testID="reset-data-button"
          style={({ pressed }) => [
            styles.resetButton,
            pressed && styles.resetButtonPressed,
          ]}
          onPress={handleReset}
        >
          <Trash2 size={20} color={confirmReset ? '#FF4444' : '#8888A0'} />
          <Text style={[
            styles.resetButtonText,
            confirmReset && styles.resetButtonTextConfirm,
            { fontSize: 15 * scale },
          ]}>
            {confirmReset ? 'Tap again to confirm' : 'Reset All Data'}
          </Text>
        </Pressable>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#0A0A0F' },
  scrollView:     { flex: 1 },
  scrollContent:  { paddingHorizontal: 20, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    gap: 12,
  },
  headerIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#1C1C2E',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#2A2A40',
  },
  headerTitle: {
    fontWeight: '700',
    color: '#E8E8F0',
  },

  sectionTitle: {
    fontWeight: '600',
    color: '#8888A0',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Simple Mode card
  simpleModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C2E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A40',
    padding: 18,
    marginBottom: 28,
  },
  simpleModeCardActive: {
    backgroundColor: '#E8C547',
    borderColor: '#E8C547',
  },
  simpleModeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  simpleModeTitle: {
    fontWeight: '700',
    color: '#E8E8F0',
    marginBottom: 2,
  },
  simpleModeDesc: {
    color: '#8888A0',
    lineHeight: 16,
  },
  togglePill: {
    width: 44, height: 26,
    borderRadius: 13,
    padding: 3,
    justifyContent: 'center',
  },
  togglePillOn:  { backgroundColor: '#0A0A0F' },
  togglePillOff: { backgroundColor: '#2A2A40' },
  toggleDot: {
    width: 20, height: 20, borderRadius: 10,
  },
  toggleDotOn:  { backgroundColor: '#E8C547', alignSelf: 'flex-end' },
  toggleDotOff: { backgroundColor: '#8888A0', alignSelf: 'flex-start' },

  // Text size
  card: {
    backgroundColor: '#1C1C2E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A40',
    padding: 20,
    marginBottom: 28,
  },
  textSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textSizeLabel: {
    color: '#E8E8F0',
    fontWeight: '500',
    flex: 1,
  },
  textSizePills: {
    flexDirection: 'row',
    gap: 6,
  },
  textSizePill: {
    width: 38, height: 38,
    borderRadius: 10,
    backgroundColor: '#12121E',
    borderWidth: 1,
    borderColor: '#2A2A40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSizePillActive: {
    backgroundColor: '#E8C547',
    borderColor: '#E8C547',
  },
  textSizePillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8888A0',
  },
  textSizePillTextActive: {
    color: '#0A0A0F',
  },

  // Timer rows
  timerDivider: {
    height: 1,
    backgroundColor: '#2A2A40',
    marginVertical: 14,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timerDot: {
    width: 8, height: 8, borderRadius: 4,
  },
  timerLabel: {
    fontWeight: '600',
    flex: 1,
  },
  timerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#12121E',
    borderWidth: 1,
    borderColor: '#2A2A40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerBtnDisabled: { opacity: 0.4 },
  timerValue: {
    minWidth: 52,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 2,
  },
  timerValueText: {
    fontWeight: '700',
    color: '#E8E8F0',
    fontVariant: ['tabular-nums'],
  },
  timerValueUnit: {
    color: '#8888A0',
    fontWeight: '500',
    marginTop: 2,
  },

  // Streak
  streakCard: {
    backgroundColor: '#1C1C2E',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A40',
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 28,
  },
  streakNumber: {
    fontWeight: '800',
    color: '#E8E8F0',
    marginTop: 8,
    lineHeight: 60,
  },
  streakLabel: {
    color: '#8888A0',
    fontWeight: '500',
    marginTop: 2,
  },
  streakDivider: {
    width: 60, height: 1,
    backgroundColor: '#2A2A40',
    marginVertical: 14,
  },
  streakBest: {
    color: '#E8C547',
    fontWeight: '600',
  },
  streakLast: {
    color: '#8888A0',
    marginTop: 6,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1C1C2E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A40',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontWeight: '700',
    color: '#E8E8F0',
  },
  statLabel: {
    color: '#8888A0',
    fontWeight: '500',
    textAlign: 'center',
  },

  // About
  aboutAppName: {
    fontWeight: '700',
    color: '#E8E8F0',
    marginBottom: 8,
  },
  aboutDetail: {
    color: '#8888A0',
    marginBottom: 4,
  },
  aboutDivider: {
    height: 1,
    backgroundColor: '#2A2A40',
    marginVertical: 14,
  },
  aboutPhilosophy: {
    color: '#E8C547',
    fontWeight: '600',
    marginBottom: 4,
  },
  aboutLocal: { color: '#8888A0' },

  // Buttons
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1C1C2E',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2A40',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  actionButtonPressed: { opacity: 0.7 },
  actionButtonText: {
    fontWeight: '600',
    color: '#E8E8F0',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1C1C2E',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2A40',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resetButtonPressed: { opacity: 0.7 },
  resetButtonText: {
    fontWeight: '600',
    color: '#8888A0',
  },
  resetButtonTextConfirm: { color: '#FF4444' },
  bottomSpacer: { height: 20 },

  // Language selector
  langPillsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  langPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#12121E',
    borderWidth: 1,
    borderColor: '#2A2A40',
  },
  langPillActive: {
    backgroundColor: '#E8C547',
    borderColor: '#E8C547',
  },
  langPillText: {
    fontWeight: '600',
    color: '#8888A0',
  },
  langPillTextActive: {
    color: '#0A0A0F',
  },
});
