import Slider from '@react-native-community/slider';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { AppText } from '@/components/ui/text';
import type { SamplePlayer } from '@/components/sample/use-sample-player';
import { EASING_PRESETS } from '@/lib/easing-presets';
import { useTheme } from '@/theme/theme-provider';

export type SampleControlsProps = {
  player: SamplePlayer;
  /** リファレンス埋め込み時などの省スペース表示 */
  compact?: boolean;
};

export function SampleControls({ player, compact = false }: SampleControlsProps) {
  const { colors, spacing } = useTheme();
  const anyDisabled = !player.durationEnabled || !player.easingEnabled;

  return (
    <View style={{ gap: compact ? spacing.md : spacing.lg }}>
      {/* duration */}
      <View style={{ gap: spacing.xs, opacity: player.durationEnabled ? 1 : 0.45 }}>
        <View style={styles.labelRow}>
          <AppText variant="caption" color="textMuted" style={styles.label}>
            duration
          </AppText>
          <AppText variant="mono" color="text">
            {player.durationEnabled ? `${player.duration} ms` : '—'}
          </AppText>
        </View>
        <Slider
          disabled={!player.durationEnabled}
          value={player.duration}
          minimumValue={player.durationConfig.min}
          maximumValue={player.durationConfig.max}
          step={50}
          minimumTrackTintColor={colors.brand}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.brand}
          onSlidingComplete={player.setDuration}
          style={styles.slider}
        />
      </View>

      {/* easing */}
      <View style={{ gap: spacing.sm, opacity: player.easingEnabled ? 1 : 0.45 }}>
        <View style={styles.labelRow}>
          <AppText variant="caption" color="textMuted" style={styles.label}>
            easing
          </AppText>
          <AppText variant="mono" color="text">
            {player.easingEnabled ? player.easing.label : '—'}
          </AppText>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={player.easingEnabled}
          contentContainerStyle={[styles.chipRow, { gap: spacing.sm }]}>
          {EASING_PRESETS.map((preset) => (
            <Chip
              key={preset.key}
              label={preset.label}
              selected={player.easingKey === preset.key}
              disabled={!player.easingEnabled}
              onPress={() => player.setEasingKey(preset.key)}
            />
          ))}
        </ScrollView>

        {player.easingEnabled && !compact ? (
          <AppText variant="caption">{player.easing.hint}</AppText>
        ) : null}
      </View>

      {anyDisabled && player.disabledReason ? (
        <View style={[styles.note, { backgroundColor: colors.surfaceAlt, padding: spacing.md }]}>
          <MaterialIcons name="info-outline" size={16} color={colors.textFaint} />
          <AppText variant="caption" style={styles.noteText}>
            {player.disabledReason}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  label: {
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  slider: {
    width: '100%',
    height: 32,
  },
  chipRow: {
    flexDirection: 'row',
    paddingRight: 4,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 10,
  },
  noteText: {
    flex: 1,
  },
});
