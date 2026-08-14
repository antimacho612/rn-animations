import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { PressableScale } from '@/components/ui/pressable-scale';
import { AppText } from '@/components/ui/text';
import type { ApiKind } from '@/content/types';
import { useTheme } from '@/theme/theme-provider';
import { accentFor } from '@/theme/tokens';

export type SampleStageProps = {
  api: ApiKind;
  height?: number;
  onReplay: () => void;
  /** 左上に出す小さなラベル（サンプル名など） */
  label?: string;
  contentStyle?: ViewStyle;
  children: React.ReactNode;
};

const GRID_STEP = 28;

/**
 * アニメーションを描画する「舞台」。
 * 方眼の背景を敷いているので、移動量や位置の変化が目で追いやすい。
 */
export function SampleStage({
  api,
  height = 220,
  onReplay,
  label,
  contentStyle,
  children,
}: SampleStageProps) {
  const { colors, radius, spacing } = useTheme();
  const accent = accentFor(colors, api);

  return (
    <View
      style={[
        styles.stage,
        {
          height,
          backgroundColor: colors.stage,
          borderRadius: radius.lg,
          borderColor: accent.fg,
        },
      ]}>
      <Grid color={colors.stageGrid} />

      {label ? (
        <AppText
          variant="caption"
          style={[styles.label, { color: colors.stageMuted, left: spacing.md, top: spacing.sm }]}>
          {label}
        </AppText>
      ) : null}

      <View style={[styles.content, contentStyle]}>{children}</View>

      <PressableScale
        onPress={onReplay}
        haptic
        scaleTo={0.88}
        accessibilityRole="button"
        accessibilityLabel="もう一度再生"
        style={[
          styles.replay,
          { backgroundColor: accent.fg, borderRadius: radius.pill, right: spacing.md, bottom: spacing.md },
        ]}>
        <MaterialIcons name="replay" size={20} color={colors.stage} />
      </PressableScale>
    </View>
  );
}

/** 方眼の背景。hairline を並べているだけなので描画コストは低い */
function Grid({ color }: { color: string }) {
  const lines = Array.from({ length: 14 }, (_, index) => index + 1);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {lines.map((index) => (
        <View
          key={`h-${index}`}
          style={[styles.hLine, { top: index * GRID_STEP, backgroundColor: color }]}
        />
      ))}
      {lines.map((index) => (
        <View
          key={`v-${index}`}
          style={[styles.vLine, { left: index * GRID_STEP, backgroundColor: color }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    overflow: 'hidden',
    borderWidth: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    position: 'absolute',
    letterSpacing: 0.6,
    zIndex: 1,
  },
  hLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  vLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
  },
  replay: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
