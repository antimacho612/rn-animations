import * as Haptics from 'expo-haptics';
import { useCallback, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import type { DurationControl, SampleDefinition } from '@/content/types';
import { DEFAULT_EASING, getEasingPreset, type EasingPreset } from '@/lib/easing-presets';

const DEFAULT_DURATION: DurationControl = { default: 800, min: 100, max: 3000 };

export type SamplePlayer = {
  playToken: number;
  duration: number;
  easing: EasingPreset;
  easingKey: string;
  playing: boolean;

  durationEnabled: boolean;
  durationConfig: DurationControl;
  easingEnabled: boolean;
  /** コントロールを無効にしている理由 */
  disabledReason?: string;

  replay: () => void;
  setDuration: (value: number) => void;
  setEasingKey: (key: string) => void;
  handlePlayStateChange: (playing: boolean) => void;
};

/**
 * サンプルの再生状態（再生トリガー / duration / easing）をまとめて扱うフック。
 * サンプル本体はここから渡される props を見るだけでよい。
 */
export function useSamplePlayer(sample: SampleDefinition): SamplePlayer {
  const durationControl = sample.controls?.duration;
  const durationEnabled = durationControl !== false;
  const durationConfig = durationControl ? durationControl : DEFAULT_DURATION;
  const easingEnabled = sample.controls?.easing !== false;

  const [duration, setDurationState] = useState(durationConfig.default);
  const [easingKey, setEasingKeyState] = useState(DEFAULT_EASING.key);
  const [playToken, setPlayToken] = useState(0);
  const [playing, setPlaying] = useState(false);

  const replay = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    setPlayToken((token) => token + 1);
  }, []);

  // 設定を変えたらその場で再生し直す（変化がすぐ分かるように）
  const setDuration = useCallback((value: number) => {
    setDurationState(Math.round(value));
    setPlayToken((token) => token + 1);
  }, []);

  const setEasingKey = useCallback((key: string) => {
    setEasingKeyState(key);
    setPlayToken((token) => token + 1);
  }, []);

  const easing = useMemo(() => getEasingPreset(easingKey), [easingKey]);

  return {
    playToken,
    duration,
    easing,
    easingKey,
    playing,
    durationEnabled,
    durationConfig,
    easingEnabled,
    disabledReason: sample.controls?.disabledReason,
    replay,
    setDuration,
    setEasingKey,
    handlePlayStateChange: setPlaying,
  };
}
