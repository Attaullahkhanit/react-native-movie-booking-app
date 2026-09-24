import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@core/storage/kvStorage';
import type { Booking, Seat } from '@domain/entities/Booking';

export type SelectedSeat = Pick<Seat, 'id' | 'row' | 'number' | 'kind'>;

interface BookingState {
  /** Seats picked on the seat map for the current session (not persisted). */
  selectedSeats: SelectedSeat[];
  /** Confirmed bookings, persisted on device so they survive restarts/offline. */
  bookings: Booking[];
  toggleSeat: (seat: SelectedSeat) => void;
  removeSeat: (seatId: string) => void;
  clearSelection: () => void;
  confirmBooking: (
    booking: Omit<Booking, 'id' | 'createdAt' | 'seats'>,
  ) => Booking;
  cancelBooking: (bookingId: string) => void;
}

export const MAX_SEATS_PER_BOOKING = 10;

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      selectedSeats: [],
      bookings: [],

      toggleSeat: seat =>
        set(state => {
          const exists = state.selectedSeats.some(s => s.id === seat.id);
          if (exists) {
            return {
              selectedSeats: state.selectedSeats.filter(s => s.id !== seat.id),
            };
          }
          if (state.selectedSeats.length >= MAX_SEATS_PER_BOOKING) {
            return state;
          }
          return { selectedSeats: [...state.selectedSeats, seat] };
        }),

      removeSeat: seatId =>
        set(state => ({
          selectedSeats: state.selectedSeats.filter(s => s.id !== seatId),
        })),

      clearSelection: () => set({ selectedSeats: [] }),

      confirmBooking: input => {
        const booking: Booking = {
          ...input,
          id: `${input.movieId}-${Date.now()}`,
          createdAt: Date.now(),
          seats: get().selectedSeats,
        };
        set(state => ({
          bookings: [booking, ...state.bookings],
          selectedSeats: [],
        }));
        return booking;
      },

      cancelBooking: bookingId =>
        set(state => ({
          bookings: state.bookings.filter(b => b.id !== bookingId),
        })),
    }),
    {
      name: 'tentwenty.bookings',
      version: 1,
      storage: createJSONStorage(() => zustandStorage),
      partialize: state => ({ bookings: state.bookings }),
    },
  ),
);

export const selectSeatTotal = (
  seats: SelectedSeat[],
  prices: Record<Seat['kind'], number>,
) => seats.reduce((sum, seat) => sum + prices[seat.kind], 0);
