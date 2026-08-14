import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { defineSample } from '@/content/define';
import type { SampleRenderProps } from '@/content/types';
import { TAGS } from '@/lib/tags';

function Demo({ playToken }: SampleRenderProps) {
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const active = useSharedValue(0);

  // 再生ボタンで中央に戻す
  useEffect(() => {
    offsetX.value = withSpring(0);
    offsetY.value = withSpring(0);
  }, [playToken, offsetX, offsetY]);

  const pan = Gesture.Pan()
    .onBegin(() => {
      active.value = withSpring(1);
    })
    .onChange((event) => {
      // ジェスチャーのコールバックは UI スレッドで実行される
      offsetX.value += event.changeX;
      offsetY.value += event.changeY;
    })
    .onFinalize(() => {
      active.value = withSpring(0);
      offsetX.value = withSpring(0, { damping: 12, stiffness: 120 });
      offsetY.value = withSpring(0, { damping: 12, stiffness: 120 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: 1 + active.value * 0.12 },
    ],
    opacity: 0.85 + active.value * 0.15,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.box, animatedStyle]}>
        <Text style={styles.label}>drag me</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 104,
    height: 104,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
  },
  label: {
    color: '#F2F4FF',
    fontWeight: '700',
  },
});

export default defineSample({
  id: 'gesture-drag',
  title: 'ドラッグして離すと戻る',
  api: 'reanimated',
  summary: 'ジェスチャーで動かし、離したら withSpring で元の位置へ。指の動きに毎フレーム追従する。',
  tags: [TAGS.GESTURE, TAGS.SPRING],
  addedAt: '2026-08-11',
  controls: {
    duration: false,
    easing: false,
    disabledReason:
      '指の動きに追従する部分は時間で決まらず、戻る動きも withSpring（物理ベース）なので duration / easing は使わない。',
  },
  related: ['reanimated-shared-value'],
  code: `const pan = Gesture.Pan()
  .onChange((event) => {
    // UI スレッドで実行されるので JS が詰まってもカクつかない
    offsetX.value += event.changeX;
    offsetY.value += event.changeY;
  })
  .onFinalize(() => {
    offsetX.value = withSpring(0, { damping: 12, stiffness: 120 });
    offsetY.value = withSpring(0, { damping: 12, stiffness: 120 });
  });

<GestureDetector gesture={pan}>
  <Animated.View style={[styles.box, animatedStyle]} />
</GestureDetector>`,
  Demo,
});
