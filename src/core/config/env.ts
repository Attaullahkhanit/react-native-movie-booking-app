const PLACEHOLDER_KEY = 'your_tmdb_v3_api_key';

export const env = {
  // Expo inlines EXPO_PUBLIC_* variables from .env at bundle time.
  tmdbApiKey: (process.env.EXPO_PUBLIC_TMDB_API_KEY ?? '').trim(),
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p',
} as const;

export const isApiKeyConfigured =
  env.tmdbApiKey.length > 0 && env.tmdbApiKey !== PLACEHOLDER_KEY;

/**
 * TMDB issues two credentials: a short v3 `api_key` and a long v4 "Read Access
 * Token" (a JWT). Both work against the v3 endpoints, so accept either.
 */
export const isBearerToken = (key: string) => key.startsWith('eyJ');
