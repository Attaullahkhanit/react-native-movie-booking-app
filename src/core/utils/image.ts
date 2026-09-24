import { PixelRatio } from 'react-native';

import { env } from '@core/config/env';

/** Widths the TMDB image CDN serves for posters and backdrops alike. */
export type ImageSize =
  'w92' | 'w185' | 'w300' | 'w342' | 'w500' | 'w780' | 'w1280';

export const tmdbImageUrl = (
  path: string | null | undefined,
  size: ImageSize,
) => (path ? `${env.tmdbImageBaseUrl}/${size}${path}` : undefined);

/** Candidate sizes for list imagery, smallest first. w342 is the list baseline. */
const LIST_SIZES: { size: ImageSize; px: number }[] = [
  { size: 'w342', px: 342 },
  { size: 'w500', px: 500 },
  { size: 'w780', px: 780 },
  { size: 'w1280', px: 1280 },
];

/**
 * Up to ~1.33x upscaling is imperceptible on high-density screens, so we
 * accept a source 25% narrower than the physical box before stepping up.
 */
const UPSCALE_TOLERANCE = 0.75;

/**
 * Smallest TMDB size that looks sharp for a box `physicalPx` wide. Pure so it
 * can be unit tested; use `listImageSize` from components.
 */
export const pickImageSize = (physicalPx: number): ImageSize => {
  const needed = physicalPx * UPSCALE_TOLERANCE;
  return (
    LIST_SIZES.find(s => s.px >= needed)?.size ??
    LIST_SIZES[LIST_SIZES.length - 1].size
  );
};

/** Size tier for an image rendered `widthDp` wide on this device. */
export const listImageSize = (widthDp: number): ImageSize =>
  pickImageSize(PixelRatio.getPixelSizeForLayoutSize(widthDp));

/** Static thumbnail for a YouTube video (480x360, always available). */
export const youtubeThumbnailUrl = (videoKey: string) =>
  `https://i.ytimg.com/vi/${encodeURIComponent(videoKey)}/hqdefault.jpg`;
