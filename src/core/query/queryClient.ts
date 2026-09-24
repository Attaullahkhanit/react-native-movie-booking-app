import { AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {
  focusManager,
  onlineManager,
  QueryClient,
} from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

import { QUERY_CACHE, TIME } from '@core/config/constants';
import { ApiError } from '@core/network/ApiError';
import { kvStorage } from '@core/storage/kvStorage';

const MAX_RETRIES = 2;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Serve cached data first and only hit the network when it is reachable.
      networkMode: 'offlineFirst',
      staleTime: 10 * TIME.MINUTE,
      // Must be >= the persister maxAge or entries are dropped before restore.
      gcTime: QUERY_CACHE.MAX_AGE,
      retry: (failureCount, error) =>
        failureCount < MAX_RETRIES &&
        (!(error instanceof ApiError) || error.isRetryable),
    },
  },
});

export const queryPersister = createSyncStoragePersister({
  key: QUERY_CACHE.STORAGE_KEY,
  throttleTime: 1000,
  storage: kvStorage,
});

/** Wires React Query's online/focus managers to native signals. Call once. */
export const setupQueryManagers = () => {
  onlineManager.setEventListener(setOnline =>
    NetInfo.addEventListener(state => setOnline(state.isConnected !== false)),
  );

  const subscription = AppState.addEventListener(
    'change',
    (status: AppStateStatus) => focusManager.setFocused(status === 'active'),
  );
  return () => subscription.remove();
};
