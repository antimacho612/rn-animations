import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { useTheme } from '@/theme/theme-provider';

export type SectionHeaderProps = {
  title: string;
  caption?: string;
  /** 右端に置く要素（件数バッジなど） */
  right?: React.ReactNode;
};

export function SectionHeader({ title, caption, right }: SectionHeaderProps) {
  const { spacing, colors } = useTheme();

  return (
    <View style={[styles.row, { marginBottom: spacing.md }]}>
      <View style={styles.left}>
        <View style={[styles.bar, { backgroundColor: colors.brand }]} />
        <View>
          <AppText variant="heading">{title}</AppText>
          {caption ? <AppText variant="caption">{caption}</AppText> : null}
        </View>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  bar: {
    width: 3,
    height: 22,
    borderRadius: 2,
  },
});
