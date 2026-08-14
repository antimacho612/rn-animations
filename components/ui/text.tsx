import { StyleSheet, Text, type TextProps } from 'react-native';

import { useTheme } from '@/theme/theme-provider';
import type { ThemeColors } from '@/theme/tokens';

export type TextVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'mono';

export type AppTextProps = TextProps & {
  variant?: TextVariant;
  /** テーマ配色のキー。未指定は variant ごとの既定色 */
  color?: keyof Pick<ThemeColors, 'text' | 'textMuted' | 'textFaint' | 'brand' | 'onBrand'>;
};

export function AppText({ variant = 'body', color, style, ...rest }: AppTextProps) {
  const { colors, fonts } = useTheme();
  const defaultColor: AppTextProps['color'] =
    variant === 'caption' ? 'textMuted' : variant === 'mono' ? 'textMuted' : 'text';

  return (
    <Text
      style={[
        styles[variant],
        variant === 'mono' && { fontFamily: fonts.mono },
        { color: colors[color ?? defaultColor] },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  display: { fontSize: 32, lineHeight: 38, fontWeight: '800', letterSpacing: -0.5 },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700', letterSpacing: -0.3 },
  heading: { fontSize: 19, lineHeight: 25, fontWeight: '700' },
  subheading: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 23 },
  bodyStrong: { fontSize: 15, lineHeight: 23, fontWeight: '600' },
  caption: { fontSize: 12.5, lineHeight: 18 },
  mono: { fontSize: 13, lineHeight: 19 },
});
