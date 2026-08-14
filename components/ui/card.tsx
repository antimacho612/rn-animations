import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '@/theme/theme-provider';

export type CardProps = ViewProps & {
  /** 面をひとつ沈める（コードブロックや設定行など） */
  tone?: 'surface' | 'alt';
  padded?: boolean;
};

export function Card({ tone = 'surface', padded = true, style, ...rest }: CardProps) {
  const { colors, radius, spacing } = useTheme();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: tone === 'alt' ? colors.surfaceAlt : colors.surface,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: padded ? spacing.lg : 0,
          shadowColor: colors.shadow,
        },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 1 },
      default: {},
    }),
  },
});
