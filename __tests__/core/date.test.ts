import {
  formatLongDate,
  formatReleaseDate,
  formatShortDate,
  nextDays,
  parseIsoDate,
  toIsoDate,
} from '@core/utils/date';

describe('date utils', () => {
  it('parses TMDB dates as local dates (no UTC off-by-one)', () => {
    const date = parseIsoDate('2021-12-22');
    expect(date?.getDate()).toBe(22);
    expect(date?.getMonth()).toBe(11);
  });

  it('formats dates like the design', () => {
    const date = new Date(2021, 11, 22);
    expect(formatLongDate(date)).toBe('December 22, 2021');
    expect(formatShortDate(new Date(2021, 2, 5))).toBe('5 Mar');
    expect(toIsoDate(date)).toBe('2021-12-22');
  });

  it('handles missing release dates', () => {
    expect(formatReleaseDate(null)).toBe('Coming soon');
    expect(parseIsoDate('garbage')).toBeNull();
  });

  it('builds consecutive days across month boundaries', () => {
    const days = nextDays(3, new Date(2026, 0, 31));
    expect(days.map(toIsoDate)).toEqual([
      '2026-01-31',
      '2026-02-01',
      '2026-02-02',
    ]);
  });
});
