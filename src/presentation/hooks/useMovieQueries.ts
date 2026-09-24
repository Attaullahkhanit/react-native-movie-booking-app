import { useCallback, useMemo } from 'react';
import {
  InfiniteData,
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { movieRepository } from '@app/di';
import { TIME } from '@core/config/constants';
import type { Genre, Movie, Paginated } from '@domain/entities/Movie';
import { dedupeMovies } from '@domain/usecases/dedupeMovies';
import { playableVideos, selectTrailer } from '@domain/usecases/selectTrailer';
import { movieKeys } from './queryKeys';

type MoviePages = InfiniteData<Paginated<Movie>, number>;

const nextPage = (last: Paginated<Movie>) =>
  last.page < last.totalPages ? last.page + 1 : undefined;

const flattenPages = (data: MoviePages) => ({
  movies: dedupeMovies(data.pages.map(p => p.results)),
  totalResults: data.pages[0]?.totalResults ?? 0,
});

export const useUpcomingMovies = () =>
  useInfiniteQuery({
    queryKey: movieKeys.upcoming(),
    queryFn: ({ pageParam, signal }) =>
      movieRepository.getUpcomingMovies(pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    staleTime: 30 * TIME.MINUTE,
    select: flattenPages,
  });

export const usePopularMovies = () =>
  useQuery({
    queryKey: movieKeys.popular(),
    queryFn: ({ signal }) => movieRepository.getPopularMovies(1, signal),
    staleTime: TIME.HOUR,
    select: data => data.results,
  });

/** Live "Top results" while typing. Keeps previous results to avoid flicker. */
export const useSearchPreview = (query: string) =>
  useQuery({
    queryKey: [...movieKeys.search(query), 'preview'],
    queryFn: ({ signal }) => movieRepository.searchMovies(query, 1, signal),
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 5 * TIME.MINUTE,
  });

export type MovieListSource =
  { kind: 'search'; query: string } | { kind: 'genre'; genreId: number };

/** Paginated results for a submitted search or a tapped genre tile. */
export const useMovieList = (source: MovieListSource) =>
  useInfiniteQuery({
    queryKey:
      source.kind === 'search'
        ? movieKeys.search(source.query)
        : movieKeys.byGenre(source.genreId),
    queryFn: ({ pageParam, signal }) =>
      source.kind === 'search'
        ? movieRepository.searchMovies(source.query, pageParam, signal)
        : movieRepository.discoverByGenre(source.genreId, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    staleTime: 5 * TIME.MINUTE,
    select: flattenPages,
  });

export const useGenres = () =>
  useQuery({
    queryKey: movieKeys.genres(),
    queryFn: ({ signal }) => movieRepository.getGenres(signal),
    // Genres practically never change.
    staleTime: TIME.DAY,
  });

/** id -> name lookup for list rows that only carry `genre_ids`. */
export const useGenreLookup = () => {
  const { data } = useGenres();
  return useMemo(() => {
    const map = new Map<number, string>();
    data?.forEach((g: Genre) => map.set(g.id, g.name));
    return map;
  }, [data]);
};

export const useMovieDetail = (movieId: number) =>
  useQuery({
    queryKey: movieKeys.detail(movieId),
    queryFn: ({ signal }) => movieRepository.getMovieDetail(movieId, signal),
    staleTime: TIME.HOUR,
  });

export const useMovieImages = (movieId: number) =>
  useQuery({
    queryKey: movieKeys.images(movieId),
    queryFn: ({ signal }) => movieRepository.getMovieImages(movieId, signal),
    staleTime: TIME.DAY,
  });

export const useMovieTrailer = (movieId: number) =>
  useQuery({
    queryKey: movieKeys.videos(movieId),
    queryFn: ({ signal }) => movieRepository.getMovieVideos(movieId, signal),
    staleTime: TIME.DAY,
    select: selectTrailer,
  });

/**
 * All playable videos (same cache entry as `useMovieTrailer`, different
 * projection), rendered as lightweight thumbnails on the detail screen.
 */
export const useMovieVideos = (movieId: number) =>
  useQuery({
    queryKey: movieKeys.videos(movieId),
    queryFn: ({ signal }) => movieRepository.getMovieVideos(movieId, signal),
    staleTime: TIME.DAY,
    select: playableVideos,
  });

/** Warm the detail cache on press-in so the detail screen opens instantly. */
export const usePrefetchMovie = () => {
  const queryClient = useQueryClient();
  return useCallback(
    (movieId: number) => {
      queryClient.prefetchQuery({
        queryKey: movieKeys.detail(movieId),
        queryFn: ({ signal }) =>
          movieRepository.getMovieDetail(movieId, signal),
        staleTime: TIME.HOUR,
      });
    },
    [queryClient],
  );
};
