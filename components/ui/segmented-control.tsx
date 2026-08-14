import { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { AppText } from '@/components/ui/text';
import { useTheme } from '@/theme/theme-provider';

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

export type SegmentedControlProps<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/**
 * 選択中のセグメントへスライドするインジケーター付きのタブ。
 * インジケーター自体が Reanimated のショーケースになっている。
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const { colors, radius, spacing } = useTheme();
  const [width, setWidth] = useState(0);

  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  const segmentWidth = width > 0 ? (width - 8) / options.length : 0;

  const indicatorStyle = useAnimatedStyle(() => ({
    width: segmentWidth,
    transform: [
      { translateX: withSpring(index * segmentWidth, { damping: 20, stiffness: 220, mass: 0.6 }) },
    ],
  }));

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.track,
        {
          backgroundColor: colors.surfaceAlt,
          borderColor: colors.border,
          borderRadius: radius.pill,
          padding: spacing.xs,
        },
      ]}>
      {segmentWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            indicatorStyle,
            { backgroundColor: colors.surface, borderRadius: radius.pill },
          ]}
        />
      ) : null}

      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={styles.segment}>
            <AppText
              variant="caption"
              numberOfLines={1}
              style={[styles.label, { color: active ? colors.text : colors.textMuted }]}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
  },
  indicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontWeight: '700',
  },
});
