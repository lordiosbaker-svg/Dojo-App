import React, { useMemo } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Flame, Check, Zap } from "lucide-react-native";
import { Sunrise, Sun, Moon } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useDojoStore, getTodayKey, TEXT_SCALE } from "@/lib/state/dojo-store";
import { useTranslation } from "@/lib/i18n";

type BlockType = "morning" | "midday" | "evening";

const BLOCK_ACCENTS: Record<BlockType, string> = {
  morning: "#F4A261",
  midday:  "#2EC4B6",
  evening: "#7B68EE",
};

const BLOCK_ICONS = { morning: Sunrise, midday: Sun, evening: Moon };

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function BlockCard({
  blockType,
  isCompleted,
  onPress,
  simpleMode,
  scale,
}: {
  blockType: BlockType;
  isCompleted: boolean;
  onPress: () => void;
  simpleMode: boolean;
  scale: number;
}) {
  const t = useTranslation();
  const block = t.dashboard.blocks[blockType];
  const accent = BLOCK_ACCENTS[blockType];
  const IconComponent = BLOCK_ICONS[blockType];
  const sv = useSharedValue<number>(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sv.value }],
  }));

  return (
    <AnimatedPressable
      testID={`block-card-${blockType}`}
      onPress={onPress}
      onPressIn={() => { sv.value = withSpring(0.97, { damping: 15, stiffness: 300 }); }}
      onPressOut={() => { sv.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
      style={[animatedStyle, {
        backgroundColor: "#1C1C2E", borderLeftWidth: 3, borderLeftColor: accent,
        borderRadius: 16, padding: 20, marginBottom: 16, position: "relative", overflow: "hidden",
      }]}
      accessibilityRole="button"
      accessibilityLabel={`${block.title}${isCompleted ? ", completed" : ""}`}
    >
      {isCompleted ? (
        <View testID={`block-completed-${blockType}`} style={{
          position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
          backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 16,
          alignItems: "center", justifyContent: "center", zIndex: 10,
        }}>
          <View style={{ backgroundColor: accent, width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" }}>
            <Check size={28} color="#0A0A0F" strokeWidth={3} />
          </View>
        </View>
      ) : null}

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <IconComponent size={22} color={accent} strokeWidth={1.8} />
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

      {simpleMode && !isCompleted ? (
        <View style={{
          marginTop: 12, backgroundColor: "rgba(255,255,255,0.04)",
          borderRadius: 8, padding: 10,
          borderLeftWidth: 2, borderLeftColor: accent + "88",
        }}>
          <Text style={{ color: accent, fontSize: 11 * scale, fontWeight: "600", marginBottom: 3 }}>
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

export default function DashboardScreen() {
  const router = useRouter();
  const t = useTranslation();

  const currentStreak   = useDojoStore((s) => s.currentStreak);
  const completedBlocks = useDojoStore((s) => s.completedBlocks);
  const textSize        = useDojoStore((s) => s.textSize);
  const simpleMode      = useDojoStore((s) => s.simpleMode);

  const scale    = TEXT_SCALE[textSize];
  const todayKey = useMemo(() => getTodayKey(), []);

  const todayBlocks = completedBlocks[todayKey];
  const morningDone = todayBlocks?.morning ?? false;
  const middayDone  = todayBlocks?.midday  ?? false;
  const eveningDone = todayBlocks?.evening ?? false;

  const completionMap: Record<BlockType, boolean> = useMemo(
    () => ({ morning: morningDone, midday: middayDone, evening: eveningDone }),
    [morningDone, middayDone, eveningDone]
  );

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t.dashboard.morning;
    if (hour < 17) return t.dashboard.afternoon;
    return t.dashboard.evening;
  }, [t]);

  return (
    <SafeAreaView testID="dashboard-screen" style={{ flex: 1, backgroundColor: "#0A0A0F" }} edges={["top", "left", "right"]}>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 6 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
            <Text testID="greeting-text" style={{ fontSize: 24 * scale, fontWeight: "700", color: "#F0F0F5" }}>
              {greeting}
            </Text>
            <View testID="streak-badge" style={{ flexDirection: "row", alignItems: "center", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#1C1C2E" }}>
              <Flame size={16} color="#F4A261" strokeWidth={2} />
              <Text style={{ fontSize: 14 * scale, fontWeight: "600", color: "#F4A261", marginLeft: 6 }}>
                {currentStreak}
              </Text>
            </View>
          </View>

          <Text testID="mantra-text" style={{ fontSize: 13 * scale, fontStyle: "italic", lineHeight: 20 * scale, color: "#B8A060" }}>
            {simpleMode ? t.dashboard.simpleMantra : t.dashboard.mantra}
          </Text>
        </View>

        {simpleMode ? (
          <View style={{
            flexDirection: "row", alignItems: "center",
            backgroundColor: "rgba(232,197,71,0.1)",
            borderRadius: 10, borderWidth: 1, borderColor: "rgba(232,197,71,0.25)",
            padding: 10, marginTop: 10, marginBottom: 16, gap: 8,
          }}>
            <Zap size={14} color="#E8C547" />
            <Text style={{ color: "#E8C547", fontSize: 12 * scale, fontWeight: "600", flex: 1 }}>
              {t.dashboard.simpleModeOn}
            </Text>
          </View>
        ) : null}

        <View style={{ height: 1, backgroundColor: "#1C1C2E", marginTop: simpleMode ? 0 : 14, marginBottom: 20 }} />

        <Text style={{ fontSize: 11 * scale, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1.5, color: "#606070", marginBottom: 16 }}>
          {simpleMode ? t.dashboard.yourPracticeToday : t.dashboard.todaysPractice}
        </Text>

        {(["morning", "midday", "evening"] as BlockType[]).map((blockType) => (
          <BlockCard
            key={blockType}
            blockType={blockType}
            isCompleted={completionMap[blockType]}
            onPress={() => router.push({ pathname: "/timer", params: { blockType } })}
            simpleMode={simpleMode}
            scale={scale}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
