import { create } from 'zustand';

interface NetworkState {
  /** `null` until NetInfo reports the first state. */
  isOffline: boolean | null;
  setOffline: (offline: boolean) => void;
}

/** Live connectivity, fed by the NetInfo listener in AppProviders. */
export const useNetworkStore = create<NetworkState>()(set => ({
  isOffline: null,
  setOffline: offline => set({ isOffline: offline }),
}));
