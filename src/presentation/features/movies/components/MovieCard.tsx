import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, radius, spacing } from '@core/theme';
import { listImageSize, tmdbImageUrl } from '@core/utils/image';
import type { Movie } from '@domain/entities/Movie';
import { AppText } from '@presentation/components/AppText';
import { RemoteImage } from '@presentation/components/RemoteImage';

/** Figma card is 335 x 180. */
export const MOVIE_CARD_ASPECT = 180 / 335;

interface MovieCardProps {
  movie: Movie;
  width: number;
  onPress: (movie: Movie) => void;
  onPressIn?: (movieId: number) => void;
}

export const MovieCard = memo(
  ({ movie, width, onPress, onPressIn }: MovieCardProps) => {
    const height = Math.round(width * MOVIE_CARD_ASPECT);
    const uri = movie.backdropPath
      ? tmdbImageUrl(movie.backdropPath, listImageSize(width))
      : tmdbImageUrl(movie.posterPath, listImageSize(width));

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
        accessibilityLabel={movie.title}
        accessibilityHint="Opens movie details"
        style={({ pressed }) => [
          styles.card,
          { width, height },
          pressed && styles.pressed,
        ]}
      >
        <RemoteImage uri={uri} style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.75)']}
          locations={[0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.titleWrap}>
          <AppText variant="title" color={colors.textOnDark} numberOfLines={2}>
            {movie.title}
          </AppText>
        </View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.tabBar,
    justifyContent: 'flex-end',
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  titleWrap: { padding: spacing.xl },
});

MovieCard.displayName = 'MovieCard';
