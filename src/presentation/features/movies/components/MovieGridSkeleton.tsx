import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@core/theme';
import { Skeleton } from '@presentation/components/Skeleton';
import { MOVIE_CARD_ASPECT } from './MovieCard';

interface Props {
  columns: number;
  itemWidth: number;
  rows?: number;
}

export const MovieGridSkeleton = memo(
  ({ columns, itemWidth, rows = 4 }: Props) => (
    <View style={styles.container} accessibilityLabel="Loading movies">
      {Array.from({ length: rows }, (_, r) => (
        <View key={r} style={styles.row}>
          {Array.from({ length: columns }, (__, c) => (
            <Skeleton
              key={c}
              width={itemWidth}
              height={Math.round(itemWidth * MOVIE_CARD_ASPECT)}
              radius={radius.md}
            />
          ))}
        </View>
      ))}
    </View>
  ),
);

const styles = StyleSheet.create({
  container: { gap: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.lg },
});

MovieGridSkeleton.displayName = 'MovieGridSkeleton';
