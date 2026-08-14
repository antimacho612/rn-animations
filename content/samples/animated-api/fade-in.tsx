import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { defineSample } from '@/content/define';
import type { SampleRenderProps } from '@/content/types';
import { TAGS } from '@/lib/tags';

function Demo({ playToken, duration, easing }: SampleRenderProps) {
  // 1. アニメーションさせたい値を Animated.Value で持つ
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 2. 値の変化のしかたを定義して start() する
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      easing: easing.animated,
      useNativeDriver: true,
    }).start();
  }, [playToken, duration, easing, opacity]);

  // 3. 対象を Animated.View でラップして値を流し込む
  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <Text style={styles.label}>Fade In</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 28,
    paddingVertical: 20,
    borderRadius: 16,
    backgroundColor: '#F59E0B',
  },
  label: {
    color: '#1B1206',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default defineSample({
  id: 'fade-in',
  title: 'フェードイン',
  api: 'animated',
  summary: 'opacity を 0 → 1 に変化させる、Animated API の最小構成。',
  tags: [TAGS.OPACITY],
  addedAt: '2026-08-14',
  controls: {
    duration: { default: 800, min: 100, max: 3000 },
    easing: true,
  },
  related: ['animated-api-basics', 'use-native-driver'],
  code: `const opacity = useRef(new Animated.Value(0)).current;

useEffect(() => {
  opacity.setValue(0);
  Animated.timing(opacity, {
    toValue: 1,
    duration,
    easing: Easing.inOut(Easing.cubic),
    useNativeDriver: true,
  }).start();
}, [playToken]);

return <Animated.View style={{ opacity }} />;`,
  Demo,
});
