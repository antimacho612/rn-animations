import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { API_LABEL, type ApiKind } from '@/content/types';
import { useTheme } from '@/theme/theme-provider';
import { accentFor } from '@/theme/tokens';

export function ApiBadge({ api, size = 'md' }: { api: ApiKind; size?: 'sm' | 'md' }) {
  const { colors, radius } = useTheme();
  const accent = accentFor(colors, api);

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: accent.soft, borderRadius: radius.sm },
      ]}>
      <View style={[styles.dot, { backgroundColor: accent.fg }]} />
      <AppText variant="caption" style={[styles.label, { color: accent.fg }]}>
        {API_LABEL[api]}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  sm: { paddingHorizontal: 7, paddingVertical: 2 },
  md: { paddingHorizontal: 9, paddingVertical: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontWeight: '700', fontSize: 11 },
});
