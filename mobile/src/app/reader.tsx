import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ACC_PAPER,
  LEDGER_OVERVIEW,
  PTSD_MAPPING,
  DAILY_MANTRA,
  HOW_AND_WHY_MANUAL,
} from "@/lib/data/library-content";
import type {
  Paper,
  LedgerOverview,
  Mantra,
} from "@/lib/data/library-content";

type ContentMap = Record<string, Paper | LedgerOverview | Mantra>;

const CONTENT_MAP: ContentMap = {
  acc_paper: ACC_PAPER,
  ledger: LEDGER_OVERVIEW,
  ptsd: PTSD_MAPPING,
  mantra: DAILY_MANTRA,
  manual: HOW_AND_WHY_MANUAL,
};

function isMantra(content: Paper | LedgerOverview | Mantra): content is Mantra {
  return "text" in content && "explanation" in content;
}

function hasSections(
  content: Paper | LedgerOverview | Mantra
): content is Paper | LedgerOverview {
  return "sections" in content && "title" in content;
}

export default function ReaderScreen() {
  const { contentKey } = useLocalSearchParams<{ contentKey: string }>();
  const content = contentKey ? CONTENT_MAP[contentKey] : undefined;

  if (!content) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#0A0A0F" }}
        testID="reader-not-found"
      >
        <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
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
              fontSize: 18,
              fontWeight: "600",
              marginLeft: 12,
            }}
          >
            Reader
          </Text>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#8888A0", fontSize: 16 }}>
            Content not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isMantra(content)) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#0A0A0F" }}
        testID="reader-screen"
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            paddingBottom: 8,
          }}
        >
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
              fontSize: 18,
              fontWeight: "600",
              marginLeft: 12,
            }}
          >
            Daily Mantra
          </Text>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingTop: 40 }}
          testID="reader-scroll"
        >
          <Text
            style={{
              color: "#E8C547",
              fontSize: 28,
              fontWeight: "700",
              fontStyle: "italic",
              textAlign: "center",
              lineHeight: 40,
              marginBottom: 32,
              paddingHorizontal: 8,
            }}
          >
            {content.text}
          </Text>
          <View
            style={{
              backgroundColor: "#1C1C2E",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Text
              style={{
                color: "#E8E8F0",
                fontSize: 16,
                lineHeight: 26,
              }}
            >
              {content.explanation}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (hasSections(content)) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#0A0A0F" }}
        testID="reader-screen"
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            paddingBottom: 8,
          }}
        >
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
              fontSize: 18,
              fontWeight: "600",
              marginLeft: 12,
              flex: 1,
            }}
            numberOfLines={1}
          >
            {content.title}
          </Text>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20 }}
          testID="reader-scroll"
        >
          <Text
            style={{
              color: "#E8E8F0",
              fontSize: 26,
              fontWeight: "700",
              lineHeight: 34,
              marginBottom: 24,
            }}
          >
            {content.title}
          </Text>
          {content.sections.map(
            (section: { heading: string; content: string }, index: number) => (
              <View key={section.heading} style={{ marginBottom: 24 }}>
                <View
                  style={{
                    backgroundColor: "#1C1C2E",
                    borderRadius: 12,
                    padding: 20,
                  }}
                >
                  <Text
                    style={{
                      color: "#E8C547",
                      fontSize: 20,
                      fontWeight: "700",
                      lineHeight: 28,
                      marginBottom: 12,
                    }}
                  >
                    {section.heading}
                  </Text>
                  <Text
                    style={{
                      color: "#E8E8F0",
                      fontSize: 16,
                      lineHeight: 26,
                    }}
                  >
                    {section.content}
                  </Text>
                </View>
                {index < content.sections.length - 1 ? (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#1C1C2E",
                      marginTop: 24,
                    }}
                  />
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
