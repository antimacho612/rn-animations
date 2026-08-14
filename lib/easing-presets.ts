import { Easing as RNEasing, type EasingFunction } from 'react-native';
import { Easing as REasing } from 'react-native-reanimated';

/**
 * Animated API と Reanimated の両方で使える easing プリセット。
 * どちらの `Easing` もほぼ同じ API を持つので、1 テーブルで吸収している。
 */
export type EasingPreset = {
  key: string;
  label: string;
  /** 補足説明（コントロール下部に表示） */
  hint: string;
  /** react-native の Animated 用 */
  animated: EasingFunction;
  /** react-native-reanimated 用 */
  reanimated: (value: number) => number;
};

export const EASING_PRESETS: EasingPreset[] = [
  {
    key: 'linear',
    label: 'linear',
    hint: '等速。加減速がないので機械的に見える',
    animated: RNEasing.linear,
    reanimated: REasing.linear,
  },
  {
    key: 'ease',
    label: 'ease',
    hint: 'RN の既定。ゆるやかに加速してゆるやかに減速',
    animated: RNEasing.ease,
    reanimated: REasing.ease,
  },
  {
    key: 'easeIn',
    label: 'ease-in',
    hint: 'ゆっくり始まって加速。画面外へ去る動きに向く',
    animated: RNEasing.in(RNEasing.cubic),
    reanimated: REasing.in(REasing.cubic),
  },
  {
    key: 'easeOut',
    label: 'ease-out',
    hint: '速く始まって減速。画面に入る動きに向く',
    animated: RNEasing.out(RNEasing.cubic),
    reanimated: REasing.out(REasing.cubic),
  },
  {
    key: 'easeInOut',
    label: 'ease-in-out',
    hint: '両端がなめらか。位置移動の定番',
    animated: RNEasing.inOut(RNEasing.cubic),
    reanimated: REasing.inOut(REasing.cubic),
  },
  {
    key: 'standard',
    label: 'standard',
    hint: 'Material の標準カーブ cubic-bezier(0.4, 0, 0.2, 1)',
    animated: RNEasing.bezier(0.4, 0, 0.2, 1),
    reanimated: REasing.bezier(0.4, 0, 0.2, 1).factory(),
  },
  {
    key: 'back',
    label: 'back',
    hint: '行き過ぎてから戻る。少しコミカルな印象',
    animated: RNEasing.out(RNEasing.back(2)),
    reanimated: REasing.out(REasing.back(2)),
  },
  {
    key: 'bounce',
    label: 'bounce',
    hint: '着地して弾む。落下の表現に',
    animated: RNEasing.bounce,
    reanimated: REasing.bounce,
  },
  {
    key: 'elastic',
    label: 'elastic',
    hint: 'ばねのように揺れて収束する',
    animated: RNEasing.elastic(1.2),
    reanimated: REasing.elastic(1.2),
  },
];

export const DEFAULT_EASING = EASING_PRESETS.find((preset) => preset.key === 'easeInOut')!;

export function getEasingPreset(key: string | undefined): EasingPreset {
  return EASING_PRESETS.find((preset) => preset.key === key) ?? DEFAULT_EASING;
}
