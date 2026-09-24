import type {
  Genre,
  Movie,
  MovieDetail,
  MovieImage,
  MovieImages,
  Paginated,
  Video,
} from '@domain/entities/Movie';
import type {
  GenreDto,
  ImageDto,
  MovieDetailDto,
  MovieDto,
  MovieImagesDto,
  PaginatedDto,
  VideoDto,
} from '@data/dto/tmdb.dto';

const emptyToNull = (value: string | null | undefined) =>
  value && value.trim().length > 0 ? value : null;

export const mapMovie = (dto: MovieDto): Movie => ({
  id: dto.id,
  title: dto.title,
  overview: dto.overview ?? '',
  posterPath: emptyToNull(dto.poster_path),
  backdropPath: emptyToNull(dto.backdrop_path),
  releaseDate: emptyToNull(dto.release_date),
  genreIds: dto.genre_ids ?? [],
  voteAverage: dto.vote_average ?? 0,
});

export const mapPaginated = <TDto, T>(
  dto: PaginatedDto<TDto>,
  mapItem: (item: TDto) => T,
): Paginated<T> => ({
  page: dto.page,
  totalPages: dto.total_pages,
  totalResults: dto.total_results,
  results: dto.results.map(mapItem),
});

export const mapGenre = (dto: GenreDto): Genre => ({
  id: dto.id,
  name: dto.name,
});

export const mapMovieDetail = (dto: MovieDetailDto): MovieDetail => ({
  id: dto.id,
  title: dto.title,
  tagline: emptyToNull(dto.tagline),
  overview: dto.overview ?? '',
  posterPath: emptyToNull(dto.poster_path),
  backdropPath: emptyToNull(dto.backdrop_path),
  releaseDate: emptyToNull(dto.release_date),
  runtimeMinutes: dto.runtime ?? null,
  voteAverage: dto.vote_average ?? 0,
  genres: (dto.genres ?? []).map(mapGenre),
});

const mapImage = (dto: ImageDto): MovieImage => ({
  filePath: dto.file_path,
  aspectRatio: dto.aspect_ratio,
  width: dto.width,
  height: dto.height,
  language: dto.iso_639_1,
});

/** Gallery cap: TMDB can return 100+ images per movie; the UI shows 12. */
export const MAX_BACKDROPS = 12;

/**
 * Trims the images payload to what the UI renders (one logo, a capped
 * backdrop gallery, no posters) so the rest never occupies memory or the
 * persisted offline cache.
 */
export const mapMovieImages = (dto: MovieImagesDto): MovieImages => {
  const logos = dto.logos ?? [];
  const logo = logos.find(l => l.iso_639_1 === 'en') ?? logos[0];
  return {
    logo: logo ? mapImage(logo) : null,
    backdrops: (dto.backdrops ?? []).slice(0, MAX_BACKDROPS).map(mapImage),
  };
};

export const mapVideo = (dto: VideoDto): Video => ({
  id: dto.id,
  key: dto.key,
  name: dto.name,
  site: dto.site,
  type: dto.type,
  official: dto.official ?? false,
  publishedAt: dto.published_at ?? null,
});
