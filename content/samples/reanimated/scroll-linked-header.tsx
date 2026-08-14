import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { defineSample } from '@/content/define';
import type { SampleRenderProps } from '@/content/types';
import { TAGS } from '@/lib/tags';

const ROWS = Array.from({ length: 8 }, (_, index) => index);

function Demo({ playToken }: SampleRenderProps) {
  const scrollRef = useRef<Animated.ScrollView>(null);
  const scrollY = useSharedValue(0);

  // 再生ボタンで先頭までスクロールを戻す
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [playToken]);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => ({
    height: interpolate(scrollY.value, [0, 40], [72, 40], Extrapolation.CLAMP),
  }));

  const titleStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(scrollY.value, [0, 40], [18, 14], Extrapolation.CLAMP),
    opacity: interpolate(scrollY.value, [0, 40], [1, 0.6], Extrapolation.CLAMP),
  }));

  return (
    <View style={styles.frame}>
      <Animated.View style={[styles.header, headerStyle]}>
        <Animated.Text style={[styles.title, titleStyle]}>Header</Animated.Text>
      </Animated.View>
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}>
        {ROWS.map((row) => (
          <View key={row} style={styles.row} />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: 200,
    height: 144,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#12131A',
  },
  header: {
    justifyContent: 'flex-end',
    paddingHorizontal: 14,
    paddingBottom: 8,
    backgroundColor: '#6366F1',
  },
  title: {
    color: '#F2F4FF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 8,
  },
  row: {
    height: 22,
    borderRadius: 6,
    backgroundColor: '#1F2130',
  },
});

export default defineSample({
  id: 'scroll-linked-header',
  title: 'スクロールに連動するヘッダー',
  api: 'reanimated',
  summary: 'useAnimatedScrollHandler でスクロール位置を読み取り、ヘッダーの高さと文字サイズを追従させる。',
  tags: [TAGS.SCROLL, TAGS.INTERPOLATE],
  addedAt: '2026-08-14',
  controls: {
    duration: false,
    easing: false,
    disabledReason:
      'スクロール量で決まる値なので時間ベースの duration / easing は使わない。再生ボタンは先頭までスクロールを戻す。',
  },
  related: ['interpolate', 'reanimated-shared-value'],
  code: `const scrollHandler = useAnimatedScrollHandler((event) => {
  scrollY.value = event.contentOffset.y;
});

const headerStyle = useAnimatedStyle(() => ({
  height: interpolate(scrollY.value, [0, 40], [72, 40], Extrapolation.CLAMP),
}));

<Animated.ScrollView ref={scrollRef} onScroll={scrollHandler} scrollEventThrottle={16}>
  <Animated.View style={[styles.header, headerStyle]} />
</Animated.ScrollView>`,
  Demo,
});
