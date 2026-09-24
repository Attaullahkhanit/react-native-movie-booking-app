import { memo, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, radius, spacing } from '@core/theme';
import { listImageSize, tmdbImageUrl } from '@core/utils/image';
import type { Genre } from '@domain/entities/Movie';
import { AppText } from '@presentation/components/AppText';
import { RemoteImage } from '@presentation/components/RemoteImage';

export const GENRE_TILE_ASPECT = 100 / 163;

interface GenreTileProps {
  genre: Genre;
  backdropPath: string | undefined;
  width: number;
  onPress: (genre: Genre) => void;
}

export const GenreTile = memo(
  ({ genre, backdropPath, width, onPress }: GenreTileProps) => {
    const handlePress = useCallback(() => onPress(genre), [genre, onPress]);
    return (
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`${genre.name} movies`}
        style={({ pressed }) => [
          styles.tile,
          { width, height: Math.round(width * GENRE_TILE_ASPECT) },
          pressed && styles.pressed,
        ]}
      >
        <RemoteImage
          uri={tmdbImageUrl(backdropPath, listImageSize(width))}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          locations={[0.3, 1]}
          style={StyleSheet.absoluteFill}
        />
        <AppText
          variant="title"
          color={colors.textOnDark}
          numberOfLines={1}
          style={styles.label}
        >
          {genre.name}
        </AppText>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  tile: {
    borderRadius: radius.md,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: colors.tabBar,
  },
  pressed: { opacity: 0.85 },
  label: { padding: spacing.md },
});

GenreTile.displayName = 'GenreTile';
