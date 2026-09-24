import { useMemo } from 'react';

import type { Genre, Movie } from '@domain/entities/Movie';
import {
  usePopularMovies,
  useUpcomingMovies,
} from '@presentation/hooks/useMovieQueries';

/**
 * Picks a representative backdrop per genre from movies we already have
 * cached (upcoming + one page of popular), instead of one request per genre.
 * Each image is used at most once so the grid does not repeat itself.
 */
export const useGenreBackdrops = (genres: Genre[] | undefined) => {
  const upcoming = useUpcomingMovies();
  const popular = usePopularMovies();

  return useMemo(() => {
    const result = new Map<number, string>();
    if (!genres) {
      return result;
    }
    const pool: Movie[] = [
      ...(upcoming.data?.movies ?? []),
      ...(popular.data ?? []),
    ];
    const used = new Set<string>();

    for (const genre of genres) {
      const match = pool.find(
        m =>
          m.backdropPath &&
          !used.has(m.backdropPath) &&
          m.genreIds.includes(genre.id),
      );
      if (match?.backdropPath) {
        used.add(match.backdropPath);
        result.set(genre.id, match.backdropPath);
      }
    }
    return result;
  }, [genres, upcoming.data, popular.data]);
};
