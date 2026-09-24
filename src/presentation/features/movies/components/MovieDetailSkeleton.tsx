import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { layout, radius, spacing } from '@core/theme';
import { Skeleton } from '@presentation/components/Skeleton';

interface Props {
  heroWidth: number | `${number}%`;
  heroHeight: number | `${number}%`;
  horizontal: boolean;
}

export const MovieDetailSkeleton = memo(
  ({ heroWidth, heroHeight, horizontal }: Props) => (
    <View
      style={[styles.container, horizontal && styles.row]}
      accessibilityLabel="Loading movie"
    >
      <Skeleton width={heroWidth} height={heroHeight} radius={0} />
      <View style={styles.body}>
        <Skeleton width={90} height={20} />
        <View style={styles.chips}>
          {[64, 70, 72, 64].map((w, i) => (
            <Skeleton key={i} width={w} height={24} radius={radius.lg} />
          ))}
        </View>
        <Skeleton width={100} height={20} style={styles.gapTop} />
        {[100, 96, 98, 90, 60].map((w, i) => (
          <Skeleton key={i} width={`${w}%`} height={14} />
        ))}
      </View>
    </View>
  ),
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { flexDirection: 'row' },
  body: {
    flex: 1,
    padding: layout.screenPadding + spacing.sm,
    gap: spacing.md,
  },
  chips: { flexDirection: 'row', gap: spacing.xs },
  gapTop: { marginTop: spacing.lg },
});

MovieDetailSkeleton.displayName = 'MovieDetailSkeleton';
