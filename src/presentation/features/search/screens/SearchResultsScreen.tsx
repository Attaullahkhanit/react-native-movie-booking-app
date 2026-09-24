import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

import { useResponsive } from '@core/hooks/useResponsive';
import { colors, layout, spacing } from '@core/theme';
import type { Movie } from '@domain/entities/Movie';
import { ScreenHeader } from '@presentation/components/ScreenHeader';
import {
  EmptyState,
  ErrorState,
  OfflineState,
} from '@presentation/components/StateViews';
import { isWaitingForNetwork } from '@presentation/hooks/queryStatus';
import {
  MovieListSource,
  useGenreLookup,
  useMovieList,
  usePrefetchMovie,
} from '@presentation/hooks/useMovieQueries';
import type { WatchScreenProps } from '@presentation/navigation/types';
import {
  SearchResultItem,
  SearchResultSkeleton,
} from '../components/SearchResultItem';

const MIN_RESULT_WIDTH = 340;
const ROW_GAP = spacing.xl;
const COLUMN_GAP = spacing.xl;

export const SearchResultsScreen = ({
  route,
}: WatchScreenProps<'SearchResults'>) => {
  const params = route.params;
  const insets = useSafeAreaInsets();
  const rootNavigation = useNavigation();
  const { gridColumns } = useResponsive();
  const genreLookup = useGenreLookup();
  const prefetchMovie = usePrefetchMovie();

  const source = useMemo<MovieListSource>(
    () =>
      params.kind === 'search'
        ? { kind: 'search', query: params.query }
        : { kind: 'genre', genreId: params.genreId },
    [params],
  );
  const list = useMovieList(source);
  const {
    data,
    error,
    isPending,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = list;
  const offline = isWaitingForNetwork(list);

  const columns = gridColumns(MIN_RESULT_WIDTH, 2);
  const horizontalPadding =
    layout.screenPadding + Math.max(insets.left, insets.right);

  const total = data?.totalResults ?? 0;
  const title = offline
    ? 'Offline'
    : isPending
      ? 'Searching…'
      : `${total.toLocaleString()} ${total === 1 ? 'Result' : 'Results'} Found`;
  const subtitle =
    params.kind === 'genre' ? params.genreName : `“${params.query}”`;

  const openMovie = useCallback(
    (movie: Movie) =>
      rootNavigation.navigate('MovieDetail', {
        movieId: movie.id,
        title: movie.title,
      }),
    [rootNavigation],
  );

  const renderItem = useCallback<ListRenderItem<Movie>>(
    ({ item }) => (
      <View style={styles.cell}>
        <SearchResultItem
          movie={item}
          genreName={genreLookup.get(item.genreIds[0])}
          onPress={openMovie}
          onPressIn={prefetchMovie}
        />
      </View>
    ),
    [genreLookup, openMovie, prefetchMovie],
  );

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  let content: React.ReactNode;
  if (offline) {
    content = <OfflineState />;
  } else if (isPending) {
    content = (
      <View style={[styles.skeleton, { paddingHorizontal: horizontalPadding }]}>
        {[0, 1, 2, 3, 4].map(i => (
          <SearchResultSkeleton key={i} />
        ))}
      </View>
    );
  } else if (!data) {
    content = <ErrorState error={error} onRetry={refetch} />;
  } else {
    content = (
      <FlashList
        key={`cols-${columns}`}
        data={data.movies}
        numColumns={columns}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          paddingTop: ROW_GAP,
          paddingHorizontal: horizontalPadding - COLUMN_GAP / 2,
        }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <EmptyState
            title="Nothing found"
            message="Try a different keyword or genre."
          />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <SearchResultSkeleton />
              <SearchResultSkeleton />
            </View>
          ) : null
        }
      />
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title={title} subtitle={subtitle} showBack />
      {content}
    </View>
  );
};

const keyExtractor = (movie: Movie) => String(movie.id);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  // Half the column gap on each side; list padding compensates at the edges.
  cell: { paddingHorizontal: COLUMN_GAP / 2, paddingBottom: ROW_GAP },
  skeleton: { gap: ROW_GAP, paddingVertical: spacing.xl },
  footer: { paddingHorizontal: COLUMN_GAP / 2, gap: ROW_GAP },
});
