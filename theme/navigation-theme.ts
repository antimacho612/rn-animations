import { DarkTheme, DefaultTheme, type Theme as NavTheme } from '@react-navigation/native';

import type { ColorScheme, ThemeColors } from '@/theme/tokens';

/** デザイントークンから React Navigation のテーマを組み立てる */
export function toNavigationTheme(scheme: ColorScheme, colors: ThemeColors): NavTheme {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    dark: scheme === 'dark',
    colors: {
      ...base.colors,
      primary: colors.brand,
      background: colors.bg,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.brandAlt,
    },
  };
}
