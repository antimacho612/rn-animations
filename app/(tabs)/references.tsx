import { useMemo, useState } from 'react';
import { SectionList, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ReferenceCard } from '@/components/content-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen, ScreenHeader } from '@/components/ui/screen';
import { SearchField } from '@/components/ui/search-field';
import { SectionHeader } from '@/components/ui/section-header';
import { allReferences, searchReferences } from '@/content/registry';
import {
  REFERENCE_CATEGORY_LABEL,
  type ReferenceCategory,
  type ReferenceDefinition,
} from '@/content/types';
import { useTheme } from '@/theme/theme-provider';

const CATEGORY_ORDER: ReferenceCategory[] = ['common', 'animated-api', 'reanimated'];

export default function ReferencesScreen() {
  const { spacing } = useTheme();
  const [query, setQuery] = useState('');

  const sections = useMemo(() => {
    const matched = searchReferences(query, allReferences());
    return CATEGORY_ORDER.map((category) => ({
      category,
      title: REFERENCE_CATEGORY_LABEL[category],
      data: matched.filter((item) => item.category === category),
    })).filter((section) => section.data.length > 0);
  }, [query]);

  return (
    <Screen>
      <SectionList<ReferenceDefinition, { category: ReferenceCategory; title: string }>
        sections={sections}
        keyExtractor={(item) => item.slug}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xxl,
          gap: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ gap: spacing.md, paddingBottom: spacing.xs }}>
            <ScreenHeader title="リファレンス" caption="1 ページ 1 トピックの学習メモ" />
            <SearchField value={query} onChangeText={setQuery} placeholder="タイトル・タグで検索" />
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={{ paddingTop: spacing.sm }}>
            <SectionHeader title={section.title} />
          </View>
        )}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 45).duration(320)}>
            <ReferenceCard reference={item} />
          </Animated.View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="menu-book"
            title="ページが見つかりません"
            caption="content/references に Markdown を書いたファイルを追加してください"
          />
        }
      />
    </Screen>
  );
}
