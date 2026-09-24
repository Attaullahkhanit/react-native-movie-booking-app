import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@core/theme';
import { AppText } from '@presentation/components/AppText';
import { SeatIcon } from '@presentation/components/Icons';
import { SEAT_PRICES } from '../utils/seatLayout';

const ITEMS = [
  { label: 'Selected', color: colors.seatSelected },
  { label: 'Not available', color: colors.seatUnavailable },
  { label: `VIP (${SEAT_PRICES.vip}$)`, color: colors.seatVip },
  { label: `Regular (${SEAT_PRICES.regular} $)`, color: colors.seatRegular },
];

export const SeatLegend = memo(() => (
  <View style={styles.grid}>
    {ITEMS.map(item => (
      <View key={item.label} style={styles.item}>
        <SeatIcon color={item.color} />
        <AppText variant="bodySmall" color={colors.textSecondary}>
          {item.label}
        </AppText>
      </View>
    ))}
  </View>
));

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.lg },
  item: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});

SeatLegend.displayName = 'SeatLegend';
