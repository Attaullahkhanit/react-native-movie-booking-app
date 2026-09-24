export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 27,
  pill: 999,
} as const;

export const layout = {
  /** Horizontal gutter used by the Figma frames (375pt wide). */
  screenPadding: 20,
  headerHeight: 56,
  tabBarHeight: 75,
  /** Upper bound so forms do not stretch edge-to-edge on tablets. */
  maxContentWidth: 900,
} as const;
