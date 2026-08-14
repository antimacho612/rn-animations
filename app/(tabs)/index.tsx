import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ContentLinkRow } from '@/components/content-card';
import { HomeHero } from '@/components/home-hero';
import { Card } from '@/components/ui/card';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { AppText } from '@/components/ui/text';
import { allSamples, contentStats, isSample, recentlyAdded } from '@/content/registry';
import { API_LABEL, type ApiKind } from '@/content/types';
import { useTheme } from '@/theme/theme-provider';
import { accentFor } from '@/theme/tokens';

export default function HomeScreen() {
  const { spacing } = useTheme();
  const router = useRouter();
  const recent = recentlyAdded(5);

  const openRandomSample = () => {
    const samples = allSamples();
    if (samples.length === 0) return;
    const picked = samples[Math.floor(Math.random() * samples.length)];
    router.push({ pathname: '/sample/[id]', params: { id: picked.id } });
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.xl }}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(420)}>
          <HomeHero stats={{ samples: contentStats.samples, references: contentStats.references }} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(420)}>
          <RandomButton onPress={openRandomSample} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(140).duration(420)} style={{ gap: spacing.md }}>
          <SectionHeader title="API から探す" caption="どちらの書き方で作られたサンプルか" />
          <View style={[styles.apiRow, { gap: spacing.md }]}>
            <ApiTile api="animated" count={contentStats.animated} />
            <ApiTile api="reanimated" count={contentStats.reanimated} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(420)} style={{ gap: spacing.sm }}>
          <SectionHeader title="最近追加したもの" caption="新しい順に 5 件" />
          {recent.length === 0 ? (
            <Card tone="alt">
              <AppText variant="caption">
                content/ にファイルを置くとここに出てきます。
              </AppText>
            </Card>
          ) : (
            recent.map((item) => (
              <ContentLinkRow key={isSample(item) ? item.id : item.slug} item={item} />
            ))
          )}
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

function RandomButton({ onPress }: { onPress: () => void }) {
  const { colors, radius, spacing } = useTheme();

  return (
    <PressableScale onPress={onPress} haptic>
      <View
        style={[
          styles.random,
          {
            backgroundColor: colors.surface,
            borderColor: colors.borderStrong,
            borderRadius: radius.lg,
            padding: spacing.lg,
            gap: spacing.md,
          },
        ]}>
        <View style={[styles.randomIcon, { backgroundColor: colors.brandSoft }]}>
          <MaterialIcons name="casino" size={20} color={colors.brand} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="bodyStrong">ランダムに 1 つ見る</AppText>
          <AppText variant="caption">気分転換に。忘れかけていたサンプルが出てくる</AppText>
        </View>
        <MaterialIcons name="chevron-right" size={20} color={colors.textFaint} />
      </View>
    </PressableScale>
  );
}

function ApiTile({ api, count }: { api: ApiKind; count: number }) {
  const { colors, radius, spacing } = useTheme();
  const router = useRouter();
  const accent = accentFor(colors, api);

  return (
    <PressableScale
      style={styles.apiTileWrapper}
      onPress={() => router.push({ pathname: '/samples', params: { api } })}>
      <View
        style={[
          styles.apiTile,
          {
            backgroundColor: accent.soft,
            borderRadius: radius.lg,
            padding: spacing.lg,
            gap: spacing.xs,
          },
        ]}>
        <MaterialIcons
          name={api === 'animated' ? 'timeline' : 'bolt'}
          size={22}
          color={accent.fg}
        />
        <AppText variant="bodyStrong" style={{ color: accent.fg }}>
          {API_LABEL[api]}
        </AppText>
        <AppText variant="caption" style={{ color: accent.fg, opacity: 0.8 }}>
          {count} 件のサンプル
        </AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  random: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  randomIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apiRow: {
    flexDirection: 'row',
  },
  apiTileWrapper: {
    flex: 1,
  },
  apiTile: {
    minHeight: 108,
    justifyContent: 'center',
  },
});
