import React, { useMemo } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Sunrise, Sun, Moon, Flame, Check, Zap } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useDojoStore, getTodayKey, TEXT_SCALE } from "@/lib/state/dojo-store";

// --- Types ---

type BlockType = "morning" | "midday" | "evening";

interface BlockConfig {
  type: BlockType;
  title: string;
  subtitle: string;
  simpleSubtitle: string;
  accent: string;
  phases: string;
  simplePhases: string;
  quickStart: string;
  Icon: typeof Sunrise;
}

// --- Constants ---

const BLOCKS: BlockConfig[] = [
  {
    type: "morning",
    title: "Morning Dojo",
    subtitle: "60 min — Breathing + Mindfulness",
    simpleSubtitle: "Start your day with breathing & calm focus",
    accent: "#F4A261",
    phases: "Breathwork · Body Scan · Meditation · Journaling",
    simplePhases: "Breathe · Sit quietly · Notice your thoughts",
    quickStart: "Sit comfortably, close your eyes, and breathe slowly. When the timer starts, just follow along.",
    Icon: Sunrise,
  },
  {
    type: "midday",
    title: "Midday Reset",
    subtitle: "10 min — Yoga + Mindfulness",
    simpleSubtitle: "A quick stretch and a moment of stillness",
    accent: "#2EC4B6",
    phases: "Gentle Yoga · Mindful Breathing · Intention Reset",
    simplePhases: "Stretch · Breathe · Reset your focus",
    quickStart: "Stand up, do a few gentle stretches, then sit and take 5 slow breaths. That's it.",
    Icon: Sun,
  },
  {
    type: "evening",
    title: "Evening Mastery",
    subtitle: "20 min — Tai Chi + Kata + Breathing",
    simpleSubtitle: "Wind down with movement and deep breathing",
    accent: "#7B68EE",
    phases: "Tai Chi Flow · Kata Practice · Cool Down Breathwork",
    simplePhases: "Slow movement · Deep breaths · Wind down",
    quickStart: "Move slowly like you're in water. Then breathe out longer than you breathe in. Feel yourself slow down.",
    Icon: Moon,
  },
];

const MANTRA =
  "I accept what is. I calibrate what arises. The struggle itself is the meaning.";

const SIMPLE_MANTRA =
  "Accept what is. Adjust what you can. The challenge IS the meaning.";

// --- Helpers ---

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// --- Block Card Component ---

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function BlockCard({
  block,
  isCompleted,
  onPress,
  simpleMode,
  scale,
}: {
  block: BlockConfig;
  isCompleted: boolean;
  onPress: () => void;
  simpleMode: boolean;
  scale: number;
}) {
  const sv = useSharedValue<number>(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sv.value }],
  }));

  const handlePressIn = () => {
    sv.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    sv.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const IconComponent = block.Icon;

  return (
    <AnimatedPressable
      testID={`block-card-${block.type}`}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animatedStyle,
        {
          backgroundColor: "#1C1C2E",
          borderLeftWidth: 3,
          borderLeftColor: block.accent,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          position: "relative",
          overflow: "hidden",
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${block.title}${isCompleted ? ", completed" : ""}`}
    >
      {/* Completed overlay */}
      {isCompleted ? (
        <View
          testID={`block-completed-${block.type}`}
          style={{
            position: "absolute",
            top: 0, right: 0, bottom: 0, left: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <View
            style={{
              backgroundColor: block.accent,
              width: 48, height: 48, borderRadius: 24,
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Check size={28} color="#0A0A0F" strokeWidth={3} />
          </View>
        </View>
      ) : null}

      {/* Card content */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <IconComponent size={22} color={block.accent} strokeWidth={1.8} />
        <Text style={{ color: "#F0F0F5", fontSize: 17 * scale, fontWeight: "600", marginLeft: 12 }}>
          {block.title}
        </Text>
      </View>

      <Text style={{ color: "#9090A0", fontSize: 13 * scale, marginBottom: simpleMode ? 10 : 8 }}>
        {simpleMode ? block.simpleSubtitle : block.subtitle}
      </Text>

      <Text style={{ color: "#606070", fontSize: 12 * scale }}>
        {simpleMode ? block.simplePhases : block.phases}
      </Text>

      {/* Simple Mode: quick-start guide */}
      {simpleMode && !isCompleted ? (
        <View
          style={{
            marginTop: 12,
            backgroundColor: "rgba(255,255,255,0.04)",
            borderRadius: 8,
            padding: 10,
            borderLeftWidth: 2,
            borderLeftColor: block.accent + "88",
          }}
        >
          <Text style={{ color: block.accent, fontSize: 11 * scale, fontWeight: "600", marginBottom: 3 }}>
            Quick Start
          </Text>
          <Text style={{ color: "#8888A0", fontSize: 12 * scale, lineHeight: 18 * scale }}>
            {block.quickStart}
          </Text>
        </View>
      ) : null}
    </AnimatedPressable>
  );
}

// --- Dashboard Screen ---

export default function DashboardScreen() {
  const router = useRouter();

  const currentStreak  = useDojoStore((s) => s.currentStreak);
  const completedBlocks = useDojoStore((s) => s.completedBlocks);
  const textSize       = useDojoStore((s) => s.textSize);
  const simpleMode     = useDojoStore((s) => s.simpleMode);
  const timerDurations = useDojoStore((s) => s.timerDurations);

  const scale    = TEXT_SCALE[textSize];
  const todayKey = useMemo(() => getTodayKey(), []);
  const greeting = useMemo(() => getGreeting(), []);

  const todayBlocks = completedBlocks[todayKey];
  const morningDone = todayBlocks?.morning ?? false;
  const middayDone  = todayBlocks?.midday  ?? false;
  const eveningDone = todayBlocks?.evening ?? false;

  const completionMap: Record<BlockType, boolean> = useMemo(
    () => ({ morning: morningDone, midday: middayDone, evening: eveningDone }),
    [morningDone, middayDone, eveningDone]
  );

  const handleBlockPress = (blockType: BlockType) => {
    router.push({ pathname: "/timer", params: { blockType } });
  };

  return (
    <SafeAreaView
      testID="dashboard-screen"
      style={{ flex: 1, backgroundColor: "#0A0A0F" }}
      edges={["top", "left", "right"]}
    >
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: 6 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
            <Text
              testID="greeting-text"
              style={{ fontSize: 24 * scale, fontWeight: "700", color: "#F0F0F5" }}
            >
              {greeting}
            </Text>
            <View
              testID="streak-badge"
              style={{
                flexDirection: "row", alignItems: "center",
                borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
                backgroundColor: "#1C1C2E",
              }}
            >
              <Flame size={16} color="#F4A261" strokeWidth={2} />
              <Text style={{ fontSize: 14 * scale, fontWeight: "600", color: "#F4A261", marginLeft: 6 }}>
                {currentStreak}
              </Text>
            </View>
          </View>

          {/* Mantra */}
          <Text
            testID="mantra-text"
            style={{ fontSize: 13 * scale, fontStyle: "italic", lineHeight: 20 * scale, color: "#B8A060" }}
          >
            {simpleMode ? SIMPLE_MANTRA : MANTRA}
          </Text>
        </View>

        {/* Simple Mode banner */}
        {simpleMode ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(232,197,71,0.1)",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "rgba(232,197,71,0.25)",
              padding: 10,
              marginTop: 10,
              marginBottom: 16,
              gap: 8,
            }}
          >
            <Zap size={14} color="#E8C547" />
            <Text style={{ color: "#E8C547", fontSize: 12 * scale, fontWeight: "600", flex: 1 }}>
              Simple Mode is on — each block shows a Quick Start guide below
            </Text>
          </View>
        ) : null}

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: "#1C1C2E", marginTop: simpleMode ? 0 : 14, marginBottom: 20 }} />

        {/* Section title */}
        <Text style={{ fontSize: 11 * scale, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1.5, color: "#606070", marginBottom: 16 }}>
          {simpleMode ? "Your Practice Today" : "Today's Practice"}
        </Text>

        {/* Block cards */}
        {BLOCKS.map((block) => (
          <BlockCard
            key={block.type}
            block={block}
            isCompleted={completionMap[block.type]}
            onPress={() => handleBlockPress(block.type)}
            simpleMode={simpleMode}
            scale={scale}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
