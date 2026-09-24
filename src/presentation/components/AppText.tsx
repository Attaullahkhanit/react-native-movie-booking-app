import { memo } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { colors, typography, TypographyVariant } from '@core/theme';

interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

/** Typed text primitive so every string uses the Poppins scale from Figma. */
export const AppText = memo(
  ({
    variant = 'body',
    color = colors.textPrimary,
    align,
    style,
    maxFontSizeMultiplier = 1.4,
    ...rest
  }: AppTextProps) => (
    <Text
      {...rest}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[
        styles.base,
        typography[variant],
        { color, textAlign: align },
        style,
      ]}
    />
  ),
);

const styles = StyleSheet.create({
  // Android adds extra top padding to custom fonts; this keeps them centred.
  base: { includeFontPadding: false },
});

AppText.displayName = 'AppText';
