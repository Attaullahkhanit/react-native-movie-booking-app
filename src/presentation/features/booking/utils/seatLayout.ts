import type {
  SeatCell,
  SeatKind,
  SeatRow,
  Showtime,
} from '@domain/entities/Booking';

export const SEAT_PRICES: Record<SeatKind, number> = { regular: 50, vip: 150 };

/** Static schedule; seat mapping is UI-only per the assignment. */
export const SHOWTIMES: Showtime[] = [
  {
    id: 'h1-1230',
    time: '12:30',
    hall: 'Cinetech + Hall 1',
    price: 50,
    bonus: 2500,
  },
  {
    id: 'h2-1330',
    time: '13:30',
    hall: 'Cinetech + Hall 2',
    price: 75,
    bonus: 3000,
  },
  {
    id: 'h3-1600',
    time: '16:00',
    hall: 'Cinetech + Hall 3',
    price: 60,
    bonus: 2800,
  },
  {
    id: 'h1-1900',
    time: '19:00',
    hall: 'Cinetech + Hall 1',
    price: 90,
    bonus: 3500,
  },
];

export const findShowtime = (id: string) =>
  SHOWTIMES.find(s => s.id === id) ?? SHOWTIMES[0];

const ROWS = 10;
const VIP_ROWS = new Set([10]);
/** Seats per block, separated by aisles: left | centre | right. */
const BLOCKS = [4, 14, 4];
const OCCUPANCY = 0.35;

/** Total grid cells per row including aisle gaps. */
export const GRID_COLUMNS =
  BLOCKS.reduce((a, b) => a + b, 0) + BLOCKS.length - 1;

/** Small deterministic PRNG so a showtime always shows the same taken seats. */
const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const hashString = (value: string) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

/** The first row is narrower: outer seats of the side blocks are missing. */
const isMissingSeat = (row: number, block: number, index: number) =>
  row === 1 &&
  ((block === 0 && index < 2) || (block === BLOCKS.length - 1 && index >= 2));

export const generateSeatLayout = (seed: string): SeatRow[] => {
  const random = mulberry32(hashString(seed));
  const rows: SeatRow[] = [];

  for (let row = 1; row <= ROWS; row++) {
    const cells: SeatCell[] = [];
    let number = 0;

    BLOCKS.forEach((size, block) => {
      for (let i = 0; i < size; i++) {
        if (isMissingSeat(row, block, i)) {
          cells.push({ type: 'empty', id: `${row}-e${block}-${i}` });
          continue;
        }
        number += 1;
        cells.push({
          type: 'seat',
          id: `${row}-${number}`,
          row,
          number,
          kind: VIP_ROWS.has(row) ? 'vip' : 'regular',
          available: random() > OCCUPANCY,
        });
      }
      if (block < BLOCKS.length - 1) {
        cells.push({ type: 'gap', id: `${row}-g${block}` });
      }
    });

    rows.push({ row, cells });
  }
  return rows;
};
