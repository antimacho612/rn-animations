import { View } from 'react-native';

import { SampleControls } from '@/components/sample/sample-controls';
import { SampleStage } from '@/components/sample/sample-stage';
import { useSamplePlayer } from '@/components/sample/use-sample-player';
import type { SampleDefinition } from '@/content/types';
import { useTheme } from '@/theme/theme-provider';

export type SamplePlayerViewProps = {
  sample: SampleDefinition;
  /** リファレンス埋め込みなどの省スペース表示 */
  compact?: boolean;
  stageHeight?: number;
  stageLabel?: string;
};

/**
 * ステージ + コントロールのひとまとまり。
 * サンプル詳細ページでもリファレンス本文の埋め込みでも同じものを使う。
 */
export function SamplePlayerView({
  sample,
  compact = false,
  stageHeight,
  stageLabel,
}: SamplePlayerViewProps) {
  const player = useSamplePlayer(sample);
  const { spacing } = useTheme();

  return (
    <View style={{ gap: compact ? spacing.md : spacing.lg }}>
      <SampleStage
        api={sample.api}
        height={stageHeight ?? (compact ? 180 : 240)}
        onReplay={player.replay}
        label={stageLabel}>
        <sample.Demo
          playToken={player.playToken}
          duration={player.duration}
          easing={player.easing}
          onPlayStateChange={player.handlePlayStateChange}
        />
      </SampleStage>

      <SampleControls player={player} compact={compact} />
    </View>
  );
}
