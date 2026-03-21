import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withSpring,
  Easing,
  useAnimatedStyle,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { X, Play, Pause, SkipForward, RotateCcw, Check } from "lucide-react-native";
import { useDojoStore, DEFAULT_TIMER_DURATIONS } from "@/lib/state/dojo-store";

// --- Types ---

type BlockType = "morning" | "midday" | "evening";

interface Phase {
  name: string;
  duration: number; // seconds
  instruction: string;
}

// --- Base phase data (used for ratios only) ---

const BASE_PHASES: Record<BlockType, Phase[]> = {
  morning: [
    {
      name: "Breathing Exercise",
      duration: 1800,
      instruction: "Focus on exhale-dominant breathing. Longer exhale than inhale.",
    },
    {
      name: "Mindfulness + ERN Acceptance",
      duration: 1800,
      instruction: "What arose? Name it. Accept it. Breathe longer on exhale.",
    },
  ],
  midday: [
    {
      name: "Yoga Reset",
      duration: 300,
      instruction: "Gentle movements to reset your body and mind.",
    },
    {
      name: "Post-Lunch Mindfulness",
      duration: 300,
      instruction: "Settle into stillness. Observe without judgment.",
    },
  ],
  evening: [
    {
      name: "Tai Chi Warm-Up",
      duration: 300,
      instruction: "Slow, flowing movements. Connect breath to motion.",
    },
    {
      name: "Kata Practice",
      duration: 600,
      instruction: "Precise, deliberate forms. Embody the practice.",
    },
    {
      name: "Breathing Cool-Down",
      duration: 300,
      instruction: "Wind down with deep, calming breaths.",
    },
  ],
};

// Simple mode instructions (gentler)
const SIMPLE_INSTRUCTIONS: Record<BlockType, string[]> = {
  morning: [
    "Breathe in slowly, then out even slower. Just focus on your breath.",
    "Notice any thoughts or feelings without judging them. Just watch them pass.",
  ],
  midday: [
    "Move gently — a few stretches are perfect. No right or wrong here.",
    "Sit quietly and take slow, easy breaths. Let your mind rest.",
  ],
  evening: [
    "Move slowly like you're under water. Feel your body.",
    "Practice your movements carefully and calmly. No rush.",
    "Breathe out longer than you breathe in. Feel yourself wind down.",
  ],
};

const BLOCK_COLORS: Record<BlockType, string> = {
  morning: "#F4A261",
  midday:  "#2EC4B6",
  evening: "#7B68EE",
};

const BLOCK_TITLES: Record<BlockType, string> = {
  morning: "Morning Block",
  midday:  "Midday Block",
  evening: "Evening Block",
};

// --- Build phases scaled to custom total duration ---

function buildScaledPhases(blockType: BlockType, customMinutes: number): Phase[] {
  const base = BASE_PHASES[blockType];
  const baseTotal = base.reduce((sum, p) => sum + p.duration, 0);
  const customTotal = customMinutes * 60;
  const ratio = customTotal / baseTotal;
  return base.map((p) => ({
    ...p,
    duration: Math.max(30, Math.round(p.duration * ratio)),
  }));
}

// --- Animated circle ---

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// --- Constants ---

const CIRCLE_SIZE   = 250;
const STROKE_WIDTH  = 8;
const RADIUS        = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// --- Helpers ---

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// --- Component ---

export default function TimerScreen() {
  const { blockType: blockTypeParam } = useLocalSearchParams<{ blockType: string }>();
  const blockType: BlockType = (blockTypeParam as BlockType) ?? "morning";

  // Store
  const timerDurations = useDojoStore((s) => s.timerDurations);
  const simpleMode     = useDojoStore((s) => s.simpleMode);
  const startTimerStore  = useDojoStore((s) => s.startTimer);
  const tickTimer        = useDojoStore((s) => s.tickTimer);
  const pauseTimer       = useDojoStore((s) => s.pauseTimer);
  const resumeTimer      = useDojoStore((s) => s.resumeTimer);
  const resetTimerStore  = useDojoStore((s) => s.resetTimer);
  const completeTimer    = useDojoStore((s) => s.completeTimer);
  const completeBlock    = useDojoStore((s) => s.completeBlock);
  const remainingSeconds = useDojoStore((s) => s.activeTimer?.remainingSeconds ?? 0);

  // Build phases from custom duration (snapshot at mount time)
  const phasesRef = useRef<Phase[]>(
    buildScaledPhases(blockType, timerDurations[blockType] ?? DEFAULT_TIMER_DURATIONS[blockType])
  );
  const phases = phasesRef.current;

  const accentColor: string = BLOCK_COLORS[blockType];
  const blockTitle: string  = BLOCK_TITLES[blockType];

  // Local state
  const [currentPhaseIndex, setCurrentPhaseIndex]   = useState<number>(0);
  const [isPaused, setIsPaused]                     = useState<boolean>(true);
  const [isCompleted, setIsCompleted]               = useState<boolean>(false);
  const [showPhaseTransition, setShowPhaseTransition] = useState<boolean>(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animation values
  const progress             = useSharedValue<number>(1);
  const completionScale      = useSharedValue<number>(0);
  const completionOpacity    = useSharedValue<number>(0);
  const phaseTransitionOpacity = useSharedValue<number>(0);

  const currentPhase: Phase = phases[currentPhaseIndex];
  const totalPhases: number = phases.length;

  // Initialize first phase on mount
  useEffect(() => {
    startTimerStore(blockType, phases[0].name, phases[0].duration);
    progress.value = 1;
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      resetTimerStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tick interval
  useEffect(() => {
    if (!isPaused && !isCompleted && !showPhaseTransition) {
      intervalRef.current = setInterval(() => {
        tickTimer();
      }, 1000);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, isCompleted, showPhaseTransition, tickTimer]);

  // Update progress ring
  useEffect(() => {
    const total = currentPhase.duration;
    const fraction = total > 0 ? remainingSeconds / total : 0;
    progress.value = withTiming(fraction, { duration: 900, easing: Easing.linear });
  }, [remainingSeconds, currentPhase.duration, progress]);

  // Detect phase completion
  useEffect(() => {
    if (remainingSeconds === 0 && !isPaused && !isCompleted && !showPhaseTransition) {
      handlePhaseComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds]);

  const handlePhaseComplete = useCallback(() => {
    const nextIndex = currentPhaseIndex + 1;

    if (nextIndex >= totalPhases) {
      completeBlock(blockType);
      completeTimer();
      setIsCompleted(true);
      completionScale.value   = withSpring(1, { damping: 12, stiffness: 100 });
      completionOpacity.value = withTiming(1, { duration: 400 });
      setTimeout(() => { router.back(); }, 2500);
    } else {
      setShowPhaseTransition(true);
      phaseTransitionOpacity.value = withTiming(1, { duration: 300 });

      setTimeout(() => {
        setCurrentPhaseIndex(nextIndex);
        const nextPhase = phases[nextIndex];
        startTimerStore(blockType, nextPhase.name, nextPhase.duration);
        progress.value = 1;
        phaseTransitionOpacity.value = withTiming(0, { duration: 300 });
        setTimeout(() => { setShowPhaseTransition(false); }, 350);
      }, 1500);
    }
  }, [
    currentPhaseIndex, totalPhases, completeBlock, completeTimer,
    blockType, phases, startTimerStore, progress,
    completionScale, completionOpacity, phaseTransitionOpacity,
  ]);

  // Sync paused state with store
  useEffect(() => {
    if (isPaused) { pauseTimer(); } else { resumeTimer(); }
  }, [isPaused, pauseTimer, resumeTimer]);

  const handlePlayPause = useCallback(() => { setIsPaused((prev) => !prev); }, []);

  const handleReset = useCallback(() => {
    setIsPaused(true);
    startTimerStore(blockType, currentPhase.name, currentPhase.duration);
    progress.value = withTiming(1, { duration: 300 });
  }, [blockType, currentPhase, startTimerStore, progress]);

  const handleSkip = useCallback(() => {
    if (currentPhaseIndex < totalPhases - 1) {
      const nextIndex = currentPhaseIndex + 1;
      setCurrentPhaseIndex(nextIndex);
      setIsPaused(true);
      const nextPhase = phases[nextIndex];
      startTimerStore(blockType, nextPhase.name, nextPhase.duration);
      progress.value = withTiming(1, { duration: 300 });
    }
  }, [currentPhaseIndex, totalPhases, phases, blockType, startTimerStore, progress]);

  const handleClose = useCallback(() => {
    resetTimerStore();
    router.back();
  }, [resetTimerStore]);

  // Animated props for progress ring
  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  const completionAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: completionScale.value }],
    opacity: completionOpacity.value,
  }));

  const phaseTransitionStyle = useAnimatedStyle(() => ({
    opacity: phaseTransitionOpacity.value,
  }));

  // Resolve instruction (simple mode uses gentler text)
  const instruction = simpleMode
    ? (SIMPLE_INSTRUCTIONS[blockType][currentPhaseIndex] ?? currentPhase.instruction)
    : currentPhase.instruction;

  // --- Completion screen ---
  if (isCompleted) {
    return (
      <SafeAreaView style={styles.container} testID="timer-complete-screen">
        <View style={styles.completionContainer}>
          <Animated.View style={[styles.completionCircle, { borderColor: accentColor }, completionAnimatedStyle]}>
            <Check size={64} color={accentColor} />
          </Animated.View>
          <Animated.View style={completionAnimatedStyle}>
            <Text style={[styles.completionTitle, { color: accentColor }]}>Block Complete!</Text>
            <Text style={styles.completionSubtitle}>{blockTitle} finished</Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  // --- Timer screen ---
  return (
    <SafeAreaView style={styles.container} testID="timer-screen">
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={handleClose} style={styles.closeButton} testID="timer-close-button">
          <X size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.blockTitle}>{blockTitle}</Text>
        <Text style={styles.phaseIndicator}>
          {currentPhaseIndex + 1} of {totalPhases}
        </Text>
      </View>

      {/* Center timer */}
      <View style={styles.centerContainer}>
        {/* Phase transition overlay */}
        {showPhaseTransition ? (
          <Animated.View style={[styles.phaseTransitionOverlay, phaseTransitionStyle]}>
            <Check size={40} color={accentColor} />
            <Text style={[styles.phaseTransitionText, { color: accentColor }]}>Phase Complete</Text>
          </Animated.View>
        ) : null}

        {/* Circular progress */}
        <View style={styles.timerCircleWrapper}>
          <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}>
            <Circle
              cx={CIRCLE_SIZE / 2} cy={CIRCLE_SIZE / 2} r={RADIUS}
              stroke="rgba(255,255,255,0.08)" strokeWidth={STROKE_WIDTH} fill="transparent"
            />
            <AnimatedCircle
              cx={CIRCLE_SIZE / 2} cy={CIRCLE_SIZE / 2} r={RADIUS}
              stroke={accentColor} strokeWidth={STROKE_WIDTH} fill="transparent"
              strokeDasharray={`${CIRCUMFERENCE}`}
              animatedProps={animatedCircleProps}
              strokeLinecap="round"
              rotation={-90}
              origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
            />
          </Svg>
          <View style={styles.timerTextOverlay}>
            <Text style={styles.timerText} testID="timer-display">
              {formatTime(remainingSeconds)}
            </Text>
          </View>
        </View>

        {/* Phase info */}
        <Text style={[styles.phaseName, { color: accentColor }]} testID="timer-phase-name">
          {currentPhase.name}
        </Text>
        <Text style={styles.phaseInstruction}>{instruction}</Text>
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        <Pressable onPress={handleReset} style={styles.secondaryButton} testID="timer-reset-button">
          <RotateCcw size={22} color="#AAAAAA" />
        </Pressable>

        <Pressable
          onPress={handlePlayPause}
          style={[styles.playPauseButton, { backgroundColor: "#E8C547" }]}
          testID="timer-play-pause-button"
        >
          {isPaused ? <Play size={32} color="#0A0A0F" /> : <Pause size={32} color="#0A0A0F" />}
        </Pressable>

        <Pressable
          onPress={handleSkip}
          style={[
            styles.secondaryButton,
            currentPhaseIndex >= totalPhases - 1 ? styles.disabledButton : null,
          ]}
          disabled={currentPhaseIndex >= totalPhases - 1}
          testID="timer-skip-button"
        >
          <SkipForward size={22} color={currentPhaseIndex >= totalPhases - 1 ? "#444444" : "#AAAAAA"} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: "#0A0A0F" },
  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 12,
  },
  closeButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center", justifyContent: "center",
  },
  blockTitle:    { fontSize: 17, fontWeight: "600", color: "#FFFFFF" },
  phaseIndicator: { fontSize: 14, color: "rgba(255,255,255,0.5)", minWidth: 40, textAlign: "right" },
  centerContainer: {
    flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32,
  },
  timerCircleWrapper: {
    width: CIRCLE_SIZE, height: CIRCLE_SIZE, alignItems: "center", justifyContent: "center",
  },
  timerTextOverlay: { position: "absolute", alignItems: "center", justifyContent: "center" },
  timerText: {
    fontSize: 48, fontWeight: "200", color: "#FFFFFF", fontVariant: ["tabular-nums"],
  },
  phaseName:       { fontSize: 20, fontWeight: "600", marginTop: 32, textAlign: "center" },
  phaseInstruction: {
    fontSize: 15, color: "rgba(255,255,255,0.5)", marginTop: 12,
    textAlign: "center", lineHeight: 22, paddingHorizontal: 16,
  },
  phaseTransitionOverlay: {
    position: "absolute", alignItems: "center", justifyContent: "center", zIndex: 10,
  },
  phaseTransitionText: { fontSize: 18, fontWeight: "600", marginTop: 12 },
  bottomControls: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingBottom: 40, gap: 32,
  },
  playPauseButton: {
    width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center",
  },
  secondaryButton: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center", justifyContent: "center",
  },
  disabledButton: { opacity: 0.4 },
  completionContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  completionCircle: {
    width: 120, height: 120, borderRadius: 60, borderWidth: 3,
    alignItems: "center", justifyContent: "center", marginBottom: 24,
  },
  completionTitle: { fontSize: 28, fontWeight: "700", textAlign: "center" },
  completionSubtitle: { fontSize: 16, color: "rgba(255,255,255,0.5)", marginTop: 8, textAlign: "center" },
});
