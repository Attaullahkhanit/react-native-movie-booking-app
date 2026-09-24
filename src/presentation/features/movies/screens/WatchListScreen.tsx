import { useCallback, useMemo } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

import { useResponsive } from '@core/hooks/useResponsive';
import { colors, layout, spacing } from '@core/theme';
import type { Movie } from '@domain/entities/Movie';
import { IconButton } from '@presentation/components/IconButton';
import { SearchIcon } from '@presentation/components/Icons';
import { ScreenHeader } from '@presentation/components/ScreenHeader';
import {
  EmptyState,
  ErrorState,
  OfflineState,
} from '@presentation/components/StateViews';
import { isWaitingForNetwork } from '@presentation/hooks/queryStatus';
import {
  usePrefetchMovie,
  useUpcomingMovies,
} from '@presentation/hooks/useMovieQueries';
import type { WatchScreenProps } from '@presentation/navigation/types';
import { MovieCard } from '../components/MovieCard';
import { MovieGridSkeleton } from '../components/MovieGridSkeleton';

const GAP = spacing.lg;
const MIN_CARD_WIDTH = 320;

export const WatchListScreen = ({
  navigation,
}: WatchScreenProps<'WatchList'>) => {
  const insets = useSafeAreaInsets();
  const rootNavigation = useNavigation();
  const { width, gridColumns } = useResponsive();
  const prefetchMovie = usePrefetchMovie();
  const upcoming = useUpcomingMovies();
  const {
    data,
    error,
    isPending,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = upcoming;

  // Portrait phone = 1 column, landscape / tablet = 2-3 columns.
  const columns = gridColumns(MIN_CARD_WIDTH, 3);
  const horizontalPadding =
    layout.screenPadding + Math.max(insets.left, insets.right);
  const itemWidth = Math.floor(
    (width - horizontalPadding * 2 - GAP * (columns - 1)) / columns,
  );

  const openDetail = useCallback(
    (movie: Movie) =>
      rootNavigation.navigate('MovieDetail', {
        movieId: movie.id,
        title: movie.title,
      }),
    [rootNavigation],
  );

  const renderItem = useCallback<ListRenderItem<Movie>>(
    ({ item }) => (
      // Each cell carries half the gap on both sides (FlashList has no
      // columnWrapperStyle); the list padding compensates at the edges.
      <View style={styles.cell}>
        <MovieCard
          movie={item}
          width={itemWidth}
          onPress={openDetail}
          onPressIn={prefetchMovie}
        />
      </View>
    ),
    [itemWidth, openDetail, prefetchMovie],
  );

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const skeletonStyle = useMemo(
    () => [styles.skeleton, { paddingHorizontal: horizontalPadding }],
    [horizontalPadding],
  );
  const listContentStyle = useMemo(
    () => ({
      paddingTop: GAP,
      paddingHorizontal: horizontalPadding - GAP / 2,
    }),
    [horizontalPadding],
  );

  const header = (
    <ScreenHeader
      title="Watch"
      right={
        <IconButton
          accessibilityLabel="Search movies"
          onPress={() => navigation.navigate('Search')}
        >
          <SearchIcon />
        </IconButton>
      }
    />
  );

  if (isWaitingForNetwork(upcoming)) {
    return (
      <View style={styles.screen}>
        {header}
        <OfflineState />
      </View>
    );
  }

  if (isPending) {
    return (
      <View style={styles.screen}>
        {header}
        <View style={skeletonStyle}>
          <MovieGridSkeleton columns={columns} itemWidth={itemWidth} />
        </View>
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.screen}>
        {header}
        <ErrorState error={error} onRetry={refetch} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {header}
      <FlashList
        // Remount on rotation so column count and cell widths reset cleanly.
        key={`cols-${columns}`}
        data={data?.movies}
        numColumns={columns}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={listContentStyle}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No upcoming movies"
            message="Pull down to refresh."
          />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <MovieGridSkeleton
                columns={columns}
                itemWidth={itemWidth}
                rows={1}
              />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const keyExtractor = (movie: Movie) => String(movie.id);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  skeleton: { paddingVertical: GAP },
  cell: { paddingHorizontal: GAP / 2, paddingBottom: GAP },
  footer: { paddingHorizontal: GAP / 2 },
});
