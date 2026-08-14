import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ContentLinkRow } from '@/components/content-card';
import { DocRenderer } from '@/components/doc/doc-renderer';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import { AppText } from '@/components/ui/text';
import { getReference, relatedSamples } from '@/content/registry';
import { REFERENCE_CATEGORY_LABEL } from '@/content/types';
import { useTheme } from '@/theme/theme-provider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReferenceDetailScreen() {
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { spacing, colors } = useTheme();
  const reference = getReference(slug);

  if (!reference) {
    return (
      <>
        <Stack.Screen options={{ title: 'リファレンス' }} />
        <View style={[styles.notFound, { backgroundColor: colors.bg, marginBottom: safeAreaBottom }]}>
          <EmptyState icon="menu-book" title="ページが見つかりません" caption={`slug: ${slug}`} />
        </View>
      </>
    );
  }

  const samples = relatedSamples(reference);

  return (
    <>
      <Stack.Screen options={{ title: reference.title }} />
      <ScrollView
        style={{ backgroundColor: colors.bg, marginBottom: safeAreaBottom }}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xxl,
          gap: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(360)} style={{ gap: spacing.xs }}>
          <AppText variant="caption" style={{ color: colors.brand, fontWeight: '700' }}>
            {REFERENCE_CATEGORY_LABEL[reference.category]}
          </AppText>
          <AppText variant="title">{reference.title}</AppText>
          <AppText variant="body" color="textMuted">
            {reference.summary}
          </AppText>
          {reference.tags.length > 0 ? (
            <AppText variant="caption" color="textFaint">
              {reference.tags.map((tag) => `#${tag}`).join('  ')}
            </AppText>
          ) : null}
        </Animated.View>

        <DocRenderer blocks={reference.body} />

        {samples.length > 0 ? (
          <View style={{ gap: spacing.sm }}>
            <SectionHeader title="関連するサンプル" />
            {samples.map((sample) => (
              <ContentLinkRow key={sample.id} item={sample} />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    justifyContent: 'center',
  },
});
