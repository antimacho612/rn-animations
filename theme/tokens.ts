import { Platform } from 'react-native';

/**
 * アプリ全体のデザイントークン。
 * 色は light / dark の 2 セットを同じキーで持ち、`useTheme().colors` から参照する。
 */

export type ColorScheme = 'light' | 'dark';

const palette = {
  brand: '#6366F1', // indigo-500
  brandAlt: '#A855F7', // purple-500
  animated: '#F59E0B', // amber-500  … Animated API
  reanimated: '#8B5CF6', // violet-500 … react-native-reanimated
};

const light = {
  /** 画面の下地 */
  bg: '#F6F7FB',
  /** カードなどの面 */
  surface: '#FFFFFF',
  /** 面の一段沈んだ領域（コードブロック、入力欄など） */
  surfaceAlt: '#EEF0F6',
  /** 境界線 */
  border: '#DFE3EC',
  borderStrong: '#C7CCDA',

  text: '#161A22',
  textMuted: '#5B6478',
  textFaint: '#8A93A6',

  brand: palette.brand,
  brandAlt: palette.brandAlt,
  /** ブランドカラーの淡い背景（バッジなど） */
  brandSoft: '#E7E9FE',
  onBrand: '#FFFFFF',

  animated: '#B45309',
  animatedSoft: '#FEF0DC',
  reanimated: '#6D28D9',
  reanimatedSoft: '#EDE6FE',

  /** アニメーションを描画するステージ */
  stage: '#101725',
  stageGrid: 'rgba(255,255,255,0.055)',
  stageText: '#E6EAF2',
  stageMuted: '#8E9AAF',

  shadow: '#0F172A',

  code: {
    bg: '#0E1420',
    text: '#D7DEEA',
    comment: '#6B7A90',
    keyword: '#C792EA',
    string: '#A5E6A0',
    number: '#F7A76C',
    fn: '#7FD3F7',
    tag: '#FF9CAC',
    punctuation: '#8B97AB',
  },
};

const dark: typeof light = {
  bg: '#0A0E16',
  surface: '#131926',
  surfaceAlt: '#1B2231',
  border: '#242C3D',
  borderStrong: '#333D52',

  text: '#E8ECF4',
  textMuted: '#9AA5B9',
  textFaint: '#6C778C',

  brand: '#818CF8',
  brandAlt: '#C084FC',
  brandSoft: '#1E2340',
  onBrand: '#0A0E16',

  animated: '#FBBF24',
  animatedSoft: '#2C2213',
  reanimated: '#C4B5FD',
  reanimatedSoft: '#241E3B',

  stage: '#0E1522',
  stageGrid: 'rgba(255,255,255,0.05)',
  stageText: '#E6EAF2',
  stageMuted: '#8E9AAF',

  shadow: '#000000',

  code: {
    bg: '#0B111C',
    text: '#D7DEEA',
    comment: '#6B7A90',
    keyword: '#C792EA',
    string: '#A5E6A0',
    number: '#F7A76C',
    fn: '#7FD3F7',
    tag: '#FF9CAC',
    punctuation: '#8B97AB',
  },
};

export const colorsByScheme = { light, dark } as const;

export type ThemeColors = typeof light;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const fonts = Platform.select({
  ios: { sans: 'system-ui', rounded: 'ui-rounded', mono: 'ui-monospace' },
  android: { sans: 'normal', rounded: 'normal', mono: 'monospace' },
  default: { sans: 'normal', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, sans-serif",
    mono: "SFMono-Regular, Menlo, Consolas, 'Courier New', monospace",
  },
})!;

/** グラデーション。LinearGradient の colors にそのまま渡す */
export const gradients = {
  brand: ['#6366F1', '#A855F7', '#EC4899'] as const,
  animated: ['#F59E0B', '#F97316'] as const,
  reanimated: ['#8B5CF6', '#6366F1'] as const,
};

/** API 種別ごとのアクセント色を引く */
export function accentFor(colors: ThemeColors, api: 'animated' | 'reanimated') {
  return api === 'animated'
    ? { fg: colors.animated, soft: colors.animatedSoft, gradient: gradients.animated }
    : { fg: colors.reanimated, soft: colors.reanimatedSoft, gradient: gradients.reanimated };
}
