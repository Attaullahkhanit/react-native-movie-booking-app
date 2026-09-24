export const TIME = {
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const;

export const QUERY_CACHE = {
  /** How long persisted server data survives on disk for offline use. */
  MAX_AGE: 7 * TIME.DAY,
  STORAGE_KEY: 'tentwenty.query-cache',
  /** Bump to invalidate every persisted query after a breaking DTO change. */
  BUSTER: 'v2',
} as const;

export const SEARCH_DEBOUNCE_MS = 400;
export const REQUEST_TIMEOUT_MS = 15000;
