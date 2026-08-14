import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { defineSample } from '@/content/define';
import type { SampleRenderProps } from '@/content/types';
import { TAGS } from '@/lib/tags';

function Demo({ playToken, duration, easing }: SampleRenderProps) {
  // アニメーション対象の値を定義
  const opacity = useSharedValue(0);

  // アニメーションスタイルを定義
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));

  useEffect(() => {
    opacity.value = 0;

    // アニメーションの開始
    opacity.value = withTiming(1, { duration, easing: easing.reanimated });
  }, [playToken, duration, easing, opacity]);

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Text style={styles.label}>Fade In</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 28,
    paddingVertical: 20,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
  },
  label: {
    color: '#ececec',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default defineSample({
  id: 'fade-in-reanimated',
  title: 'フェードイン',
  api: 'reanimated',
  summary: 'opacity を 0 → 1 に変化させる、Reanimated の最小構成。',
  tags: [TAGS.OPACITY],
  addedAt: '2026-08-14',
  controls: {
    duration: { default: 800, min: 100, max: 3000 },
    easing: true,
  },
  related: ['reanimated-shared-value', 'easing-basics'],
  // 詳細ページに表示するソース抜粋（省略可）
  code: `// アニメーション対象の値を定義
const progress = useSharedValue(0);

// アニメーションスタイルを定義
const animatedStyle = useAnimatedStyle(() => ({
  opacity: progress.value
}));

useEffect(() => {
  // アニメーションの開始
  progress.value = withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.cubic) });
}, [playToken]);

return <Animated.View style={{ animatedStyle }} />;`,
  Demo,
});
