import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { PressableScale } from '@/components/ui/pressable-scale';
import { useTheme } from '@/theme/theme-provider';

export type ChipProps = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  /** 選択色を上書きする（API バッジなど） */
  accent?: string;
  onPress?: () => void;
};

export function Chip({ label, selected = false, disabled = false, accent, onPress }: ChipProps) {
  const { colors, radius, spacing } = useTheme();
  const activeColor = accent ?? colors.brand;

  const content = (
    <View
      style={[
        styles.chip,
        {
          borderRadius: radius.pill,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs + 2,
          backgroundColor: selected ? activeColor : colors.surfaceAlt,
          borderColor: selected ? activeColor : colors.border,
          opacity: disabled ? 0.4 : 1,
        },
      ]}>
      <AppText
        variant="caption"
        style={[
          styles.label,
          { color: selected ? colors.surface : colors.textMuted },
          selected && styles.labelSelected,
        ]}>
        {label}
      </AppText>
    </View>
  );

  if (!onPress || disabled) return content;

  return (
    <PressableScale scaleTo={0.94} onPress={onPress} accessibilityRole="button">
      {content}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '600',
  },
  labelSelected: {
    fontWeight: '700',
  },
});
