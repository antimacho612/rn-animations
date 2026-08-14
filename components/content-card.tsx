import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ApiBadge } from '@/components/ui/api-badge';
import { Card } from '@/components/ui/card';
import { PressableScale } from '@/components/ui/pressable-scale';
import { AppText } from '@/components/ui/text';
import { isSample } from '@/content/registry';
import {
  REFERENCE_CATEGORY_LABEL,
  type ReferenceDefinition,
  type SampleDefinition,
} from '@/content/types';
import { useTheme } from '@/theme/theme-provider';
import { accentFor } from '@/theme/tokens';

export function SampleCard({ sample }: { sample: SampleDefinition }) {
  const { spacing, colors } = useTheme();
  const accent = accentFor(colors, sample.api);

  return (
    <Link href={{ pathname: '/sample/[id]', params: { id: sample.id } }} asChild>
      <PressableScale>
        <Card style={{ gap: spacing.sm }}>
          <View style={[styles.accentEdge, { backgroundColor: accent.fg }]} />
          <View style={styles.headRow}>
            <ApiBadge api={sample.api} size="sm" />
            <MaterialIcons name="play-circle-outline" size={18} color={colors.textFaint} />
          </View>
          <AppText variant="subheading">{sample.title}</AppText>
          <AppText variant="caption" numberOfLines={2}>
            {sample.summary}
          </AppText>
          <TagRow tags={sample.tags} />
        </Card>
      </PressableScale>
    </Link>
  );
}

export function ReferenceCard({ reference }: { reference: ReferenceDefinition }) {
  const { spacing, colors } = useTheme();

  return (
    <Link href={{ pathname: '/reference/[slug]', params: { slug: reference.slug } }} asChild>
      <PressableScale>
        <Card style={{ gap: spacing.sm }}>
          <View style={styles.headRow}>
            <AppText variant="caption" style={[styles.category, { color: colors.brand }]}>
              {REFERENCE_CATEGORY_LABEL[reference.category]}
            </AppText>
            <MaterialIcons name="menu-book" size={18} color={colors.textFaint} />
          </View>
          <AppText variant="subheading">{reference.title}</AppText>
          <AppText variant="caption" numberOfLines={2}>
            {reference.summary}
          </AppText>
          <TagRow tags={reference.tags} />
        </Card>
      </PressableScale>
    </Link>
  );
}

/** サンプル / リファレンスどちらでも受け取れる横長のリンク行 */
export function ContentLinkRow({ item }: { item: SampleDefinition | ReferenceDefinition }) {
  const { colors, radius, spacing } = useTheme();
  const sample = isSample(item);
  const href = sample
    ? ({ pathname: '/sample/[id]', params: { id: item.id } } as const)
    : ({ pathname: '/reference/[slug]', params: { slug: item.slug } } as const);

  return (
    <Link href={href} asChild>
      <PressableScale scaleTo={0.98}>
        <View
          style={[
            styles.row,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radius.md,
              padding: spacing.md,
              gap: spacing.md,
            },
          ]}>
          <View
            style={[
              styles.rowIcon,
              { backgroundColor: colors.brandSoft, borderRadius: radius.sm },
            ]}>
            <MaterialIcons
              name={sample ? 'play-arrow' : 'menu-book'}
              size={18}
              color={colors.brand}
            />
          </View>
          <View style={styles.rowBody}>
            <AppText variant="bodyStrong" numberOfLines={1}>
              {item.title}
            </AppText>
            <AppText variant="caption" numberOfLines={1}>
              {item.summary}
            </AppText>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={colors.textFaint} />
        </View>
      </PressableScale>
    </Link>
  );
}

function TagRow({ tags }: { tags: string[] }) {
  const { colors } = useTheme();
  if (tags.length === 0) return null;

  return (
    <View style={styles.tagRow}>
      {tags.map((tag) => (
        <AppText key={tag} variant="caption" style={[styles.tag, { color: colors.textFaint }]}>
          #{tag}
        </AppText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  accentEdge: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  category: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    fontSize: 11.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  rowIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
});
