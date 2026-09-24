import type {
  Genre,
  Movie,
  MovieDetail,
  MovieImages,
  Paginated,
  Video,
} from '@domain/entities/Movie';

/**
 * Contract the presentation layer depends on. The TMDB implementation lives in
 * the data layer and can be swapped (mock, GraphQL, ...) without UI changes.
 */
export interface MovieRepository {
  getUpcomingMovies(
    page: number,
    signal?: AbortSignal,
  ): Promise<Paginated<Movie>>;
  getPopularMovies(
    page: number,
    signal?: AbortSignal,
  ): Promise<Paginated<Movie>>;
  searchMovies(
    query: string,
    page: number,
    signal?: AbortSignal,
  ): Promise<Paginated<Movie>>;
  discoverByGenre(
    genreId: number,
    page: number,
    signal?: AbortSignal,
  ): Promise<Paginated<Movie>>;
  getMovieDetail(movieId: number, signal?: AbortSignal): Promise<MovieDetail>;
  getMovieImages(movieId: number, signal?: AbortSignal): Promise<MovieImages>;
  getMovieVideos(movieId: number, signal?: AbortSignal): Promise<Video[]>;
  getGenres(signal?: AbortSignal): Promise<Genre[]>;
}
