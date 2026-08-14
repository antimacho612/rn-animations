import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/text';
import { useTheme } from '@/theme/theme-provider';
import { gradients } from '@/theme/tokens';

/**
 * ホームのヒーロー。ゆっくり漂う光のかたまりが 2 つ動いているだけだが、
 * 「アニメーションのカタログを開いた」という気分になる。
 */
export function HomeHero({ stats }: { stats: { samples: number; references: number } }) {
  const { radius, spacing } = useTheme();
  const drift = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    drift.value = withRepeat(
      withTiming(1, { duration: 7000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    pulse.value = withRepeat(
      withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [drift, pulse]);

  const blobA = useAnimatedStyle(() => ({
    transform: [
      { translateX: -30 + drift.value * 80 },
      { translateY: -10 + drift.value * 26 },
      { scale: 1 + pulse.value * 0.2 },
    ],
  }));

  const blobB = useAnimatedStyle(() => ({
    transform: [
      { translateX: 40 - drift.value * 70 },
      { translateY: 20 - drift.value * 30 },
      { scale: 1.15 - pulse.value * 0.2 },
    ],
  }));

  return (
    <LinearGradient
      colors={gradients.brand}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.hero, { borderRadius: radius.xl, padding: spacing.xl, gap: spacing.md }]}>
      <Animated.View style={[styles.blob, styles.blobA, blobA]} pointerEvents="none" />
      <Animated.View style={[styles.blob, styles.blobB, blobB]} pointerEvents="none" />

      <AppText variant="caption" style={styles.kicker}>
        REACT NATIVE ANIMATION CATALOG
      </AppText>
      <AppText variant="display" style={styles.title}>
        動かして{'\n'}おぼえる
      </AppText>

      <View style={[styles.statRow, { gap: spacing.xl }]}>
        <Stat value={stats.samples} label="サンプル" />
        <Stat value={stats.references} label="リファレンス" />
      </View>
    </LinearGradient>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View>
      <AppText variant="title" style={styles.statValue}>
        {value}
      </AppText>
      <AppText variant="caption" style={styles.statLabel}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  blobA: {
    width: 180,
    height: 180,
    top: -60,
    right: -30,
  },
  blobB: {
    width: 130,
    height: 130,
    bottom: -50,
    left: -20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  kicker: {
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '700',
    letterSpacing: 1.2,
    fontSize: 10.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 42,
  },
  statRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  statValue: {
    color: '#FFFFFF',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
  },
});
