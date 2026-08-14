import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from '@/theme/theme-provider';

export type SearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

export function SearchField({ value, onChangeText, placeholder = '検索' }: SearchFieldProps) {
  const { colors, radius, spacing } = useTheme();

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.surfaceAlt,
          borderColor: colors.border,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.md,
        },
      ]}>
      <MaterialIcons name="search" size={18} color={colors.textFaint} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        autoCorrect={false}
        autoCapitalize="none"
        style={[styles.input, { color: colors.text }]}
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={8} accessibilityLabel="検索をクリア">
          <MaterialIcons name="close" size={18} color={colors.textFaint} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
  },
});
