import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Share, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, User, Share2, Trash2, Shield, BookOpen } from 'lucide-react-native';
import { useDojoStore, getTodayKey } from '@/lib/state/dojo-store';

export default function SettingsScreen() {
  const currentStreak = useDojoStore((s) => s.currentStreak);
  const longestStreak = useDojoStore((s) => s.longestStreak);
  const lastCompletedDate = useDojoStore((s) => s.lastCompletedDate);
  const journalEntries = useDojoStore((s) => s.journalEntries);
  const completedBlocks = useDojoStore((s) => s.completedBlocks);

  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  // Reset confirmation timeout
  useEffect(() => {
    if (!confirmReset) return;
    const timeout = setTimeout(() => {
      setConfirmReset(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [confirmReset]);

  const journalCount = journalEntries.length;

  const blocksCompleted = useMemo(() => {
    let count = 0;
    const keys = Object.keys(completedBlocks);
    for (let i = 0; i < keys.length; i++) {
      const day = completedBlocks[keys[i]];
      if (day.morning) count++;
      if (day.midday) count++;
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
      .map(
        (entry) =>
          `[${entry.date}]\n${entry.text}\n`
      );

    const text = `Dojo Journal\n${'='.repeat(30)}\n\n${lines.join('\n')}`;
    await Share.share({ message: text });
  }, [journalEntries]);

  const handleReset = useCallback(() => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }

    // Clear all persisted state
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
            <User size={22} color="#E8E8F0" />
          </View>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard} testID="streak-card">
          <Flame size={48} color="#E8C547" />
          <Text style={styles.streakNumber}>{currentStreak}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
          <View style={styles.streakDivider} />
          <Text style={styles.streakBest}>Best: {longestStreak} days</Text>
          <Text style={styles.streakLast}>Last completed: {formattedLastDate}</Text>
        </View>

        {/* Stats Section */}
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard} testID="stat-journal-entries">
            <BookOpen size={24} color="#E8C547" />
            <Text style={styles.statNumber}>{journalCount}</Text>
            <Text style={styles.statLabel}>Journal Entries</Text>
          </View>
          <View style={styles.statCard} testID="stat-blocks-completed">
            <Shield size={24} color="#E8C547" />
            <Text style={styles.statNumber}>{blocksCompleted}</Text>
            <Text style={styles.statLabel}>Blocks Completed</Text>
          </View>
        </View>

        {/* About Section */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <Text style={styles.aboutAppName}>Dojo</Text>
          <Text style={styles.aboutDetail}>Version 1.0.0</Text>
          <Text style={styles.aboutDetail}>License: MIT — Open Source</Text>
          <View style={styles.aboutDivider} />
          <Text style={styles.aboutPhilosophy}>
            No accounts. No tracking. No ads. No cloud.
          </Text>
          <Text style={styles.aboutLocal}>
            All data stored locally on your device.
          </Text>
        </View>

        {/* Data Management */}
        <Text style={styles.sectionTitle}>Data</Text>
        <Pressable
          testID="export-journal-button"
          style={({ pressed }) => [
            styles.actionButton,
            pressed ? styles.actionButtonPressed : null,
          ]}
          onPress={handleExportJournal}
        >
          <Share2 size={20} color="#E8E8F0" />
          <Text style={styles.actionButtonText}>Export Journal</Text>
        </Pressable>

        <Pressable
          testID="reset-data-button"
          style={({ pressed }) => [
            styles.resetButton,
            pressed ? styles.resetButtonPressed : null,
          ]}
          onPress={handleReset}
        >
          <Trash2 size={20} color={confirmReset ? '#FF4444' : '#8888A0'} />
          <Text
            style={[
              styles.resetButtonText,
              confirmReset ? styles.resetButtonTextConfirm : null,
            ]}
          >
            {confirmReset ? 'Tap again to confirm' : 'Reset All Data'}
          </Text>
        </Pressable>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A40',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E8E8F0',
  },
  streakCard: {
    backgroundColor: '#1C1C2E',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A40',
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 28,
  },
  streakNumber: {
    fontSize: 56,
    fontWeight: '800',
    color: '#E8E8F0',
    marginTop: 8,
    lineHeight: 64,
  },
  streakLabel: {
    fontSize: 16,
    color: '#8888A0',
    fontWeight: '500',
    marginTop: 2,
  },
  streakDivider: {
    width: 60,
    height: 1,
    backgroundColor: '#2A2A40',
    marginVertical: 16,
  },
  streakBest: {
    fontSize: 15,
    color: '#E8C547',
    fontWeight: '600',
  },
  streakLast: {
    fontSize: 13,
    color: '#8888A0',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8888A0',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
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
    fontSize: 32,
    fontWeight: '700',
    color: '#E8E8F0',
  },
  statLabel: {
    fontSize: 13,
    color: '#8888A0',
    fontWeight: '500',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1C1C2E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A40',
    padding: 20,
    marginBottom: 28,
  },
  aboutAppName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E8E8F0',
    marginBottom: 8,
  },
  aboutDetail: {
    fontSize: 14,
    color: '#8888A0',
    marginBottom: 4,
  },
  aboutDivider: {
    height: 1,
    backgroundColor: '#2A2A40',
    marginVertical: 14,
  },
  aboutPhilosophy: {
    fontSize: 14,
    color: '#E8C547',
    fontWeight: '600',
    marginBottom: 4,
  },
  aboutLocal: {
    fontSize: 13,
    color: '#8888A0',
  },
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
  actionButtonPressed: {
    opacity: 0.7,
  },
  actionButtonText: {
    fontSize: 16,
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
  resetButtonPressed: {
    opacity: 0.7,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8888A0',
  },
  resetButtonTextConfirm: {
    color: '#FF4444',
  },
  bottomSpacer: {
    height: 20,
  },
});
