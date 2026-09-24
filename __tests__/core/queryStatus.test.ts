import { isWaitingForNetwork } from '@presentation/hooks/queryStatus';

describe('isWaitingForNetwork', () => {
  it('is true only when a query has no data and is paused for the network', () => {
    expect(
      isWaitingForNetwork({ isPending: true, fetchStatus: 'paused' }),
    ).toBe(true);
  });

  it('is false while actively loading or once data exists', () => {
    expect(
      isWaitingForNetwork({ isPending: true, fetchStatus: 'fetching' }),
    ).toBe(false);
    // Cached data + offline: the cached screen is shown, not the offline one.
    expect(
      isWaitingForNetwork({ isPending: false, fetchStatus: 'paused' }),
    ).toBe(false);
  });
});
