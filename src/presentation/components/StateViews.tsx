import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { isApiKeyConfigured } from '@core/config/env';
import { getErrorMessage } from '@core/network/ApiError';
import { colors, spacing } from '@core/theme';
import { AppText } from './AppText';
import { WifiOffIcon } from './Icons';
import { PrimaryButton } from './PrimaryButton';

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
}

export const ErrorState = memo(({ error, onRetry }: ErrorStateProps) => {
  const message = isApiKeyConfigured
    ? getErrorMessage(error)
    : 'TMDB API key is missing. Set EXPO_PUBLIC_TMDB_API_KEY in .env and restart with "npx expo start --clear".';

  return (
    <View style={styles.container} accessibilityRole="alert">
      <AppText variant="heading" align="center">
        Oops!
      </AppText>
      <AppText
        variant="body"
        color={colors.textSecondary}
        align="center"
        style={styles.message}
      >
        {message}
      </AppText>
      {onRetry ? (
        <PrimaryButton
          title="Try again"
          onPress={onRetry}
          style={styles.button}
        />
      ) : null}
    </View>
  );
});

interface EmptyStateProps {
  title: string;
  message?: string;
}

export const EmptyState = memo(({ title, message }: EmptyStateProps) => (
  <View style={styles.container}>
    <AppText variant="heading" align="center">
      {title}
    </AppText>
    {message ? (
      <AppText
        variant="body"
        color={colors.textSecondary}
        align="center"
        style={styles.message}
      >
        {message}
      </AppText>
    ) : null}
  </View>
));

/**
 * Shown when content has never been cached and the device is offline. React
 * Query resumes the paused request automatically once connectivity returns,
 * so no retry button is needed.
 */
export const OfflineState = memo(() => (
  <View style={styles.container} accessibilityRole="alert">
    <View style={styles.offlineIcon}>
      <WifiOffIcon size={28} color={colors.textSecondary} />
    </View>
    <AppText variant="heading" align="center">
      You&apos;re offline
    </AppText>
    <AppText
      variant="body"
      color={colors.textSecondary}
      align="center"
      style={styles.message}
    >
      This hasn&apos;t been saved for offline use yet. It will load
      automatically as soon as you&apos;re back online.
    </AppText>
  </View>
));

const styles = StyleSheet.create({
  offlineIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.skeletonBase,
    marginBottom: spacing.lg,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  message: { marginTop: spacing.sm, maxWidth: 360 },
  button: { marginTop: spacing.xl, minWidth: 160 },
});

ErrorState.displayName = 'ErrorState';
EmptyState.displayName = 'EmptyState';
OfflineState.displayName = 'OfflineState';
