import React, { useMemo } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Sunrise, Sun, Moon, Flame, Check } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useDojoStore, getTodayKey } from "@/lib/state/dojo-store";
import { cn } from "@/lib/cn";

// --- Types ---

type BlockType = "morning" | "midday" | "evening";

interface BlockConfig {
  type: BlockType;
  title: string;
  subtitle: string;
  accent: string;
  phases: string;
  Icon: typeof Sunrise;
}

// --- Constants ---

const BLOCKS: BlockConfig[] = [
  {
    type: "morning",
    title: "Morning Dojo",
    subtitle: "60 min — Breathing + Mindfulness",
    accent: "#F4A261",
    phases: "Breathwork · Body Scan · Meditation · Journaling",
    Icon: Sunrise,
  },
  {
    type: "midday",
    title: "Midday Reset",
    subtitle: "10 min — Yoga + Mindfulness",
    accent: "#2EC4B6",
    phases: "Gentle Yoga · Mindful Breathing · Intention Reset",
    Icon: Sun,
  },
  {
    type: "evening",
    title: "Evening Mastery",
    subtitle: "20 min — Tai Chi + Kata + Breathing",
    accent: "#7B68EE",
    phases: "Tai Chi Flow · Kata Practice · Cool Down Breathwork",
    Icon: Moon,
  },
];

const MANTRA =
  "I accept what is. I calibrate what arises. The struggle itself is the meaning.";

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
}: {
  block: BlockConfig;
  isCompleted: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue<number>(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
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
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
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
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={28} color="#0A0A0F" strokeWidth={3} />
          </View>
        </View>
      ) : null}

      {/* Card content */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <IconComponent size={22} color={block.accent} strokeWidth={1.8} />
        <Text
          className="text-lg font-semibold ml-3"
          style={{ color: "#F0F0F5" }}
        >
          {block.title}
        </Text>
      </View>

      <Text
        className="text-sm mb-3"
        style={{ color: "#9090A0" }}
      >
        {block.subtitle}
      </Text>

      <Text
        className="text-xs"
        style={{ color: "#606070" }}
      >
        {block.phases}
      </Text>
    </AnimatedPressable>
  );
}

// --- Dashboard Screen ---

export default function DashboardScreen() {
  const router = useRouter();

  // Zustand selectors returning primitives
  const currentStreak = useDojoStore((s) => s.currentStreak);
  const completedBlocks = useDojoStore((s) => s.completedBlocks);

  const todayKey = useMemo(() => getTodayKey(), []);
  const greeting = useMemo(() => getGreeting(), []);

  // Derive completion status per block
  const todayBlocks = completedBlocks[todayKey];
  const morningDone = todayBlocks?.morning ?? false;
  const middayDone = todayBlocks?.midday ?? false;
  const eveningDone = todayBlocks?.evening ?? false;

  const completionMap: Record<BlockType, boolean> = useMemo(
    () => ({
      morning: morningDone,
      midday: middayDone,
      evening: eveningDone,
    }),
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
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6">
          {/* Greeting and streak row */}
          <View className="flex-row items-center justify-between mb-5">
            <Text
              testID="greeting-text"
              className="text-2xl font-bold"
              style={{ color: "#F0F0F5" }}
            >
              {greeting}
            </Text>
            <View
              testID="streak-badge"
              className="flex-row items-center rounded-full px-3 py-1.5"
              style={{ backgroundColor: "#1C1C2E" }}
            >
              <Flame size={16} color="#F4A261" strokeWidth={2} />
              <Text
                className="text-sm font-semibold ml-1.5"
                style={{ color: "#F4A261" }}
              >
                {currentStreak}
              </Text>
            </View>
          </View>

          {/* Mantra */}
          <Text
            testID="mantra-text"
            className="text-sm italic leading-5"
            style={{ color: "#B8A060" }}
          >
            {MANTRA}
          </Text>
        </View>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: "#1C1C2E",
            marginBottom: 24,
          }}
        />

        {/* Section title */}
        <Text
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: "#606070" }}
        >
          Today's Practice
        </Text>

        {/* Block cards */}
        {BLOCKS.map((block) => (
          <BlockCard
            key={block.type}
            block={block}
            isCompleted={completionMap[block.type]}
            onPress={() => handleBlockPress(block.type)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
