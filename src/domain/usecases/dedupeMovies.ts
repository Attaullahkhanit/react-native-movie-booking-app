import type { Movie } from '@domain/entities/Movie';

/**
 * TMDB pagination is not stable: a movie can appear on two pages when the
 * ranking shifts between requests. Duplicate keys break list recycling, so dedupe.
 */
export const dedupeMovies = (pages: Movie[][]): Movie[] => {
  const seen = new Set<number>();
  const result: Movie[] = [];
  for (const page of pages) {
    for (const movie of page) {
      if (!seen.has(movie.id)) {
        seen.add(movie.id);
        result.push(movie);
      }
    }
  }
  return result;
};
