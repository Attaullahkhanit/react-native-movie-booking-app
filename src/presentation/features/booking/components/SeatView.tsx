import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@core/theme';
import type { Seat } from '@domain/entities/Booking';

interface SeatViewProps {
  seat: Seat;
  size: number;
  selected: boolean;
  onToggle: (seat: Seat) => void;
}

const colorFor = (seat: Seat, selected: boolean) => {
  if (selected) {
    return colors.seatSelected;
  }
  if (!seat.available) {
    return colors.seatUnavailable;
  }
  return seat.kind === 'vip' ? colors.seatVip : colors.seatRegular;
};

/**
 * Memoised on primitive props, so selecting one seat re-renders exactly one
 * seat instead of the whole ~250-seat grid.
 */
export const SeatView = memo(
  ({ seat, size, selected, onToggle }: SeatViewProps) => {
    const handlePress = useCallback(() => onToggle(seat), [onToggle, seat]);
    const color = colorFor(seat, selected);
    const seatWidth = size * 0.8;

    return (
      <Pressable
        onPress={handlePress}
        disabled={!seat.available}
        accessibilityRole="button"
        accessibilityLabel={`Row ${seat.row}, seat ${seat.number}${
          seat.kind === 'vip' ? ', VIP' : ''
        }`}
        accessibilityState={{ selected, disabled: !seat.available }}
        style={[styles.cell, { width: size, height: size }]}
      >
        <View
          style={{
            width: seatWidth,
            height: seatWidth * 0.62,
            borderRadius: seatWidth * 0.22,
            backgroundColor: color,
          }}
        />
        <View
          style={{
            width: seatWidth * 1.08,
            height: Math.max(1.5, seatWidth * 0.14),
            marginTop: seatWidth * 0.06,
            borderRadius: seatWidth,
            backgroundColor: color,
          }}
        />
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  cell: { alignItems: 'center', justifyContent: 'center' },
});

SeatView.displayName = 'SeatView';
