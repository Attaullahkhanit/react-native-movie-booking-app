import { memo, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { colors, radius, spacing } from '@core/theme';
import { AppText } from './AppText';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
}

export const PrimaryButton = memo(
  ({
    title,
    onPress,
    variant = 'filled',
    disabled,
    loading,
    icon,
    style,
    accessibilityHint,
  }: PrimaryButtonProps) => {
    const isDisabled = disabled || loading;
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
        style={({ pressed }) => [
          styles.base,
          variant === 'filled' ? styles.filled : styles.outline,
          pressed && styles.pressed,
          isDisabled && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.textOnDark} />
        ) : (
          <View style={styles.content}>
            {icon}
            <AppText variant="button" color={colors.textOnDark}>
              {title}
            </AppText>
          </View>
        )}
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  filled: { backgroundColor: colors.primary },
  outline: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});

PrimaryButton.displayName = 'PrimaryButton';
