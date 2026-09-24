import type { AxiosInstance } from 'axios';

import type {
  GenresDto,
  MovieDetailDto,
  MovieDto,
  MovieImagesDto,
  PaginatedDto,
  VideosDto,
} from '@data/dto/tmdb.dto';

/** Thin HTTP wrapper around the TMDB endpoints. Returns raw DTOs only. */
export class TmdbRemoteDataSource {
  constructor(private readonly http: AxiosInstance) {}

  private async get<T>(url: string, params?: object, signal?: AbortSignal) {
    const { data } = await this.http.get<T>(url, { params, signal });
    return data;
  }

  getUpcoming(page: number, signal?: AbortSignal) {
    return this.get<PaginatedDto<MovieDto>>(
      '/movie/upcoming',
      { page },
      signal,
    );
  }

  getPopular(page: number, signal?: AbortSignal) {
    return this.get<PaginatedDto<MovieDto>>('/movie/popular', { page }, signal);
  }

  search(query: string, page: number, signal?: AbortSignal) {
    return this.get<PaginatedDto<MovieDto>>(
      '/search/movie',
      { query, page, include_adult: false },
      signal,
    );
  }

  discoverByGenre(genreId: number, page: number, signal?: AbortSignal) {
    return this.get<PaginatedDto<MovieDto>>(
      '/discover/movie',
      {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc',
        include_adult: false,
      },
      signal,
    );
  }

  getDetail(movieId: number, signal?: AbortSignal) {
    return this.get<MovieDetailDto>(`/movie/${movieId}`, undefined, signal);
  }

  getImages(movieId: number, signal?: AbortSignal) {
    // `language` would filter out language-neutral backdrops, so override it.
    return this.get<MovieImagesDto>(
      `/movie/${movieId}/images`,
      { language: undefined, include_image_language: 'en,null' },
      signal,
    );
  }

  getVideos(movieId: number, signal?: AbortSignal) {
    return this.get<VideosDto>(`/movie/${movieId}/videos`, undefined, signal);
  }

  getGenres(signal?: AbortSignal) {
    return this.get<GenresDto>('/genre/movie/list', undefined, signal);
  }
}
