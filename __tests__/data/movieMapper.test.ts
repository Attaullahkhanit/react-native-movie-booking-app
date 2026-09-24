import {
  MAX_BACKDROPS,
  mapMovie,
  mapMovieDetail,
  mapMovieImages,
  mapPaginated,
} from '@data/mappers/movieMapper';

describe('movieMapper', () => {
  it('maps a TMDB movie DTO to the domain entity with safe defaults', () => {
    expect(
      mapMovie({
        id: 7,
        title: 'Free Guy',
        poster_path: '/p.jpg',
        backdrop_path: '',
        release_date: '',
      }),
    ).toEqual({
      id: 7,
      title: 'Free Guy',
      overview: '',
      posterPath: '/p.jpg',
      backdropPath: null,
      releaseDate: null,
      genreIds: [],
      voteAverage: 0,
    });
  });

  it('maps pagination metadata', () => {
    const page = mapPaginated(
      { page: 2, total_pages: 10, total_results: 200, results: [1, 2] },
      n => n * 2,
    );
    expect(page).toEqual({
      page: 2,
      totalPages: 10,
      totalResults: 200,
      results: [2, 4],
    });
  });

  it('maps detail genres and runtime', () => {
    const detail = mapMovieDetail({
      id: 1,
      title: "The King's Man",
      poster_path: null,
      backdrop_path: null,
      runtime: 131,
      genres: [{ id: 28, name: 'Action' }],
    });
    expect(detail.genres).toEqual([{ id: 28, name: 'Action' }]);
    expect(detail.runtimeMinutes).toBe(131);
  });
});

describe('mapMovieImages', () => {
  const image = (path: string, lang: string | null) => ({
    file_path: path,
    aspect_ratio: 1.78,
    width: 1920,
    height: 1080,
    iso_639_1: lang,
  });

  it('keeps one logo (English first) and a capped gallery, drops posters', () => {
    const result = mapMovieImages({
      id: 1,
      logos: [image('/fr.png', 'fr'), image('/en.png', 'en')],
      posters: [image('/p.jpg', 'en')],
      backdrops: Array.from({ length: 30 }, (_, i) =>
        image(`/b${i}.jpg`, null),
      ),
    });
    expect(result.logo?.filePath).toBe('/en.png');
    expect(result.backdrops).toHaveLength(MAX_BACKDROPS);
    expect(result).not.toHaveProperty('posters');
  });

  it('handles movies without images', () => {
    expect(mapMovieImages({ id: 1 })).toEqual({ logo: null, backdrops: [] });
  });
});
