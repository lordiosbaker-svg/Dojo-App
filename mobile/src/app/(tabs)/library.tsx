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
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

interface LibraryItem {
  title: string;
  description: string;
  icon: LucideIcon;
  contentKey: string;
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
];

function LibraryCard({ item }: { item: LibraryItem }) {
  const router = useRouter();
  const scaleAnim = useRef(new RNAnimated.Value(1)).current;
  const Icon = item.icon;

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
          {/* Gold accent line */}
          <View
            className="w-1 self-stretch"
            style={{ backgroundColor: '#E8C547' }}
          />

          {/* Icon */}
          <View className="pl-4 pr-3 py-5">
            <Icon size={24} color="#E8C547" />
          </View>

          {/* Text content */}
          <View className="flex-1 py-5 pr-2">
            <Text
              className="text-base font-semibold mb-1"
              style={{ color: '#E8E8F0' }}
            >
              {item.title}
            </Text>
            <Text
              className="text-sm"
              style={{ color: '#8888A0' }}
            >
              {item.description}
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
          className="text-3xl font-bold ml-3"
          style={{ color: '#E8E8F0' }}
        >
          Library
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
