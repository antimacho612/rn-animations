import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { defineSample } from '@/content/define';
import type { SampleRenderProps } from '@/content/types';

const DISTANCE = 70;

function Demo({ playToken, duration, easing }: SampleRenderProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    translateX.setValue(0);
    translateY.setValue(0);
    rotate.setValue(0);

    const step = duration / 3;
    const options = { duration: step, easing: easing.animated, useNativeDriver: true };

    Animated.sequence([
      // 右へ
      Animated.timing(translateX, { toValue: DISTANCE, ...options }),
      // 下へ移動しながら回転（parallel で同時に走らせる）
      Animated.parallel([
        Animated.timing(translateY, { toValue: DISTANCE / 2, ...options }),
        Animated.timing(rotate, { toValue: 1, ...options }),
      ]),
      // 出発点へ戻る
      Animated.parallel([
        Animated.timing(translateX, { toValue: 0, ...options }),
        Animated.timing(translateY, { toValue: 0, ...options }),
      ]),
    ]).start();
  }, [playToken, duration, easing, translateX, translateY, rotate]);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <View style={styles.field}>
      <Animated.View
        style={[styles.box, { transform: [{ translateX }, { translateY }, { rotate: spin }] }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FBBF24',
  },
});

export default defineSample({
  id: 'translate-sequence',
  title: '連続移動（sequence / parallel）',
  api: 'animated',
  summary: 'sequence で順番に、parallel で同時に。複数のアニメーションを組み合わせる。',
  tags: ['transform', '合成'],
  addedAt: '2026-08-14',
  controls: {
    duration: { default: 1200, min: 300, max: 4000 },
    easing: true,
  },
  related: ['animated-api-basics'],
  code: `Animated.sequence([
  Animated.timing(translateX, { toValue: 70, ...options }),
  Animated.parallel([
    Animated.timing(translateY, { toValue: 35, ...options }),
    Animated.timing(rotate, { toValue: 1, ...options }),
  ]),
  Animated.parallel([
    Animated.timing(translateX, { toValue: 0, ...options }),
    Animated.timing(translateY, { toValue: 0, ...options }),
  ]),
]).start();

// 数値 → 文字列の変換は interpolate で行う
const spin = rotate.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '180deg'],
});`,
  Demo,
});
