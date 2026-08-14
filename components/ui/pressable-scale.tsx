import * as Haptics from 'expo-haptics';
import { Platform, Pressable, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type PressableScaleProps = PressableProps & {
  /** 押し込み時の縮小率 */
  scaleTo?: number;
  /** 押下時に軽い触覚フィードバックを返す */
  haptic?: boolean;
};

/**
 * 押すと少し縮む Pressable。カタログ内のタップ可能要素はこれで統一する。
 */
export function PressableScale({
  scaleTo = 0.97,
  haptic = false,
  onPressIn,
  style,
  ...rest
}: PressableScaleProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * (1 - scaleTo) }],
    opacity: 1 - pressed.value * 0.12,
  }));

  return (
    <AnimatedPressable
      onPressIn={(event) => {
        pressed.value = withTiming(1, { duration: 90 });
        if (haptic && Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        onPressIn?.(event);
      }}
      onPressOut={() => {
        pressed.value = withSpring(0, { damping: 18, stiffness: 260 });
      }}
      style={[animatedStyle, style as object]}
      {...rest}
    />
  );
}
