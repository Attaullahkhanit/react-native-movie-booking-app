/** Raw TMDB v3 response shapes. Only the fields the app uses are typed. */

export interface PaginatedDto<T> {
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
}

export interface MovieDto {
  id: number;
  title: string;
  overview?: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string | null;
  genre_ids?: number[];
  vote_average?: number;
}

export interface GenreDto {
  id: number;
  name: string;
}

export interface MovieDetailDto extends Omit<MovieDto, 'genre_ids'> {
  tagline?: string | null;
  runtime?: number | null;
  genres?: GenreDto[];
}

export interface ImageDto {
  file_path: string;
  aspect_ratio: number;
  width: number;
  height: number;
  iso_639_1: string | null;
}

export interface MovieImagesDto {
  id: number;
  backdrops?: ImageDto[];
  posters?: ImageDto[];
  logos?: ImageDto[];
}

export interface VideoDto {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
  published_at?: string | null;
}

export interface VideosDto {
  id: number;
  results: VideoDto[];
}

export interface GenresDto {
  genres: GenreDto[];
}
