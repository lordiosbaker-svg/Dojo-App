import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, BookMarked } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ACC_PAPER, LEDGER_OVERVIEW, PTSD_MAPPING, DAILY_MANTRA, HOW_AND_WHY_MANUAL, GLOSSARY,
} from "@/lib/data/library-content";
import type { Paper, LedgerOverview, Mantra, Glossary } from "@/lib/data/library-content";
import { useDojoStore, TEXT_SCALE } from "@/lib/state/dojo-store";
import { useTranslation } from "@/lib/i18n";

type ContentMap = Record<string, Paper | LedgerOverview | Mantra | Glossary>;

const CONTENT_MAP: ContentMap = {
  acc_paper: ACC_PAPER,
  ledger:    LEDGER_OVERVIEW,
  ptsd:      PTSD_MAPPING,
  mantra:    DAILY_MANTRA,
  manual:    HOW_AND_WHY_MANUAL,
  glossary:  GLOSSARY,
};

function isMantra(content: Paper | LedgerOverview | Mantra | Glossary): content is Mantra {
  return "text" in content && "explanation" in content;
}

function isGlossary(content: Paper | LedgerOverview | Mantra | Glossary): content is Glossary {
  return "entries" in content && "intro" in content;
}

function hasSections(
  content: Paper | LedgerOverview | Mantra | Glossary
): content is Paper | LedgerOverview {
  return "sections" in content && "title" in content;
}

export default function ReaderScreen() {
  const { contentKey } = useLocalSearchParams<{ contentKey: string }>();
  const content  = contentKey ? CONTENT_MAP[contentKey] : undefined;
  const textSize   = useDojoStore((s) => s.textSize);
  const simpleMode = useDojoStore((s) => s.simpleMode);
  const scale      = TEXT_SCALE[textSize];
  const t          = useTranslation();

  const BackBar = ({ title }: { title: string }) => (
    <View style={{ flexDirection: "row", alignItems: "center", padding: 16, paddingBottom: 8 }}>
      <Pressable
        onPress={() => router.back()}
        testID="reader-back-button"
        style={{ padding: 8 }}
      >
        <ArrowLeft size={24} color="#E8E8F0" />
      </Pressable>
      <Text
        style={{
          color: "#E8E8F0",
          fontSize: 18 * scale,
          fontWeight: "600",
          marginLeft: 12,
          flex: 1,
        }}
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );

  if (!content) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0F" }} testID="reader-not-found">
        <BackBar title="Reader" />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#8888A0", fontSize: 16 * scale }}>Content not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isMantra(content)) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0F" }} testID="reader-screen">
        <BackBar title="Daily Mantra" />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingTop: 40 }}
          testID="reader-scroll"
        >
          <Text
            style={{
              color: "#E8C547",
              fontSize: 26 * scale,
              fontWeight: "700",
              fontStyle: "italic",
              textAlign: "center",
              lineHeight: 40 * scale,
              marginBottom: 32,
              paddingHorizontal: 8,
            }}
          >
            {content.text}
          </Text>
          <View style={{ backgroundColor: "#1C1C2E", borderRadius: 12, padding: 20 }}>
            <Text style={{ color: "#E8E8F0", fontSize: 15 * scale, lineHeight: 25 * scale }}>
              {content.explanation}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isGlossary(content)) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0F" }} testID="reader-screen">
        <BackBar title={content.title} />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20 }}
          testID="reader-scroll"
        >
          {/* Intro banner */}
          <View
            style={{
              backgroundColor: "#1C1C2E",
              borderRadius: 14,
              padding: 16,
              marginBottom: 24,
              flexDirection: "row",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <BookMarked size={20} color="#E8C547" style={{ marginTop: 2 }} />
            <Text style={{ color: "#8888A0", fontSize: 13 * scale, lineHeight: 20 * scale, flex: 1 }}>
              {content.intro}
            </Text>
          </View>

          {/* Simple mode banner */}
          {simpleMode ? (
            <View style={{ backgroundColor: "rgba(232,197,71,0.12)", borderRadius: 10, borderWidth: 1, borderColor: "rgba(232,197,71,0.3)", padding: 12, marginBottom: 20 }}>
              <Text style={{ color: "#E8C547", fontSize: 12 * scale, fontWeight: "600" }}>
                {t.glossary.simpleModeBanner}
              </Text>
            </View>
          ) : null}

          {/* Glossary entries — use translated terms/simple if available */}
          {content.entries.map((entry, index) => {
            const tEntry = t.glossary.entries[index];
            const displayTerm   = tEntry?.term   ?? entry.term;
            const displaySimple = tEntry?.simple ?? entry.simple;
            return (
            <View
              key={index}
              style={{
                backgroundColor: "#1C1C2E",
                borderRadius: 14,
                padding: 20,
                marginBottom: 14,
                borderLeftWidth: 3,
                borderLeftColor: "#E8C547",
              }}
            >
              <Text
                style={{
                  color: "#E8C547",
                  fontSize: 16 * scale,
                  fontWeight: "700",
                  marginBottom: 10,
                  lineHeight: 22 * scale,
                }}
              >
                {displayTerm}
              </Text>

              {simpleMode ? (
                /* Simple mode: only show short definition */
                <Text style={{ color: "#E8E8F0", fontSize: 14 * scale, lineHeight: 22 * scale }}>
                  {displaySimple}
                </Text>
              ) : (
                /* Full mode: show simple as intro, full as details */
                <>
                  <View
                    style={{
                      backgroundColor: "rgba(232,197,71,0.08)",
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 12,
                    }}
                  >
                    <Text style={{ color: "#C8A840", fontSize: 13 * scale, lineHeight: 20 * scale, fontStyle: "italic" }}>
                      {displaySimple}
                    </Text>
                  </View>
                  <Text style={{ color: "#B8B8C8", fontSize: 14 * scale, lineHeight: 23 * scale }}>
                    {entry.full}
                  </Text>
                </>
              )}
            </View>
            );
          })}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (hasSections(content)) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0F" }} testID="reader-screen">
        <BackBar title={content.title} />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20 }}
          testID="reader-scroll"
        >
          <Text
            style={{
              color: "#E8E8F0",
              fontSize: 24 * scale,
              fontWeight: "700",
              lineHeight: 32 * scale,
              marginBottom: 24,
            }}
          >
            {content.title}
          </Text>
          {content.sections.map(
            (section: { heading: string; content: string }, index: number) => (
              <View key={section.heading} style={{ marginBottom: 24 }}>
                <View style={{ backgroundColor: "#1C1C2E", borderRadius: 12, padding: 20 }}>
                  <Text
                    style={{
                      color: "#E8C547",
                      fontSize: 18 * scale,
                      fontWeight: "700",
                      lineHeight: 26 * scale,
                      marginBottom: 12,
                    }}
                  >
                    {section.heading}
                  </Text>
                  <Text
                    style={{
                      color: "#E8E8F0",
                      fontSize: 15 * scale,
                      lineHeight: 25 * scale,
                    }}
                  >
                    {simpleMode
                      ? section.content.split('\n\n')[0] // show only first paragraph in simple mode
                      : section.content}
                  </Text>
                  {simpleMode && section.content.includes('\n\n') ? (
                    <Text style={{ color: "#8888A0", fontSize: 12 * scale, marginTop: 8, fontStyle: "italic" }}>
                      (Tap off Simple Mode in Settings to read the full section)
                    </Text>
                  ) : null}
                </View>
                {index < content.sections.length - 1 ? (
                  <View style={{ height: 1, backgroundColor: "#1C1C2E", marginTop: 24 }} />
                ) : null}
              </View>
            )
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}
