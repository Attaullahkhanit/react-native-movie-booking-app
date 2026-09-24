import { TextStyle } from 'react-native';

export const fonts = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
} as const;

const make = (
  fontFamily: string,
  fontSize: number,
  lineHeight: number,
): TextStyle => ({ fontFamily, fontSize, lineHeight });

export const typography = {
  display: make(fonts.medium, 24, 32),
  title: make(fonts.medium, 18, 26),
  heading: make(fonts.medium, 16, 24),
  body: make(fonts.regular, 14, 20),
  bodyMedium: make(fonts.medium, 14, 20),
  bodySmall: make(fonts.regular, 12, 18),
  caption: make(fonts.medium, 12, 16),
  tiny: make(fonts.regular, 10, 14),
  button: make(fonts.semiBold, 14, 20),
} as const;

export type TypographyVariant = keyof typeof typography;
