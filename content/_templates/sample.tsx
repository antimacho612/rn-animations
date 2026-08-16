/**
 * アニメーションサンプルのテンプレート。
 *
 * 使い方:
 *   1. このファイルを content/samples/<animated-api|reanimated>/<id>.tsx にコピーする
 *   2. id / title / summary などを書き換える
 *   3. Demo の中身を実装する
 *
 * content/_templates/ は require.context の対象外なので、ここに置いたままでは一覧に出ない。
 */
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { defineSample } from '@/content/define';
import type { SampleRenderProps } from '@/content/types';

function Demo({ playToken, duration, easing }: SampleRenderProps) {
  const progress = useSharedValue(0);

  // playToken が変わったら最初から再生する
  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration, easing: easing.reanimated });
  }, [playToken, duration, easing, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  return <Animated.View style={[styles.box, animatedStyle]} />;
}

const styles = StyleSheet.create({
  box: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#8B5CF6',
  },
});

export default defineSample({
  id: 'template-sample',
  title: 'サンプルのタイトル',
  api: 'reanimated',
  summary: '一覧カードに出る 1〜2 行の説明。',
  tags: [],
  addedAt: '2026-01-01',
  controls: {
    // duration: false,          // ← spring 系などスライダーを無効にしたいとき
    // easing: false,
    // disabledReason: '無効にした理由をここに書くと注記として表示される',
    duration: { default: 800, min: 100, max: 3000 },
    easing: true,
  },
  // 関連するリファレンスの slug
  related: [],
  // 詳細ページに表示するソース抜粋（省略可）
  code: `progress.value = withTiming(1, { duration, easing });`,
  Demo,
});
