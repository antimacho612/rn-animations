import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Constants from 'expo-constants';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CodeBlock } from '@/components/doc/code-block';
import { Card } from '@/components/ui/card';
import { Screen, ScreenHeader } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { AppText } from '@/components/ui/text';
import { contentStats } from '@/content/registry';
import { useTheme, type ThemeMode } from '@/theme/theme-provider';

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'システム' },
  { value: 'light', label: 'ライト' },
  { value: 'dark', label: 'ダーク' },
];

const ADD_SAMPLE_SNIPPET = `// content/samples/reanimated/my-animation.tsx
export default defineSample({
  id: 'my-animation',
  title: '新しいアニメーション',
  api: 'reanimated',
  summary: '一覧に出る短い説明',
  tags: ['transform'],
  addedAt: '2026-08-14',
  related: ['reanimated-shared-value'],
  Demo,
});`;

export default function SettingsScreen() {
  const { spacing, colors, mode, setMode, scheme } = useTheme();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xxl,
          gap: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}>
        <ScreenHeader title="設定" />

        <View style={{ gap: spacing.md }}>
          <SectionHeader
            title="テーマ"
            caption={`現在の表示は ${scheme === 'dark' ? 'ダーク' : 'ライト'}`}
          />
          <SegmentedControl options={THEME_OPTIONS} value={mode} onChange={setMode} />
          <AppText variant="caption">
            「システム」は端末の外観設定に追従します。選択内容は次回起動時にも保持されます。
          </AppText>
        </View>

        <View style={{ gap: spacing.md }}>
          <SectionHeader title="コンテンツ" />
          <Card style={{ gap: spacing.md }}>
            <StatRow
              icon="play-circle-outline"
              label="サンプル"
              value={`${contentStats.samples} 件`}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <StatRow
              icon="menu-book"
              label="リファレンス"
              value={`${contentStats.references} ページ`}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <StatRow
              icon="timeline"
              label="Animated API / Reanimated"
              value={`${contentStats.animated} / ${contentStats.reanimated}`}
            />
          </Card>
        </View>

        <View style={{ gap: spacing.md }}>
          <SectionHeader title="コンテンツの追加方法" caption="ファイルを置くだけで一覧に載る" />
          <Card style={{ gap: spacing.md }}>
            <AppText variant="body">
              {'サンプルは content/samples/、リファレンスは content/references/ に\n' +
                'ファイルを 1 つ追加するだけです。index への登録は不要で、\n' +
                'アプリを再読み込みすれば一覧・検索・「最近追加」に反映されます。'}
            </AppText>
            <CodeBlock code={ADD_SAMPLE_SNIPPET} language="tsx" />
            <AppText variant="caption">
              テンプレートは content/_templates/ にあります（_ 始まりは読み込み対象外）。
            </AppText>
          </Card>
        </View>

        <View style={{ gap: spacing.md }}>
          <SectionHeader title="アプリ情報" />
          <Card style={{ gap: spacing.sm }}>
            <StatRow icon="info-outline" label="バージョン" value={Constants.expoConfig?.version ?? '-'} />
            <StatRow icon="devices" label="Expo SDK" value={Constants.expoConfig?.sdkVersion ?? '54'} />
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  value: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.statRow}>
      <MaterialIcons name={icon} size={18} color={colors.textFaint} />
      <AppText variant="body" style={{ flex: 1 }}>
        {label}
      </AppText>
      <AppText variant="mono" color="text">
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
