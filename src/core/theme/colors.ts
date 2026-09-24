/** Palette taken from the Figma "Guide" frame. */
export const palette = {
  darkPurple: '#2E2739',
  offWhite: '#F6F6FA',
  grey: '#8F8F8F',
  lightGrey: '#DBDBDF',
  skyBlue: '#61C3F2',
  teal: '#15D2BC',
  pink: '#E26CA5',
  purple: '#564CA3',
  gold: '#CD9D0F',
  navy: '#202C43',
  white: '#FFFFFF',
  black: '#000000',
  red: '#E0475C',
  green: '#1FA774',
} as const;

export const colors = {
  background: palette.offWhite,
  surface: palette.white,
  textPrimary: palette.navy,
  textSecondary: palette.grey,
  textMuted: palette.lightGrey,
  textOnDark: palette.white,
  primary: palette.skyBlue,
  divider: '#EFEFEF',
  lightBorder: '#E5E5EA',
  tabBar: palette.darkPurple,
  tabInactive: '#827D88',
  skeletonBase: '#E4E4EA',
  skeletonHighlight: '#F7F7FB',
  overlay: 'rgba(0,0,0,0.55)',
  seatRegular: palette.skyBlue,
  seatVip: palette.purple,
  seatUnavailable: palette.lightGrey,
  seatSelected: palette.gold,
  error: palette.red,
  success: palette.green,
} as const;

/** Rotating accent colours used for genre chips on the detail screen. */
export const genreChipColors = [
  palette.teal,
  palette.pink,
  palette.purple,
  palette.gold,
] as const;
