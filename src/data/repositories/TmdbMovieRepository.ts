import type { MovieRepository } from '@domain/repositories/MovieRepository';
import type { TmdbRemoteDataSource } from '@data/datasources/TmdbRemoteDataSource';
import {
  mapGenre,
  mapMovie,
  mapMovieDetail,
  mapMovieImages,
  mapPaginated,
  mapVideo,
} from '@data/mappers/movieMapper';

export class TmdbMovieRepository implements MovieRepository {
  constructor(private readonly remote: TmdbRemoteDataSource) {}

  async getUpcomingMovies(page: number, signal?: AbortSignal) {
    return mapPaginated(await this.remote.getUpcoming(page, signal), mapMovie);
  }

  async getPopularMovies(page: number, signal?: AbortSignal) {
    return mapPaginated(await this.remote.getPopular(page, signal), mapMovie);
  }

  async searchMovies(query: string, page: number, signal?: AbortSignal) {
    return mapPaginated(
      await this.remote.search(query, page, signal),
      mapMovie,
    );
  }

  async discoverByGenre(genreId: number, page: number, signal?: AbortSignal) {
    return mapPaginated(
      await this.remote.discoverByGenre(genreId, page, signal),
      mapMovie,
    );
  }

  async getMovieDetail(movieId: number, signal?: AbortSignal) {
    return mapMovieDetail(await this.remote.getDetail(movieId, signal));
  }

  async getMovieImages(movieId: number, signal?: AbortSignal) {
    return mapMovieImages(await this.remote.getImages(movieId, signal));
  }

  async getMovieVideos(movieId: number, signal?: AbortSignal) {
    const dto = await this.remote.getVideos(movieId, signal);
    return dto.results.map(mapVideo);
  }

  async getGenres(signal?: AbortSignal) {
    const dto = await this.remote.getGenres(signal);
    return dto.genres.map(mapGenre);
  }
}
