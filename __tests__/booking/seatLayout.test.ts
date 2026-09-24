import {
  generateSeatLayout,
  GRID_COLUMNS,
} from '@presentation/features/booking/utils/seatLayout';

describe('generateSeatLayout', () => {
  it('is deterministic for the same showtime seed', () => {
    expect(generateSeatLayout('550-2026-09-23-h1')).toEqual(
      generateSeatLayout('550-2026-09-23-h1'),
    );
  });

  it('differs between showtimes', () => {
    expect(generateSeatLayout('a')).not.toEqual(generateSeatLayout('b'));
  });

  it('produces 10 rows of equal width with VIP seats on the last row', () => {
    const layout = generateSeatLayout('seed');
    expect(layout).toHaveLength(10);
    layout.forEach(row => expect(row.cells).toHaveLength(GRID_COLUMNS));

    const lastRowSeats = layout[9].cells.filter(c => c.type === 'seat');
    expect(lastRowSeats.every(c => c.type === 'seat' && c.kind === 'vip')).toBe(
      true,
    );
  });

  it('gives every seat a unique id', () => {
    const ids = generateSeatLayout('seed').flatMap(r => r.cells.map(c => c.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
