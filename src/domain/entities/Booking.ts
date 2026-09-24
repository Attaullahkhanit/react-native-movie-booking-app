export type SeatKind = 'regular' | 'vip';

export interface Seat {
  id: string;
  row: number;
  number: number;
  kind: SeatKind;
  available: boolean;
}

/** A cell in the auditorium grid: a seat, an aisle gap or an empty slot. */
export type SeatCell =
  | ({ type: 'seat' } & Seat)
  | { type: 'gap'; id: string }
  | { type: 'empty'; id: string };

export interface SeatRow {
  row: number;
  cells: SeatCell[];
}

export interface Showtime {
  id: string;
  time: string;
  hall: string;
  price: number;
  bonus: number;
}

export interface Booking {
  id: string;
  movieId: number;
  movieTitle: string;
  date: string;
  showtimeId: string;
  seats: Pick<Seat, 'id' | 'row' | 'number' | 'kind'>[];
  total: number;
  createdAt: number;
}
