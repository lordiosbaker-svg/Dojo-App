import React, { useCallback, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Animated as RNAnimated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  BookOpen,
  Brain,
  FileText,
  Users,
  Heart,
  ChevronRight,
  BookMarked,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useDojoStore, TEXT_SCALE } from '@/lib/state/dojo-store';
import { useTranslation } from '@/lib/i18n';

interface LibraryItem {
  title: string;
  description: string;
  icon: LucideIcon;
  contentKey: string;
  accent?: string;
}

const LIBRARY_ITEMS: LibraryItem[] = [
  {
    title: 'ACC Paper',
    description: 'The neuroscience of error detection and mental calibration',
    icon: Brain,
    contentKey: 'acc_paper',
  },
  {
    title: 'V3.0 Ledger',
    description: 'Complete daily protocol overview',
    icon: FileText,
    contentKey: 'ledger',
  },
  {
    title: 'PTSD & Population Mapping',
    description: 'Applications for veterans, inmates, and space',
    icon: Users,
    contentKey: 'ptsd',
  },
  {
    title: 'Daily Mantra',
    description: 'Your guiding principle and its meaning',
    icon: Heart,
    contentKey: 'mantra',
  },
  {
    title: 'How + Why Manual',
    description: 'Practical guide to the Dojo method',
    icon: BookOpen,
    contentKey: 'manual',
  },
  {
    title: 'Glossary',
    description: 'Plain-English definitions: ACC, ERN, HOS, and more',
    icon: BookMarked,
    contentKey: 'glossary',
    accent: '#7B68EE',
  },
];

function LibraryCard({ item }: { item: LibraryItem }) {
  const router = useRouter();
  const scaleAnim = useRef(new RNAnimated.Value(1)).current;
  const Icon = item.icon;
  const accent = item.accent ?? '#E8C547';
  const textSize = useDojoStore((s) => s.textSize);
  const scale = TEXT_SCALE[textSize];
  const t = useTranslation();
  const itemT = t.library.items[item.contentKey];

  const handlePressIn = useCallback(() => {
    RNAnimated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    RNAnimated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handlePress = useCallback(() => {
    router.push({
      pathname: '/reader',
      params: { contentKey: item.contentKey },
    });
  }, [router, item.contentKey]);

  return (
    <RNAnimated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        testID={`library-card-${item.contentKey}`}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="mb-3"
      >
        <View
          className="flex-row items-center rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#1C1C2E' }}
        >
          {/* Accent line */}
          <View className="w-1 self-stretch" style={{ backgroundColor: accent }} />

          {/* Icon */}
          <View className="pl-4 pr-3 py-5">
            <Icon size={24} color={accent} />
          </View>

          {/* Text content */}
          <View className="flex-1 py-5 pr-2">
            <Text
              className="font-semibold mb-1"
              style={{ color: '#E8E8F0', fontSize: 15 * scale }}
            >
              {itemT?.title ?? item.title}
            </Text>
            <Text
              style={{ color: '#8888A0', fontSize: 13 * scale }}
            >
              {itemT?.description ?? item.description}
            </Text>
          </View>

          {/* Chevron */}
          <View className="pr-4">
            <ChevronRight size={20} color="#8888A0" />
          </View>
        </View>
      </Pressable>
    </RNAnimated.View>
  );
}

export default function LibraryScreen() {
  const textSize = useDojoStore((s) => s.textSize);
  const scale = TEXT_SCALE[textSize];
  const t = useTranslation();

  return (
    <SafeAreaView
      testID="library-screen"
      className="flex-1"
      style={{ backgroundColor: '#0A0A0F' }}
    >
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-6">
        <BookOpen size={28} color="#E8C547" />
        <Text
          className="font-bold ml-3"
          style={{ color: '#E8E8F0', fontSize: 28 * scale }}
        >
          {t.library.header}
        </Text>
      </View>

      {/* Scrollable card list */}
      <ScrollView
        testID="library-scroll"
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {LIBRARY_ITEMS.map((item) => (
          <LibraryCard key={item.contentKey} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
