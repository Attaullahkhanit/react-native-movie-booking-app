import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@core/theme';
import { Skeleton } from '@presentation/components/Skeleton';

const DATE_CHIPS = 5;
const SHOWTIME_CARDS = 2;
const LEGEND_ITEMS = 4;

/** Mirrors TicketBookingScreen: "Date" label, date chips, showtime cards. */
export const TicketBookingSkeleton = memo(
  ({
    sidePadding,
    cardWidth,
    previewHeight,
  }: {
    sidePadding: number;
    cardWidth: number;
    previewHeight: number;
  }) => (
    <View
      style={[styles.booking, { paddingHorizontal: sidePadding }]}
      accessibilityLabel="Loading showtimes"
    >
      <Skeleton width={60} height={20} />
      <View style={styles.row}>
        {Array.from({ length: DATE_CHIPS }, (_, i) => (
          <Skeleton key={i} width={68} height={32} radius={radius.md} />
        ))}
      </View>
      <View style={[styles.row, styles.showtimes]}>
        {Array.from({ length: SHOWTIME_CARDS }, (_, i) => (
          <View key={i} style={[styles.showtime, { width: cardWidth }]}>
            <Skeleton width="60%" height={14} />
            <Skeleton height={previewHeight} radius={radius.md} />
            <Skeleton width="70%" height={12} />
          </View>
        ))}
      </View>
    </View>
  ),
);

/** Mirrors SeatSelectionScreen: screen arc + seat grid, legend, checkout. */
export const SeatSelectionSkeleton = memo(
  ({
    sidePadding,
    horizontal,
  }: {
    sidePadding: number;
    horizontal: boolean;
  }) => (
    <View
      style={[styles.seat, horizontal && styles.seatRow]}
      accessibilityLabel="Loading seat map"
    >
      <View style={[styles.map, { paddingHorizontal: sidePadding }]}>
        <Skeleton width="80%" height={10} radius={radius.pill} />
        <Skeleton height="70%" radius={radius.lg} style={styles.grid} />
      </View>
      <View
        style={[
          styles.panel,
          horizontal ? styles.panelSide : { paddingHorizontal: sidePadding },
        ]}
      >
        <View style={styles.legend}>
          {Array.from({ length: LEGEND_ITEMS }, (_, i) => (
            <View key={i} style={styles.legendItem}>
              <Skeleton width={18} height={16} radius={4} />
              <Skeleton width={80} height={12} />
            </View>
          ))}
        </View>
        <View style={styles.checkout}>
          <Skeleton width={100} height={50} radius={radius.md} />
          <Skeleton height={50} radius={radius.md} style={styles.flex} />
        </View>
      </View>
    </View>
  ),
);

const styles = StyleSheet.create({
  flex: { flex: 1 },
  booking: { paddingTop: spacing.xxxl, gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  showtimes: { marginTop: spacing.xxxl, overflow: 'hidden' },
  showtime: { gap: spacing.sm },
  seat: { flex: 1 },
  seatRow: { flexDirection: 'row' },
  map: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  grid: { alignSelf: 'stretch' },
  panel: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xl,
    gap: spacing.xl,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  panelSide: { width: 320, paddingHorizontal: spacing.xl },
  legend: { flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.lg },
  legendItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkout: { flexDirection: 'row', gap: spacing.md },
});

TicketBookingSkeleton.displayName = 'TicketBookingSkeleton';
SeatSelectionSkeleton.displayName = 'SeatSelectionSkeleton';
