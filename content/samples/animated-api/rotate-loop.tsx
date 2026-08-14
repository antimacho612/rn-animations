import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { defineSample } from '@/content/define';
import type { SampleRenderProps } from '@/content/types';

function Demo({ playToken, duration, easing }: SampleRenderProps) {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    rotate.setValue(0);
    const loop = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration,
        easing: easing.animated,
        useNativeDriver: true,
      })
    );
    loop.start();

    // playToken / duration / easing が変わったら古いループを止めてから作り直す
    return () => loop.stop();
  }, [playToken, duration, easing, rotate]);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={[styles.badge, { transform: [{ rotate: spin }] }]}>
      <Text style={styles.label}>loop</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 96,
    height: 96,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default defineSample({
  id: 'rotate-loop',
  title: '無限回転ループ（loop）',
  api: 'animated',
  summary: 'Animated.loop で timing を無限に繰り返す。スピナーなどの基本形。',
  tags: ['loop', 'transform'],
  addedAt: '2026-08-14',
  controls: {
    duration: { default: 2000, min: 500, max: 5000 },
    easing: true,
  },
  related: ['animated-api-basics', 'loop-animations'],
  code: `const rotate = useRef(new Animated.Value(0)).current;

useEffect(() => {
  rotate.setValue(0);
  const loop = Animated.loop(
    Animated.timing(rotate, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  );
  loop.start();

  // アンマウントや再実行のタイミングで確実に止める
  return () => loop.stop();
}, [playToken]);

const spin = rotate.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
});`,
  Demo,
});
