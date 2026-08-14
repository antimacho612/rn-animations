import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

import { defineSample } from '@/content/define';
import type { SampleRenderProps } from '@/content/types';

const ITEMS = [0, 1, 2, 3];
const COLORS = ['#8B5CF6', '#6366F1', '#22D3EE', '#34D399'];

function Demo({ playToken, duration, easing }: SampleRenderProps) {
  const [visible, setVisible] = useState<number[]>([]);

  // いったん空にしてから並べ直すと entering がもう一度走る
  useEffect(() => {
    setVisible([]);
    const timer = setTimeout(() => setVisible(ITEMS), 80);
    return () => clearTimeout(timer);
  }, [playToken]);

  return (
    <Animated.View layout={LinearTransition.duration(duration)} style={styles.row}>
      {visible.map((index) => (
        <Animated.View
          key={index}
          entering={FadeInDown.delay(index * (duration / 6))
            .duration(duration / 2)
            .easing(easing.reanimated)}
          exiting={FadeOut.duration(160)}
          style={[styles.card, { backgroundColor: COLORS[index] }]}
        />
      ))}
      {visible.length === 0 ? <View style={styles.placeholder} /> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 12,
    minHeight: 96,
  },
  card: {
    width: 44,
    height: 76,
    borderRadius: 12,
  },
  placeholder: {
    height: 76,
  },
});

export default defineSample({
  id: 'layout-entering',
  title: 'レイアウトアニメーション（entering）',
  api: 'reanimated',
  summary: 'マウント時の登場アニメーションを 1 行で。delay をずらすと気持ちよく並ぶ。',
  tags: ['layout animation', 'entering'],
  addedAt: '2026-08-12',
  controls: {
    duration: { default: 900, min: 300, max: 3000 },
    easing: true,
  },
  related: ['reanimated-shared-value'],
  code: `<Animated.View
  entering={FadeInDown.delay(index * 150)
    .duration(450)
    .easing(Easing.out(Easing.cubic))}
  exiting={FadeOut.duration(160)}
/>

// 親に layout を付けると、要素の増減に合わせて位置がなめらかに動く
<Animated.View layout={LinearTransition.duration(900)} />`,
  Demo,
});
