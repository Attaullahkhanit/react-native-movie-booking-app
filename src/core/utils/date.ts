const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Parses TMDB `YYYY-MM-DD` as a local date (avoids the UTC off-by-one). */
export const parseIsoDate = (iso: string | null | undefined): Date | null => {
  if (!iso) {
    return null;
  }
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) {
    return null;
  }
  return new Date(y, m - 1, d);
};

/** "December 22, 2021" */
export const formatLongDate = (date: Date) =>
  `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

/** "5 Mar" */
export const formatShortDate = (date: Date) =>
  `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)}`;

export const toIsoDate = (date: Date) => {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mm}-${dd}`;
};

export const formatReleaseDate = (iso: string | null | undefined) => {
  const date = parseIsoDate(iso);
  return date ? formatLongDate(date) : 'Coming soon';
};

/** `count` consecutive calendar days starting at `from` (midnight, local). */
export const nextDays = (count: number, from = new Date()) =>
  Array.from({ length: count }, (_, i) => {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    d.setDate(d.getDate() + i);
    return d;
  });
