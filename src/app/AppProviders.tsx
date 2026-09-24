import { ReactNode, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { QUERY_CACHE } from '@core/config/constants';
import {
  queryClient,
  queryPersister,
  setupQueryManagers,
} from '@core/query/queryClient';
import { useNetworkStore } from '@presentation/stores/useNetworkStore';

const persistOptions = {
  persister: queryPersister,
  maxAge: QUERY_CACHE.MAX_AGE,
  buster: QUERY_CACHE.BUSTER,
  dehydrateOptions: {
    // Persist only successful, re-usable data. Search results are transient
    // (one entry per typed query), so they stay in memory and never hit disk.
    shouldDehydrateQuery: (query: {
      queryKey: readonly unknown[];
      state: { status: string };
    }) => query.state.status === 'success' && query.queryKey[1] !== 'search',
  },
};

const useConnectivity = () => {
  const setOffline = useNetworkStore(s => s.setOffline);

  useEffect(() => {
    const teardownManagers = setupQueryManagers();
    const unsubscribe = NetInfo.addEventListener(state => {
      // `isInternetReachable` is null while unknown; only treat explicit false as offline.
      setOffline(
        state.isConnected === false || state.isInternetReachable === false,
      );
    });
    return () => {
      unsubscribe();
      teardownManagers();
    };
  }, [setOffline]);
};

export const AppProviders = ({ children }: { children: ReactNode }) => {
  useConnectivity();

  return (
    <SafeAreaProvider style={styles.flex}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={persistOptions}
      >
        {children}
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({ flex: { flex: 1 } });
