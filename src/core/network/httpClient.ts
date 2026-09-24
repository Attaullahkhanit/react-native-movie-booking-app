import axios from 'axios';

import { env, isBearerToken } from '@core/config/env';
import { REQUEST_TIMEOUT_MS } from '@core/config/constants';
import { toApiError } from './ApiError';

// eslint-disable-next-line import/no-named-as-default-member -- canonical axios API
export const httpClient = axios.create({
  baseURL: env.tmdbBaseUrl,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { Accept: 'application/json' },
});

httpClient.interceptors.request.use(config => {
  const key = env.tmdbApiKey;
  const params: Record<string, unknown> = {
    language: 'en-US',
    ...config.params,
  };

  if (isBearerToken(key)) {
    config.headers.Authorization = `Bearer ${key}`;
  } else {
    params.api_key = key;
  }
  config.params = params;
  return config;
});

httpClient.interceptors.response.use(
  response => response,
  error => Promise.reject(toApiError(error)),
);
