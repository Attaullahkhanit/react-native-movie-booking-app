import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  LinearGradient as SvgGradient,
  Path,
  Stop,
} from 'react-native-svg';

import { useResponsive } from '@core/hooks/useResponsive';
import { colors, layout, radius, spacing } from '@core/theme';
import { formatLongDate, parseIsoDate } from '@core/utils/date';
import type { Seat } from '@domain/entities/Booking';
import { AppText } from '@presentation/components/AppText';
import { IconButton } from '@presentation/components/IconButton';
import { CloseIcon, MinusIcon, PlusIcon } from '@presentation/components/Icons';
import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { ScreenHeader } from '@presentation/components/ScreenHeader';
import { EmptyState } from '@presentation/components/StateViews';
import {
  MAX_SEATS_PER_BOOKING,
  selectSeatTotal,
  useBookingStore,
} from '@presentation/stores/useBookingStore';
import type { RootScreenProps } from '@presentation/navigation/types';
import { useAfterTransition } from '@presentation/hooks/useAfterTransition';
import { SeatSelectionSkeleton } from '../components/BookingSkeletons';
import { SeatLegend } from '../components/SeatLegend';
import { SeatView } from '../components/SeatView';
import {
  findShowtime,
  generateSeatLayout,
  GRID_COLUMNS,
  SEAT_PRICES,
} from '../utils/seatLayout';

const ZOOM = { min: 1, max: 2.5, step: 0.35 };
const ROW_LABEL_WIDTH = 18;
const LANDSCAPE_PANEL_WIDTH = 320;

export const SeatSelectionScreen = ({
  route,
  navigation,
}: RootScreenProps<'SeatSelection'>) => {
  const { movieId, title, date, showtimeId } = route.params;
  const insets = useSafeAreaInsets();
  const { width, isLandscape } = useResponsive();
  // ~250 seat views: mount them after the push animation, skeleton meanwhile.
  const ready = useAfterTransition();
  const [zoom, setZoom] = useState(ZOOM.min);

  const selectedSeats = useBookingStore(s => s.selectedSeats);
  const toggleSeat = useBookingStore(s => s.toggleSeat);
  const removeSeat = useBookingStore(s => s.removeSeat);
  const clearSelection = useBookingStore(s => s.clearSelection);
  const confirmBooking = useBookingStore(s => s.confirmBooking);

  // Each visit to the seat map starts with a clean selection.
  useEffect(() => {
    clearSelection();
  }, [clearSelection, showtimeId, date]);

  const showtime = findShowtime(showtimeId);
  const seatLayout = useMemo(
    () => generateSeatLayout(`${movieId}-${date}-${showtimeId}`),
    [date, movieId, showtimeId],
  );
  const selectedIds = useMemo(
    () => new Set(selectedSeats.map(s => s.id)),
    [selectedSeats],
  );
  const total = selectSeatTotal(selectedSeats, SEAT_PRICES);

  const sidePadding =
    layout.screenPadding + Math.max(insets.left, insets.right);
  const mapAreaWidth = isLandscape
    ? width - LANDSCAPE_PANEL_WIDTH - insets.right
    : width;
  // Fit the whole auditorium at zoom 1; zooming makes the grid scroll.
  const baseCell = Math.floor(
    (mapAreaWidth - sidePadding * 2 - ROW_LABEL_WIDTH) / GRID_COLUMNS,
  );
  const cellSize = Math.round(baseCell * zoom);
  const gridWidth = cellSize * GRID_COLUMNS + ROW_LABEL_WIDTH;

  const onToggle = useCallback(
    (seat: Seat) => {
      const alreadySelected = useBookingStore
        .getState()
        .selectedSeats.some(s => s.id === seat.id);
      if (
        !alreadySelected &&
        useBookingStore.getState().selectedSeats.length >= MAX_SEATS_PER_BOOKING
      ) {
        Alert.alert(
          'Seat limit',
          `You can book up to ${MAX_SEATS_PER_BOOKING} seats at once.`,
        );
        return;
      }
      toggleSeat({
        id: seat.id,
        row: seat.row,
        number: seat.number,
        kind: seat.kind,
      });
    },
    [toggleSeat],
  );

  const onProceed = useCallback(() => {
    const booking = confirmBooking({
      movieId,
      movieTitle: title,
      date,
      showtimeId,
      total,
    });
    Alert.alert(
      'Booking confirmed',
      `${booking.seats.length} seat(s) for ${title}\nTotal: $${booking.total}`,
      [{ text: 'Done', onPress: () => navigation.popToTop() }],
    );
  }, [confirmBooking, date, movieId, navigation, showtimeId, title, total]);

  const parsedDate = parseIsoDate(date);
  const subtitle = `${parsedDate ? formatLongDate(parsedDate) : date}  |  ${
    showtime.time
  } ${showtime.hall.replace('Cinetech + ', '')}`;

  const seatMap = (
    <View style={styles.mapArea}>
      <ScrollView contentContainerStyle={styles.mapScrollV}>
        <ScrollView
          horizontal
          contentContainerStyle={[
            styles.mapScrollH,
            { paddingHorizontal: sidePadding },
          ]}
        >
          <View style={{ width: gridWidth }}>
            <ScreenArc
              width={gridWidth - ROW_LABEL_WIDTH}
              offset={ROW_LABEL_WIDTH}
            />
            {seatLayout.map(row => (
              <View key={row.row} style={styles.seatRow}>
                <AppText variant="tiny" style={styles.rowLabel}>
                  {row.row}
                </AppText>
                {row.cells.map(cell =>
                  cell.type === 'seat' ? (
                    <SeatView
                      key={cell.id}
                      seat={cell}
                      size={cellSize}
                      selected={selectedIds.has(cell.id)}
                      onToggle={onToggle}
                    />
                  ) : (
                    <View
                      key={cell.id}
                      style={{ width: cellSize, height: cellSize }}
                    />
                  ),
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
      <View style={[styles.zoomControls, { right: sidePadding }]}>
        <IconButton
          accessibilityLabel="Zoom in"
          disabled={zoom >= ZOOM.max}
          onPress={() => setZoom(z => Math.min(ZOOM.max, z + ZOOM.step))}
          style={styles.zoomButton}
        >
          <PlusIcon />
        </IconButton>
        <IconButton
          accessibilityLabel="Zoom out"
          disabled={zoom <= ZOOM.min}
          onPress={() => setZoom(z => Math.max(ZOOM.min, z - ZOOM.step))}
          style={styles.zoomButton}
        >
          <MinusIcon />
        </IconButton>
      </View>
    </View>
  );

  const panel = (
    <View
      style={[
        styles.panel,
        isLandscape
          ? {
              width: LANDSCAPE_PANEL_WIDTH + insets.right,
              paddingRight: sidePadding,
            }
          : null,
        {
          paddingBottom: insets.bottom + spacing.lg,
          paddingLeft: isLandscape ? spacing.xl : sidePadding,
        },
        !isLandscape && { paddingRight: sidePadding },
      ]}
    >
      <ScrollView
        style={styles.panelScroll}
        contentContainerStyle={styles.panelContent}
        showsVerticalScrollIndicator={false}
      >
        <SeatLegend />
        {selectedSeats.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {selectedSeats.map(seat => (
              <View key={seat.id} style={styles.chip}>
                <AppText variant="heading">
                  {seat.number}
                  <AppText variant="tiny" color={colors.textSecondary}>
                    {' '}
                    / {seat.row} row
                  </AppText>
                </AppText>
                <IconButton
                  accessibilityLabel={`Remove row ${seat.row} seat ${seat.number}`}
                  onPress={() => removeSeat(seat.id)}
                  style={styles.chipRemove}
                >
                  <CloseIcon size={12} />
                </IconButton>
              </View>
            ))}
          </ScrollView>
        ) : isLandscape ? (
          <EmptyState
            title="Pick your seats"
            message="Tap a seat on the map to select it."
          />
        ) : null}
      </ScrollView>
      <View style={styles.checkout}>
        <View
          style={styles.totalBox}
          accessibilityLabel={`Total price ${total} dollars`}
        >
          <AppText variant="tiny">Total Price</AppText>
          <AppText variant="heading">$ {total}</AppText>
        </View>
        <PrimaryButton
          title="Proceed to pay"
          onPress={onProceed}
          disabled={selectedSeats.length === 0}
          style={styles.payButton}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader title={title} subtitle={subtitle} align="center" showBack />
      {ready ? (
        <View style={isLandscape ? styles.row : styles.column}>
          {seatMap}
          {panel}
        </View>
      ) : (
        <SeatSelectionSkeleton
          sidePadding={sidePadding}
          horizontal={isLandscape}
        />
      )}
    </View>
  );
};

const ScreenArc = React.memo(
  ({ width, offset }: { width: number; offset: number }) => (
    <View style={[styles.arc, { marginLeft: offset, width }]}>
      <Svg width={width} height={34}>
        <Defs>
          <SvgGradient id="arcGlow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.primary} stopOpacity={0.25} />
            <Stop offset="1" stopColor={colors.primary} stopOpacity={0} />
          </SvgGradient>
        </Defs>
        <Path
          d={`M 0 26 Q ${width / 2} -4 ${width} 26 L ${width} 34 L 0 34 Z`}
          fill="url(#arcGlow)"
        />
        <Path
          d={`M 0 26 Q ${width / 2} -4 ${width} 26`}
          stroke={colors.primary}
          strokeWidth={1.2}
          fill="none"
        />
      </Svg>
      <AppText
        variant="tiny"
        color={colors.textSecondary}
        style={styles.arcLabel}
      >
        SCREEN
      </AppText>
    </View>
  ),
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  row: { flex: 1, flexDirection: 'row' },
  column: { flex: 1 },
  mapArea: { flex: 1 },
  mapScrollV: { flexGrow: 1, justifyContent: 'center' },
  mapScrollH: {
    paddingVertical: spacing.xl,
    flexGrow: 1,
    justifyContent: 'center',
  },
  seatRow: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { width: ROW_LABEL_WIDTH },
  arc: { alignItems: 'center', marginBottom: spacing.md },
  arcLabel: { position: 'absolute', top: 14, letterSpacing: 1 },
  zoomControls: {
    position: 'absolute',
    bottom: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  zoomButton: {
    minWidth: 32,
    minHeight: 32,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  panel: {
    backgroundColor: colors.surface,
    paddingTop: spacing.xl,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  panelScroll: { flexGrow: 0 },
  panelContent: { gap: spacing.xl, paddingBottom: spacing.lg },
  chips: { gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(166,166,166,0.1)',
  },
  chipRemove: { minWidth: 32, minHeight: 32 },
  checkout: { flexDirection: 'row', gap: spacing.md, marginTop: 'auto' },
  totalBox: {
    minWidth: 100,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(166,166,166,0.1)',
  },
  payButton: { flex: 1 },
});

ScreenArc.displayName = 'ScreenArc';
