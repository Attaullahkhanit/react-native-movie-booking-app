import { memo, ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

interface IconButtonProps {
  onPress: () => void;
  accessibilityLabel: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

/** 44x44 minimum touch target (Apple HIG / Material accessibility). */
export const IconButton = memo(
  ({
    onPress,
    accessibilityLabel,
    children,
    style,
    disabled,
  }: IconButtonProps) => (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      {children}
    </Pressable>
  ),
);

const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.6 },
});

IconButton.displayName = 'IconButton';
