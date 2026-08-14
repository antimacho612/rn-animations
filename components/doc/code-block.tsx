import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { tokenize, type TokenType } from '@/lib/highlight';
import { useTheme } from '@/theme/theme-provider';

export type CodeBlockProps = {
  code: string;
  language?: string;
  /** 上部の言語ラベルを出すか */
  showLanguage?: boolean;
};

export function CodeBlock({ code, language, showLanguage = true }: CodeBlockProps) {
  const { colors, radius, fonts, spacing } = useTheme();
  const tokens = useMemo(() => tokenize(code.replace(/\s+$/, '')), [code]);

  const colorFor: Record<TokenType, string> = {
    plain: colors.code.text,
    comment: colors.code.comment,
    string: colors.code.string,
    keyword: colors.code.keyword,
    number: colors.code.number,
    fn: colors.code.fn,
    tag: colors.code.tag,
    punctuation: colors.code.punctuation,
  };

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: colors.code.bg, borderRadius: radius.md, borderColor: colors.border },
      ]}>
      {showLanguage && language ? (
        <View style={[styles.header, { borderBottomColor: 'rgba(255,255,255,0.07)' }]}>
          <Text style={[styles.language, { color: colors.code.comment, fontFamily: fonts.mono }]}>
            {language}
          </Text>
        </View>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[styles.code, { fontFamily: fonts.mono }]}>
          {tokens.map((token, index) => (
            <Text key={index} style={{ color: colorFor[token.type] }}>
              {token.value}
            </Text>
          ))}
        </Text>
      </ScrollView>
    </View>
  );
}

/** 文中の `code` 用 */
export function InlineCode({ children }: { children: React.ReactNode }) {
  const { colors, fonts, radius } = useTheme();
  return (
    <Text
      style={[
        styles.inline,
        {
          color: colors.brand,
          backgroundColor: colors.surfaceAlt,
          fontFamily: fonts.mono,
          borderRadius: radius.sm,
        },
      ]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  language: {
    fontSize: 11,
    letterSpacing: 0.4,
  },
  code: {
    fontSize: 13,
    lineHeight: 20,
  },
  inline: {
    fontSize: 13.5,
  },
});
