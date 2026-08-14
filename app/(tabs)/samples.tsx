import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { SampleCard } from '@/components/content-card';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen, ScreenHeader } from '@/components/ui/screen';
import { SearchField } from '@/components/ui/search-field';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { AppText } from '@/components/ui/text';
import { allSamples, sampleTags, searchSamples } from '@/content/registry';
import type { ApiKind } from '@/content/types';
import { useTheme } from '@/theme/theme-provider';

type ApiFilter = 'all' | ApiKind;

const API_OPTIONS: { value: ApiFilter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'animated', label: 'Animated API' },
  { value: 'reanimated', label: 'Reanimated' },
];

export default function SamplesScreen() {
  const { spacing } = useTheme();
  const params = useLocalSearchParams<{ api?: string }>();

  const [api, setApi] = useState<ApiFilter>('all');
  const [tag, setTag] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  // ホームの API タイルから遷移してきたときは、その API で絞り込んだ状態で開く
  useEffect(() => {
    if (params.api === 'animated' || params.api === 'reanimated') setApi(params.api);
  }, [params.api]);

  const tags = useMemo(() => sampleTags(), []);

  const samples = useMemo(() => {
    const byApi = api === 'all' ? allSamples() : allSamples().filter((item) => item.api === api);
    const byTag = tag ? byApi.filter((item) => item.tags.includes(tag)) : byApi;
    return searchSamples(query, byTag);
  }, [api, tag, query]);

  return (
    <Screen>
      <FlatList
        data={samples}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xxl,
          gap: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ gap: spacing.md, paddingBottom: spacing.xs }}>
            <ScreenHeader
              title="サンプル"
              caption="再生・duration・easing を変えて動きの違いを確かめる"
            />
            <SearchField value={query} onChangeText={setQuery} placeholder="タイトル・タグで検索" />
            <SegmentedControl options={API_OPTIONS} value={api} onChange={setApi} />

            {tags.length > 0 ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                <Chip label="すべてのタグ" selected={tag === null} onPress={() => setTag(null)} />
                {tags.map((item) => (
                  <Chip
                    key={item}
                    label={`#${item}`}
                    selected={tag === item}
                    onPress={() => setTag(tag === item ? null : item)}
                  />
                ))}
              </View>
            ) : null}

            <AppText variant="caption">{samples.length} 件</AppText>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 45).duration(320)}>
            <SampleCard sample={item} />
          </Animated.View>
        )}
        ListEmptyComponent={
          <EmptyState
            title="サンプルが見つかりません"
            caption="条件を変えるか、content/samples に新しいファイルを追加してください"
          />
        }
      />
    </Screen>
  );
}
