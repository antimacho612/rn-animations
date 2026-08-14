import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';

import { ContentLinkRow } from '@/components/content-card';
import { CodeBlock } from '@/components/doc/code-block';
import { SamplePlayerView } from '@/components/sample/sample-player';
import { ApiBadge } from '@/components/ui/api-badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import { AppText } from '@/components/ui/text';
import { getSample, relatedReferences } from '@/content/registry';
import { useTheme } from '@/theme/theme-provider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SampleDetailScreen() {
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { spacing, colors } = useTheme();
  const sample = getSample(id);

  if (!sample) {
    return (
      <>
        <Stack.Screen options={{ title: 'サンプル' }} />
        <View style={[styles.notFound, { backgroundColor: colors.bg, marginBottom: safeAreaBottom }]}>
          <EmptyState title="サンプルが見つかりません" caption={`id: ${id}`} />
        </View>
      </>
    );
  }

  const references = relatedReferences(sample);

  return (
    <>
      <Stack.Screen options={{ title: sample.title }} />
      <ScrollView
        style={{ backgroundColor: colors.bg, marginBottom: safeAreaBottom }}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xxl,
          gap: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(360)} style={{ gap: spacing.sm }}>
          <ApiBadge api={sample.api} />
          <AppText variant="title">{sample.title}</AppText>
          <AppText variant="body" color="textMuted">
            {sample.summary}
          </AppText>
          {sample.tags.length > 0 ? (
            <AppText variant="caption" color="textFaint">
              {sample.tags.map((tag) => `#${tag}`).join('  ')}
            </AppText>
          ) : null}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(60).duration(360)}>
          <SamplePlayerView sample={sample} />
        </Animated.View>

        {sample.code ? <CodeSection code={sample.code} /> : null}

        {references.length > 0 ? (
          <View style={{ gap: spacing.sm }}>
            <SectionHeader title="関連するリファレンス" />
            {references.map((reference) => (
              <ContentLinkRow key={reference.slug} item={reference} />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </>
  );
}

function CodeSection({ code }: { code: string }) {
  const { spacing, colors } = useTheme();
  const [open, setOpen] = useState(true);

  return (
    <Animated.View layout={LinearTransition.duration(220)} style={{ gap: spacing.md }}>
      <Pressable onPress={() => setOpen((value) => !value)} accessibilityRole="button">
        <SectionHeader
          title="ソース"
          right={
            <MaterialIcons
              name={open ? 'expand-less' : 'expand-more'}
              size={22}
              color={colors.textFaint}
            />
          }
        />
      </Pressable>

      {open ? (
        <Animated.View entering={FadeIn.duration(200)}>
          <Card padded={false} tone="alt">
            <CodeBlock code={code} language="tsx" />
          </Card>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    justifyContent: 'center',
  },
});
