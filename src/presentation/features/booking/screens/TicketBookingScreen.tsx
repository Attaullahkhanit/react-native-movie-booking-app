import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout, radius, spacing } from '@core/theme';
import {
  formatReleaseDate,
  formatShortDate,
  nextDays,
  toIsoDate,
} from '@core/utils/date';
import type { Showtime } from '@domain/entities/Booking';
import { AppText } from '@presentation/components/AppText';
import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { ScreenHeader } from '@presentation/components/ScreenHeader';
import { useAfterTransition } from '@presentation/hooks/useAfterTransition';
import type { RootScreenProps } from '@presentation/navigation/types';
import { TicketBookingSkeleton } from '../components/BookingSkeletons';
import { SeatMapPreview } from '../components/SeatMapPreview';
import { generateSeatLayout, SHOWTIMES } from '../utils/seatLayout';

const DAYS_AHEAD = 7;
const CARD_WIDTH = 250;
const PREVIEW_HEIGHT = 145;

export const TicketBookingScreen = ({
  route,
  navigation,
}: RootScreenProps<'TicketBooking'>) => {
  const { movieId, title, releaseDate } = route.params;
  const insets = useSafeAreaInsets();
  const ready = useAfterTransition();
  const dates = useMemo(() => nextDays(DAYS_AHEAD), []);
  const [dateIndex, setDateIndex] = useState(0);
  const [showtimeId, setShowtimeId] = useState(SHOWTIMES[0].id);
  const isoDate = toIsoDate(dates[dateIndex]);
  const sidePadding =
    layout.screenPadding + Math.max(insets.left, insets.right);

  const onSelectSeats = useCallback(
    () =>
      navigation.navigate('SeatSelection', {
        movieId,
        title,
        date: isoDate,
        showtimeId,
      }),
    [isoDate, movieId, navigation, showtimeId, title],
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={title}
        subtitle={`In Theaters ${formatReleaseDate(releaseDate)}`}
        align="center"
        showBack
      />
      {!ready ? (
        <TicketBookingSkeleton
          sidePadding={sidePadding}
          cardWidth={CARD_WIDTH}
          previewHeight={PREVIEW_HEIGHT}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <AppText
            variant="heading"
            style={[styles.label, { marginHorizontal: sidePadding }]}
          >
            Date
          </AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.dates,
              { paddingHorizontal: sidePadding },
            ]}
          >
            {dates.map((date, i) => {
              const selected = i === dateIndex;
              return (
                <Pressable
                  key={date.toISOString()}
                  onPress={() => setDateIndex(i)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={[styles.dateChip, selected && styles.dateChipSelected]}
                >
                  <AppText
                    variant="caption"
                    color={selected ? colors.textOnDark : colors.textPrimary}
                  >
                    {formatShortDate(date)}
                  </AppText>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* A fixed set of 4 showtimes: a plain ScrollView beats a
              virtualized list here (nothing to recycle). */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.showtimes,
              { paddingHorizontal: sidePadding },
            ]}
          >
            {SHOWTIMES.map(item => (
              <ShowtimeCard
                key={item.id}
                showtime={item}
                selected={item.id === showtimeId}
                seed={`${movieId}-${isoDate}-${item.id}`}
                onPress={setShowtimeId}
              />
            ))}
          </ScrollView>
        </ScrollView>
      )}

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + spacing.lg,
            paddingHorizontal: sidePadding,
          },
        ]}
      >
        <PrimaryButton
          title="Select Seats"
          onPress={onSelectSeats}
          disabled={!ready}
          style={styles.cta}
        />
      </View>
    </View>
  );
};

interface ShowtimeCardProps {
  showtime: Showtime;
  selected: boolean;
  seed: string;
  onPress: (id: string) => void;
}

const ShowtimeCard = React.memo(
  ({ showtime, selected, seed, onPress }: ShowtimeCardProps) => {
    const seatLayout = useMemo(() => generateSeatLayout(seed), [seed]);
    return (
      <Pressable
        onPress={() => onPress(showtime.id)}
        accessibilityRole="button"
        accessibilityLabel={`${showtime.time}, ${showtime.hall}, from ${showtime.price} dollars`}
        accessibilityState={{ selected }}
        style={styles.showtime}
      >
        <View style={styles.showtimeHeader}>
          <AppText variant="caption">{showtime.time}</AppText>
          <AppText
            variant="bodySmall"
            color={colors.textSecondary}
            numberOfLines={1}
          >
            {showtime.hall}
          </AppText>
        </View>
        <View style={[styles.preview, selected && styles.previewSelected]}>
          <SeatMapPreview
            layout={seatLayout}
            width={CARD_WIDTH - 40}
            height={PREVIEW_HEIGHT - 30}
          />
        </View>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          From <AppText variant="caption">{showtime.price}$</AppText> or{' '}
          <AppText variant="caption">{showtime.bonus} bonus</AppText>
        </AppText>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingTop: spacing.xxxl, paddingBottom: spacing.xl },
  label: { marginBottom: spacing.md },
  dates: { gap: spacing.md },
  dateChip: {
    paddingHorizontal: spacing.xl,
    height: 32,
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: 'rgba(166,166,166,0.1)',
  },
  dateChipSelected: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  showtimes: { gap: spacing.md, paddingTop: spacing.xxxl + spacing.sm },
  showtime: { width: CARD_WIDTH, gap: spacing.sm },
  showtimeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  preview: {
    height: PREVIEW_HEIGHT,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  previewSelected: { borderColor: colors.primary },
  footer: { paddingTop: spacing.md, backgroundColor: colors.background },
  cta: {
    alignSelf: 'stretch',
    width: '100%',
    maxWidth: layout.maxContentWidth,
  },
});

ShowtimeCard.displayName = 'ShowtimeCard';
