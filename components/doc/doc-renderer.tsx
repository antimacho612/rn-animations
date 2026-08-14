import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Markdown, { type RenderRules } from '@ronradtke/react-native-markdown-display';
import { Link, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { CodeBlock } from '@/components/doc/code-block';
import { createMarkdownStyles } from '@/components/doc/markdown-styles';
import { SamplePlayerView } from '@/components/sample/sample-player';
import { ApiBadge } from '@/components/ui/api-badge';
import { Card } from '@/components/ui/card';
import { AppText } from '@/components/ui/text';
import { getSample } from '@/content/registry';
import type { CalloutTone, DocBlock } from '@/content/types';
import { useTheme } from '@/theme/theme-provider';

export function DocRenderer({ blocks }: { blocks: DocBlock[] }) {
  const { spacing } = useTheme();

  return (
    <View style={{ gap: spacing.lg }}>
      {blocks.map((block, index) => (
        <Animated.View key={index} entering={FadeIn.delay(index * 45).duration(280)}>
          <DocBlockView block={block} />
        </Animated.View>
      ))}
    </View>
  );
}

function DocBlockView({ block }: { block: DocBlock }) {
  switch (block.type) {
    case 'md':
      return <MarkdownBlock value={block.value} />;
    case 'code':
      return <CodeBlock code={block.value} language={block.lang} />;
    case 'sample':
      return <SampleEmbed id={block.id} />;
    case 'callout':
      return <Callout tone={block.tone} value={block.value} />;
  }
}

function MarkdownBlock({ value }: { value: string }) {
  const theme = useTheme();
  const router = useRouter();

  const markdownStyles = useMemo(() => createMarkdownStyles(theme), [theme]);

  const rules = useMemo<RenderRules>(
    () => ({
      // コードブロックはアプリ共通の CodeBlock に差し替える
      fence: (node) => (
        <View key={node.key} style={styles.fence}>
          <CodeBlock
            code={String(node.content).replace(/\n$/, '')}
            language={typeof node.sourceInfo === 'string' ? node.sourceInfo.trim() : undefined}
          />
        </View>
      ),
      code_block: (node) => (
        <View key={node.key} style={styles.fence}>
          <CodeBlock code={String(node.content).replace(/\n$/, '')} />
        </View>
      ),
      // アプリ内リンク（/reference/... /sample/...）はルーターで遷移する
      link: (node, children, _parent, ruleStyles) => {
        const href = String(node.attributes?.href ?? '');
        const internal = href.startsWith('/');
        return (
          <Text
            key={node.key}
            style={ruleStyles.link}
            onPress={() => {
              if (internal) router.push(href as never);
              else Linking.openURL(href).catch(() => {});
            }}>
            {children}
          </Text>
        );
      },
    }),
    [router]
  );

  return (
    <Markdown style={markdownStyles as never} rules={rules}>
      {value}
    </Markdown>
  );
}

const CALLOUT_META: Record<
  CalloutTone,
  { icon: React.ComponentProps<typeof MaterialIcons>['name']; label: string }
> = {
  info: { icon: 'info-outline', label: 'メモ' },
  tip: { icon: 'lightbulb-outline', label: 'ヒント' },
  warn: { icon: 'warning-amber', label: '注意' },
};

function Callout({ tone, value }: { tone: CalloutTone; value: string }) {
  const { colors, radius, spacing } = useTheme();
  const meta = CALLOUT_META[tone];
  const accent =
    tone === 'warn' ? colors.animated : tone === 'tip' ? colors.reanimated : colors.brand;

  return (
    <View
      style={[
        styles.callout,
        {
          backgroundColor: colors.surfaceAlt,
          borderLeftColor: accent,
          borderRadius: radius.md,
          padding: spacing.md,
          gap: spacing.xs,
        },
      ]}>
      <View style={styles.calloutHead}>
        <MaterialIcons name={meta.icon} size={16} color={accent} />
        <AppText variant="caption" style={[styles.calloutLabel, { color: accent }]}>
          {meta.label}
        </AppText>
      </View>
      <MarkdownBlock value={value} />
    </View>
  );
}

/** 本文中に差し込まれたライブサンプル */
function SampleEmbed({ id }: { id: string }) {
  const { colors, spacing } = useTheme();
  const sample = getSample(id);

  if (!sample) {
    return (
      <Card tone="alt">
        <AppText variant="caption">サンプル「{id}」が見つかりません</AppText>
      </Card>
    );
  }

  return (
    <Card style={{ gap: spacing.md }}>
      <View style={styles.embedHead}>
        <View style={{ gap: 4, flex: 1 }}>
          <AppText variant="subheading">{sample.title}</AppText>
          <ApiBadge api={sample.api} size="sm" />
        </View>
        <Link href={{ pathname: '/sample/[id]', params: { id: sample.id } }}>
          <AppText variant="caption" style={{ color: colors.brand, fontWeight: '700' }}>
            詳細 ›
          </AppText>
        </Link>
      </View>

      <SamplePlayerView sample={sample} compact />
    </Card>
  );
}

const styles = StyleSheet.create({
  fence: {
    marginVertical: 8,
  },
  callout: {
    borderLeftWidth: 3,
  },
  calloutHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calloutLabel: {
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  embedHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
});
