import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { defineSample } from '@/content/define';
import type { SampleRenderProps } from '@/content/types';

function Demo({ playToken, duration, easing }: SampleRenderProps) {
  // Shared Value は UI スレッド側に住む値。React の state とは別物
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration, easing: easing.reanimated });
  }, [playToken, duration, easing, progress]);

  // 1 本の progress から複数のスタイルを派生させる
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [-70, 70]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, 90])}deg` },
    ],
    borderRadius: interpolate(progress.value, [0, 1], [12, 34]),
    backgroundColor: interpolateColor(progress.value, [0, 1], ['#8B5CF6', '#22D3EE']),
  }));

  return <Animated.View style={[styles.box, animatedStyle]} />;
}

const styles = StyleSheet.create({
  box: {
    width: 68,
    height: 68,
  },
});

export default defineSample({
  id: 'shared-value-box',
  title: 'Shared Value ひとつで動かす',
  api: 'reanimated',
  summary: '0 → 1 の progress から位置・角度・角丸・色をまとめて派生させる。',
  tags: ['useSharedValue', 'interpolate'],
  addedAt: '2026-08-14',
  controls: {
    duration: { default: 900, min: 100, max: 3000 },
    easing: true,
  },
  related: ['reanimated-shared-value', 'easing-basics'],
  code: `const progress = useSharedValue(0);

useEffect(() => {
  progress.value = 0;
  progress.value = withTiming(1, { duration, easing });
}, [playToken]);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [
    { translateX: interpolate(progress.value, [0, 1], [-70, 70]) },
    { rotate: \`\${interpolate(progress.value, [0, 1], [0, 90])}deg\` },
  ],
  borderRadius: interpolate(progress.value, [0, 1], [12, 34]),
  backgroundColor: interpolateColor(progress.value, [0, 1], ['#8B5CF6', '#22D3EE']),
}));`,
  Demo,
});
