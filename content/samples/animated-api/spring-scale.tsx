import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { defineSample } from '@/content/define';
import type { SampleRenderProps } from '@/content/types';
import { TAGS } from '@/lib/tags';

function Demo({ playToken }: SampleRenderProps) {
  const scale = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    scale.setValue(0.4);
    // spring は「時間」ではなく物理パラメータで動きが決まる
    Animated.spring(scale, {
      toValue: 1,
      friction: 4, // 抵抗。小さいほど揺れる
      tension: 80, // ばねの強さ
      useNativeDriver: true,
    }).start();
  }, [playToken, scale]);

  return (
    <Animated.View style={[styles.bubble, { transform: [{ scale }] }]}>
      <Text style={styles.label}>spring</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F97316',
  },
  label: {
    color: '#1B1206',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default defineSample({
  id: 'spring-scale',
  title: 'ばねで拡大（spring）',
  api: 'animated',
  summary: 'timing とは違い、duration も easing も取らない物理ベースのアニメーション。',
  tags: [TAGS.SPRING, TAGS.TRANSFORM],
  addedAt: '2026-08-13',
  controls: {
    duration: false,
    easing: false,
    disabledReason:
      'Animated.spring は friction / tension などの物理パラメータで動きが決まるため、duration と easing は指定できない。',
  },
  related: ['animated-api-basics'],
  code: `Animated.spring(scale, {
  toValue: 1,
  friction: 4, // 抵抗。小さいほど揺れる
  tension: 80, // ばねの強さ
  useNativeDriver: true,
}).start();`,
  Demo,
});
