import type { Movie } from '@domain/entities/Movie';
import { dedupeMovies } from '@domain/usecases/dedupeMovies';

const movie = (id: number): Movie => ({
  id,
  title: `Movie ${id}`,
  overview: '',
  posterPath: null,
  backdropPath: null,
  releaseDate: null,
  genreIds: [],
  voteAverage: 0,
});

describe('dedupeMovies', () => {
  it('flattens pages and drops duplicates while keeping first-seen order', () => {
    const result = dedupeMovies([
      [movie(1), movie(2)],
      [movie(2), movie(3)],
    ]);
    expect(result.map(m => m.id)).toEqual([1, 2, 3]);
  });
});
