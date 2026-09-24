import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

import { SEARCH_DEBOUNCE_MS } from '@core/config/constants';
import { useDebouncedValue } from '@core/hooks/useDebouncedValue';
import { useResponsive } from '@core/hooks/useResponsive';
import { colors, layout, radius, spacing } from '@core/theme';
import type { Genre, Movie } from '@domain/entities/Movie';
import { AppText } from '@presentation/components/AppText';
import { SearchBar } from '@presentation/components/SearchBar';
import { Skeleton } from '@presentation/components/Skeleton';
import {
  EmptyState,
  ErrorState,
  OfflineState,
} from '@presentation/components/StateViews';
import { isWaitingForNetwork } from '@presentation/hooks/queryStatus';
import {
  useGenreLookup,
  useGenres,
  usePrefetchMovie,
  useSearchPreview,
} from '@presentation/hooks/useMovieQueries';
import type { WatchScreenProps } from '@presentation/navigation/types';
import { GENRE_TILE_ASPECT, GenreTile } from '../components/GenreTile';
import {
  RESULT_ITEM_HEIGHT,
  SearchResultItem,
  SearchResultSkeleton,
} from '../components/SearchResultItem';
import { useGenreBackdrops } from '../hooks/useGenreBackdrops';

const GAP = spacing.md;
const MIN_TILE_WIDTH = 160;
const MIN_RESULT_WIDTH = 340;
const PREVIEW_LIMIT = 10;
const RESULT_GAP = spacing.xl;

export const SearchScreen = ({ navigation }: WatchScreenProps<'Search'>) => {
  const insets = useSafeAreaInsets();
  const rootNavigation = useNavigation();
  const { width, gridColumns } = useResponsive();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query.trim(), SEARCH_DEBOUNCE_MS);
  const isSearching = query.trim().length > 0;

  const genres = useGenres();
  const genreLookup = useGenreLookup();
  const backdrops = useGenreBackdrops(genres.data);
  const preview = useSearchPreview(debouncedQuery);
  const prefetchMovie = usePrefetchMovie();

  const horizontalPadding =
    layout.screenPadding + Math.max(insets.left, insets.right);
  const contentWidth = width - horizontalPadding * 2;
  const tileColumns = gridColumns(MIN_TILE_WIDTH, 4);
  const tileWidth = Math.floor(
    (contentWidth - GAP * (tileColumns - 1)) / tileColumns,
  );
  const resultColumns = gridColumns(MIN_RESULT_WIDTH, 2);

  const onClear = useCallback(() => {
    if (query.length > 0) {
      setQuery('');
    } else {
      navigation.goBack();
    }
  }, [navigation, query.length]);

  const onSubmit = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed) {
      navigation.navigate('SearchResults', { kind: 'search', query: trimmed });
    }
  }, [navigation, query]);

  const openGenre = useCallback(
    (genre: Genre) =>
      navigation.navigate('SearchResults', {
        kind: 'genre',
        genreId: genre.id,
        genreName: genre.name,
      }),
    [navigation],
  );

  const openMovie = useCallback(
    (movie: Movie) =>
      rootNavigation.navigate('MovieDetail', {
        movieId: movie.id,
        title: movie.title,
      }),
    [rootNavigation],
  );

  const renderGenre = useCallback<ListRenderItem<Genre>>(
    ({ item }) => (
      <View style={styles.tileCell}>
        <GenreTile
          genre={item}
          backdropPath={backdrops.get(item.id)}
          width={tileWidth}
          onPress={openGenre}
        />
      </View>
    ),
    [backdrops, openGenre, tileWidth],
  );

  const renderResult = useCallback<ListRenderItem<Movie>>(
    ({ item }) => (
      <View style={styles.resultCell}>
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

  const renderGenres = () => {
    if (isWaitingForNetwork(genres)) {
      return <OfflineState />;
    }
    if (genres.isPending) {
      return (
        <View
          style={[
            styles.skeletonGrid,
            { paddingHorizontal: horizontalPadding },
          ]}
        >
          {Array.from({ length: tileColumns * 5 }, (_, i) => (
            <Skeleton
              key={i}
              width={tileWidth}
              height={Math.round(tileWidth * GENRE_TILE_ASPECT)}
              radius={radius.md}
            />
          ))}
        </View>
      );
    }
    if (!genres.data) {
      return <ErrorState error={genres.error} onRetry={genres.refetch} />;
    }
    return (
      <FlashList
        key={`genres-${tileColumns}`}
        data={genres.data}
        numColumns={tileColumns}
        renderItem={renderGenre}
        keyExtractor={genreKey}
        contentContainerStyle={{
          paddingTop: spacing.xl,
          paddingHorizontal: horizontalPadding - GAP / 2,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    );
  };

  const renderResults = () => {
    const results = preview.data?.results.slice(0, PREVIEW_LIMIT);
    const offline = isWaitingForNetwork(preview);
    const waiting =
      !offline &&
      (preview.isPending || (query.trim() !== debouncedQuery && !results));

    return (
      <View style={[styles.flex, { paddingHorizontal: horizontalPadding }]}>
        <AppText
          variant="caption"
          style={styles.sectionTitle}
          accessibilityRole="header"
        >
          Top Results
        </AppText>
        <View style={styles.divider} />
        {offline ? (
          <OfflineState />
        ) : waiting ? (
          <View style={styles.skeletonList}>
            {[0, 1, 2, 3].map(i => (
              <SearchResultSkeleton key={i} />
            ))}
          </View>
        ) : preview.error && !results ? (
          <ErrorState error={preview.error} onRetry={preview.refetch} />
        ) : (
          <FlashList
            key={`results-${resultColumns}`}
            data={results}
            numColumns={resultColumns}
            renderItem={renderResult}
            keyExtractor={movieKey}
            // Cells carry half the column gap; pull the list out to align edges.
            style={styles.resultsList}
            contentContainerStyle={styles.resultsContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            ListEmptyComponent={
              <EmptyState
                title="No results"
                message={`We couldn't find anything for "${debouncedQuery}".`}
              />
            }
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + spacing.md,
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={onClear}
          onSubmitEditing={onSubmit}
        />
      </View>
      {isSearching ? renderResults() : renderGenres()}
    </View>
  );
};

const genreKey = (genre: Genre) => String(genre.id);
const movieKey = (movie: Movie) => String(movie.id);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    backgroundColor: colors.surface,
    paddingBottom: spacing.lg,
  },
  tileCell: { paddingHorizontal: GAP / 2, paddingBottom: GAP },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    paddingVertical: spacing.xl,
  },
  sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.sm },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.11)',
  },
  skeletonList: { gap: spacing.xl, paddingTop: spacing.xl },
  resultsList: { marginHorizontal: -RESULT_GAP / 2 },
  resultsContent: { paddingTop: spacing.xl },
  resultCell: {
    minHeight: RESULT_ITEM_HEIGHT,
    paddingHorizontal: RESULT_GAP / 2,
    paddingBottom: RESULT_GAP,
  },
});
