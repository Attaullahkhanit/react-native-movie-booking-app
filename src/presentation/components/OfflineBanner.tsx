import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@core/theme';
import { useNetworkStore } from '@presentation/stores/useNetworkStore';
import { AppText } from './AppText';
import { WifiOffIcon } from './Icons';

const BACK_ONLINE_VISIBLE_MS = 2000;

/**
 * App-wide connectivity banner. Slides in when the device goes offline and
 * briefly confirms when the connection comes back.
 */
export const OfflineBanner = () => {
  const insets = useSafeAreaInsets();
  const isOffline = useNetworkStore(s => s.isOffline);
  const [translateY] = useState(() => new Animated.Value(-200));
  const [prevOffline, setPrevOffline] = useState(isOffline);
  const [showBackOnline, setShowBackOnline] = useState(false);

  // Derive the "back online" transition during render (React-recommended
  // alternative to syncing state inside an effect).
  if (prevOffline !== isOffline) {
    setPrevOffline(isOffline);
    setShowBackOnline(prevOffline === true && isOffline === false);
  }

  const mode = isOffline ? 'offline' : showBackOnline ? 'online' : 'hidden';

  useEffect(() => {
    if (!showBackOnline) {
      return;
    }
    const timer = setTimeout(
      () => setShowBackOnline(false),
      BACK_ONLINE_VISIBLE_MS,
    );
    return () => clearTimeout(timer);
  }, [showBackOnline]);

  useEffect(() => {
    if (mode === 'offline') {
      AccessibilityInfo.announceForAccessibility(
        'You are offline. Showing saved content.',
      );
    } else if (mode === 'online') {
      AccessibilityInfo.announceForAccessibility('Back online.');
    }
  }, [mode]);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: mode === 'hidden' ? -200 : 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }, [mode, translateY]);

  const online = mode === 'online';

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing.xs,
          backgroundColor: online ? colors.success : colors.tabBar,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.row}>
        {!online && <WifiOffIcon />}
        <AppText variant="caption" color={colors.textOnDark}>
          {online ? 'Back online' : 'You are offline · showing saved content'}
        </AppText>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: spacing.sm,
    zIndex: 100,
    elevation: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
