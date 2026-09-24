export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  genreIds: number[];
  voteAverage: number;
}

export interface MovieDetail {
  id: number;
  title: string;
  tagline: string | null;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  runtimeMinutes: number | null;
  voteAverage: number;
  genres: Genre[];
}

export interface MovieImage {
  filePath: string;
  aspectRatio: number;
  width: number;
  height: number;
  language: string | null;
}

/** Only what the UI renders: a title logo and a short backdrop gallery. */
export interface MovieImages {
  logo: MovieImage | null;
  backdrops: MovieImage[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  publishedAt: string | null;
}

export interface Paginated<T> {
  page: number;
  totalPages: number;
  totalResults: number;
  results: T[];
}
