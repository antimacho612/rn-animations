import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { useTheme } from '@/theme/theme-provider';

export type EmptyStateProps = {
  icon?: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  caption?: string;
};

export function EmptyState({ icon = 'search-off', title, caption }: EmptyStateProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.wrapper, { paddingVertical: spacing.xxl, gap: spacing.sm }]}>
      <MaterialIcons name={icon} size={40} color={colors.textFaint} />
      <AppText variant="subheading" color="textMuted">
        {title}
      </AppText>
      {caption ? (
        <AppText variant="caption" style={styles.caption}>
          {caption}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  caption: {
    textAlign: 'center',
  },
});
