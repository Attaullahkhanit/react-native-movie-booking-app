import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

const TABLET_MIN_SIDE = 600;

/**
 * Orientation- and size-aware layout helpers. Re-renders on rotation because
 * it is backed by useWindowDimensions.
 */
export const useResponsive = () => {
  const { width, height, fontScale } = useWindowDimensions();

  return useMemo(() => {
    const isLandscape = width > height;
    const isTablet = Math.min(width, height) >= TABLET_MIN_SIDE;
    /** Number of columns so each item is at least `minItemWidth` wide. */
    const gridColumns = (minItemWidth: number, max = 4) =>
      Math.max(1, Math.min(max, Math.floor(width / minItemWidth)));

    return { width, height, fontScale, isLandscape, isTablet, gridColumns };
  }, [width, height, fontScale]);
};
