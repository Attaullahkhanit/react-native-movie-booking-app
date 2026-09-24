import { useCallback } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

import { colors, layout, radius, spacing } from '@core/theme';
import { formatLongDate, parseIsoDate } from '@core/utils/date';
import type { Booking } from '@domain/entities/Booking';
import { AppText } from '@presentation/components/AppText';
import { IconButton } from '@presentation/components/IconButton';
import { CloseIcon } from '@presentation/components/Icons';
import { ScreenHeader } from '@presentation/components/ScreenHeader';
import { EmptyState } from '@presentation/components/StateViews';
import { useBookingStore } from '@presentation/stores/useBookingStore';
import { findShowtime } from '../../booking/utils/seatLayout';

/** "My Tickets": bookings persisted with Zustand + SQLite kv-store, available offline. */
export const MoreScreen = () => {
  const insets = useSafeAreaInsets();
  const bookings = useBookingStore(s => s.bookings);
  const cancelBooking = useBookingStore(s => s.cancelBooking);
  const sidePadding =
    layout.screenPadding + Math.max(insets.left, insets.right);

  const onCancel = useCallback(
    (booking: Booking) =>
      Alert.alert(
        'Cancel booking?',
        `${booking.movieTitle} · ${booking.seats.length} seat(s)`,
        [
          { text: 'Keep', style: 'cancel' },
          {
            text: 'Cancel booking',
            style: 'destructive',
            onPress: () => cancelBooking(booking.id),
          },
        ],
      ),
    [cancelBooking],
  );

  const renderItem = useCallback<ListRenderItem<Booking>>(
    ({ item }) => {
      const showtime = findShowtime(item.showtimeId);
      const date = parseIsoDate(item.date);
      return (
        <View style={styles.card}>
          <View style={styles.cardText}>
            <AppText variant="heading" numberOfLines={1}>
              {item.movieTitle}
            </AppText>
            <AppText variant="bodySmall" color={colors.primary}>
              {date ? formatLongDate(date) : item.date} · {showtime.time} ·{' '}
              {showtime.hall}
            </AppText>
            <AppText variant="bodySmall" color={colors.textSecondary}>
              Seats: {item.seats.map(s => `R${s.row}-${s.number}`).join(', ')}
            </AppText>
            <AppText variant="caption">Total: ${item.total}</AppText>
          </View>
          <IconButton
            accessibilityLabel="Cancel booking"
            onPress={() => onCancel(item)}
          >
            <CloseIcon size={16} />
          </IconButton>
        </View>
      );
    },
    [onCancel],
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader title="My Tickets" />
      <FlashList
        data={bookings}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={{
          paddingVertical: spacing.xl,
          paddingHorizontal: sidePadding,
        }}
        ListEmptyComponent={
          <EmptyState
            title="No tickets yet"
            message="Book seats from any movie and they will be saved here, even offline."
          />
        }
      />
    </View>
  );
};

const keyExtractor = (b: Booking) => b.id;
const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  separator: { height: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  cardText: { flex: 1, gap: spacing.xs },
});
