import { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@core/theme';
import { AppText } from './AppText';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/** Last line of defence: a render crash shows a recoverable screen, not a white app. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Hook for Crashlytics / Sentry in production.
    console.error('Unhandled render error', error, info.componentStack);
  }

  private reset = () => this.setState({ hasError: false });

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }
    return (
      <View style={styles.container}>
        <AppText variant="title" align="center">
          Something went wrong
        </AppText>
        <AppText
          color={colors.textSecondary}
          align="center"
          style={styles.message}
        >
          An unexpected error occurred. Please try again.
        </AppText>
        <PrimaryButton
          title="Try again"
          onPress={this.reset}
          style={styles.button}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
    backgroundColor: colors.background,
  },
  message: { marginTop: spacing.sm },
  button: { marginTop: spacing.xl, minWidth: 160 },
});
