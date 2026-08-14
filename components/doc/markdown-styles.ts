import { StyleSheet } from 'react-native';

import type { Theme } from '@/theme/theme-provider';

/**
 * react-native-markdown-display に渡すスタイル。
 * テーマトークンから組み立てるのでライト/ダークの切り替えに追従する。
 */
export function createMarkdownStyles({ colors, fonts, radius }: Theme) {
  return {
    body: { color: colors.text, fontSize: 15, lineHeight: 24 },

    heading1: { color: colors.text, fontSize: 24, lineHeight: 32, fontWeight: '700', marginTop: 20, marginBottom: 6 },
    heading2: { color: colors.text, fontSize: 19, lineHeight: 27, fontWeight: '700', marginTop: 20, marginBottom: 4 },
    heading3: { color: colors.text, fontSize: 16, lineHeight: 24, fontWeight: '700', marginTop: 16, marginBottom: 2 },
    heading4: { color: colors.textMuted, fontSize: 15, fontWeight: '700', marginTop: 12 },

    paragraph: { marginTop: 6, marginBottom: 6, flexWrap: 'wrap', flexDirection: 'row', width: '100%' },
    strong: { fontWeight: '700', color: colors.text },
    em: { fontStyle: 'italic' },
    s: { textDecorationLine: 'line-through', color: colors.textFaint },

    hr: { backgroundColor: colors.border, height: StyleSheet.hairlineWidth, marginVertical: 16 },

    link: { color: colors.brand, textDecorationLine: 'none', fontWeight: '600' },

    blockquote: {
      backgroundColor: colors.surfaceAlt,
      borderLeftWidth: 3,
      borderColor: colors.brand,
      borderRadius: radius.sm,
      marginLeft: 0,
      paddingHorizontal: 12,
      paddingVertical: 2,
      marginVertical: 8,
    },

    bullet_list: { marginVertical: 4 },
    ordered_list: { marginVertical: 4 },
    list_item: { flexDirection: 'row', marginVertical: 2 },
    bullet_list_icon: { marginLeft: 0, marginRight: 8, color: colors.brand, lineHeight: 24 },
    ordered_list_icon: { marginLeft: 0, marginRight: 8, color: colors.brand, lineHeight: 24 },

    code_inline: {
      color: colors.brand,
      backgroundColor: colors.surfaceAlt,
      fontFamily: fonts.mono,
      fontSize: 13.5,
      borderRadius: radius.sm,
      paddingHorizontal: 4,
    },

    table: { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, borderRadius: radius.sm, marginVertical: 8 },
    tr: { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border, flexDirection: 'row' },
    th: { flex: 1, padding: 8 },
    td: { flex: 1, padding: 8 },
  } as const;
}
