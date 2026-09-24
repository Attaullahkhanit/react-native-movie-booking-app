/** Centralised query keys so invalidation and prefetching stay consistent. */
export const movieKeys = {
  all: ['movies'] as const,
  upcoming: () => [...movieKeys.all, 'upcoming'] as const,
  popular: () => [...movieKeys.all, 'popular'] as const,
  search: (query: string) => [...movieKeys.all, 'search', query] as const,
  byGenre: (genreId: number) => [...movieKeys.all, 'genre', genreId] as const,
  detail: (id: number) => [...movieKeys.all, 'detail', id] as const,
  images: (id: number) => [...movieKeys.all, 'images', id] as const,
  videos: (id: number) => [...movieKeys.all, 'videos', id] as const,
  genres: () => ['genres'] as const,
};
