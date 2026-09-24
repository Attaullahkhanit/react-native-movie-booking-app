import { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@core/theme';
import { ErrorBoundary } from '@presentation/components/ErrorBoundary';
import { OfflineBanner } from '@presentation/components/OfflineBanner';
import { RootNavigator } from '@presentation/navigation/RootNavigator';
import { AppProviders } from './AppProviders';

// Keep the native splash visible until fonts are ready (no unstyled flash).
SplashScreen.preventAutoHideAsync().catch(() => undefined);

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
  },
};

const App = () => {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': require('@assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('@assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('@assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('@assets/fonts/Poppins-Bold.ttf'),
  });
  const ready = fontsLoaded || !!fontError;

  // Support both portrait and landscape (Expo Go may start locked).
  useEffect(() => {
    ScreenOrientation.unlockAsync().catch(() => undefined);
  }, []);

  const onLayout = useCallback(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AppProviders>
        <StatusBar style="dark" />
        <View style={styles.root} onLayout={onLayout}>
          <NavigationContainer theme={navigationTheme}>
            <RootNavigator />
          </NavigationContainer>
          <OfflineBanner />
        </View>
      </AppProviders>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({ root: { flex: 1 } });

export default App;
