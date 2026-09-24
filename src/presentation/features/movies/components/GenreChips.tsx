import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, genreChipColors, radius, spacing } from '@core/theme';
import type { Genre } from '@domain/entities/Movie';
import { AppText } from '@presentation/components/AppText';

export const GenreChips = memo(({ genres }: { genres: Genre[] }) => (
  <View
    style={styles.row}
    accessibilityLabel={`Genres: ${genres.map(g => g.name).join(', ')}`}
  >
    {genres.map((genre, i) => (
      <View
        key={genre.id}
        style={[
          styles.chip,
          { backgroundColor: genreChipColors[i % genreChipColors.length] },
        ]}
      >
        <AppText variant="caption" color={colors.textOnDark}>
          {genre.name}
        </AppText>
      </View>
    ))}
  </View>
));

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs + 1 },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
  },
});

GenreChips.displayName = 'GenreChips';
