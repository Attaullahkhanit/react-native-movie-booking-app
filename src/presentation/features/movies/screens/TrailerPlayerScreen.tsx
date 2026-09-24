import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

import { useResponsive } from '@core/hooks/useResponsive';
import { colors, radius, spacing } from '@core/theme';
import { AppText } from '@presentation/components/AppText';
import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { useNetworkStore } from '@presentation/stores/useNetworkStore';
import type { RootScreenProps } from '@presentation/navigation/types';
import {
  buildYouTubePlayerHtml,
  PLAYER_ORIGIN,
  PlayerMessage,
  YT_STATE,
} from '../components/youtubePlayerHtml';

/**
 * Full-screen trailer. Autoplays on open, closes itself when playback ends
 * and can be dismissed at any time with "Done".
 */
export const TrailerPlayerScreen = ({
  route,
  navigation,
}: RootScreenProps<'TrailerPlayer'>) => {
  const { videoKey } = route.params;
  const insets = useSafeAreaInsets();
  const { width, height } = useResponsive();
  const isOffline = useNetworkStore(s => s.isOffline);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const source = useMemo(() => {
    const html = buildYouTubePlayerHtml(videoKey);
    return html ? { html, baseUrl: PLAYER_ORIGIN } : null;
  }, [videoKey]);

  // Largest 16:9 box that fits the current orientation.
  const playerWidth = Math.min(width, (height * 16) / 9);
  const playerHeight = Math.round((playerWidth * 9) / 16);

  const close = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      let message: PlayerMessage;
      try {
        message = JSON.parse(event.nativeEvent.data);
      } catch {
        return;
      }
      if (message.type === 'ready') {
        setReady(true);
      } else if (message.type === 'error') {
        setFailed(true);
      } else if (message.data === YT_STATE.ENDED) {
        close();
      }
    },
    [close],
  );

  // Keep the player on its own page; hand "Watch on YouTube" links to the OS.
  const onShouldStartLoad = useCallback((request: ShouldStartLoadRequest) => {
    const { url } = request;
    if (
      url.startsWith(PLAYER_ORIGIN) ||
      url.startsWith('about:') ||
      url.includes('youtube.com/embed')
    ) {
      return true;
    }
    Linking.openURL(url).catch(() => undefined);
    return false;
  }, []);

  const showError = failed || isOffline || !source;

  return (
    <View style={styles.screen}>
      {showError ? (
        <AppText
          color={colors.textOnDark}
          align="center"
          style={styles.message}
        >
          {isOffline
            ? 'Trailers need an internet connection.'
            : 'This trailer cannot be played right now.'}
        </AppText>
      ) : (
        <View style={{ width: playerWidth, height: playerHeight }}>
          <WebView
            source={source}
            originWhitelist={['*']}
            onMessage={onMessage}
            onShouldStartLoadWithRequest={onShouldStartLoad}
            onError={() => setFailed(true)}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            allowsFullscreenVideo={false}
            setSupportMultipleWindows={false}
            bounces={false}
            scrollEnabled={false}
            style={styles.webView}
          />
          {!ready && (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={StyleSheet.absoluteFill}
            />
          )}
        </View>
      )}

      <PrimaryButton
        title="Done"
        onPress={close}
        accessibilityHint="Closes the trailer"
        style={[
          styles.done,
          {
            top: insets.top + spacing.md,
            right: Math.max(insets.right, spacing.lg),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.tabBar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Slight transparency avoids an Android WebView crash during screen transitions.
  webView: { backgroundColor: '#000', opacity: 0.99 },
  message: { paddingHorizontal: spacing.xxxl },
  done: {
    position: 'absolute',
    minHeight: 40,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xl,
  },
});
