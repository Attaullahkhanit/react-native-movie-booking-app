import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@core/theme';
import { tmdbImageUrl } from '@core/utils/image';
import type { Movie } from '@domain/entities/Movie';
import { AppText } from '@presentation/components/AppText';
import { MoreDotsIcon } from '@presentation/components/Icons';
import { RemoteImage } from '@presentation/components/RemoteImage';
import { Skeleton } from '@presentation/components/Skeleton';

export const RESULT_ITEM_HEIGHT = 100;
const THUMB_WIDTH = 130;

interface SearchResultItemProps {
  movie: Movie;
  genreName: string | undefined;
  onPress: (movie: Movie) => void;
  onPressIn?: (movieId: number) => void;
}

export const SearchResultItem = memo(
  ({ movie, genreName, onPress, onPressIn }: SearchResultItemProps) => {
    const handlePress = useCallback(() => onPress(movie), [movie, onPress]);
    const handlePressIn = useCallback(
      () => onPressIn?.(movie.id),
      [movie.id, onPressIn],
    );

    return (
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        accessibilityRole="button"
        accessibilityLabel={
          genreName ? `${movie.title}, ${genreName}` : movie.title
        }
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <RemoteImage
          uri={
            tmdbImageUrl(movie.backdropPath, 'w342') ??
            tmdbImageUrl(movie.posterPath, 'w342')
          }
          style={styles.thumb}
        />
        <View style={styles.texts}>
          <AppText variant="heading" numberOfLines={2}>
            {movie.title}
          </AppText>
          {genreName ? (
            <AppText
              variant="bodySmall"
              color={colors.textMuted}
              numberOfLines={1}
            >
              {genreName}
            </AppText>
          ) : null}
        </View>
        <View
          style={styles.more}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          <MoreDotsIcon />
        </View>
      </Pressable>
    );
  },
);

export const SearchResultSkeleton = memo(() => (
  <View style={styles.row}>
    <Skeleton
      width={THUMB_WIDTH}
      height={RESULT_ITEM_HEIGHT}
      radius={radius.md}
    />
    <View style={styles.texts}>
      <Skeleton width="70%" height={18} />
      <Skeleton width="40%" height={12} />
    </View>
  </View>
));

const styles = StyleSheet.create({
  row: {
    height: RESULT_ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressed: { opacity: 0.7 },
  thumb: {
    width: THUMB_WIDTH,
    height: RESULT_ITEM_HEIGHT,
    borderRadius: radius.md,
  },
  texts: { flex: 1, paddingHorizontal: spacing.xl, gap: spacing.xs },
  more: { paddingHorizontal: spacing.xs },
});

SearchResultItem.displayName = 'SearchResultItem';
SearchResultSkeleton.displayName = 'SearchResultSkeleton';
