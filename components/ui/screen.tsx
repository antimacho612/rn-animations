import { StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/text';
import { useTheme } from '@/theme/theme-provider';

/** タブ画面の外枠。上部セーフエリアとテーマ背景を担当する */
export function Screen({ style, ...rest }: ViewProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[styles.screen, { backgroundColor: colors.bg, paddingTop: insets.top }, style]}
      {...rest}
    />
  );
}

export type ScreenHeaderProps = {
  title: string;
  caption?: string;
  right?: React.ReactNode;
};

/** 画面上部の大きな見出し */
export function ScreenHeader({ title, caption, right }: ScreenHeaderProps) {
  const { spacing } = useTheme();

  return (
    <View style={[styles.header, { paddingBottom: spacing.md, gap: spacing.xs }]}>
      <View style={styles.headerRow}>
        <AppText variant="display" style={styles.title}>
          {title}
        </AppText>
        {right}
      </View>
      {caption ? <AppText variant="caption">{caption}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flexShrink: 1,
  },
});
