import type { FetchStatus } from '@tanstack/react-query';

/**
 * With `networkMode: 'offlineFirst'`, a query that has no cached data and
 * fails while offline is *paused* rather than errored: it stays `pending`
 * until connectivity returns. Screens use this to show an offline message
 * instead of an endless loading skeleton.
 */
export const isWaitingForNetwork = (query: {
  isPending: boolean;
  fetchStatus: FetchStatus;
}) => query.isPending && query.fetchStatus === 'paused';
