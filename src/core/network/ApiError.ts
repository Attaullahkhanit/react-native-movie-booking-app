import { AxiosError, isAxiosError } from 'axios';

export type ApiErrorKind =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'notFound'
  | 'server'
  | 'cancelled'
  | 'unknown';

interface TmdbErrorBody {
  status_code?: number;
  status_message?: string;
}

const FRIENDLY_MESSAGES: Record<ApiErrorKind, string> = {
  network: 'No internet connection. Connect and try again.',
  timeout: 'The server took too long to respond. Please try again.',
  unauthorized: 'Invalid TMDB API key. Add a valid key to the .env file.',
  notFound: 'We could not find what you were looking for.',
  server: 'TMDB is having trouble right now. Please try again later.',
  cancelled: 'Request cancelled.',
  unknown: 'Something went wrong. Please try again.',
};

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(kind: ApiErrorKind, status?: number, message?: string) {
    super(message ?? FRIENDLY_MESSAGES[kind]);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }

  get isRetryable() {
    return (
      this.kind === 'network' ||
      this.kind === 'timeout' ||
      this.kind === 'server'
    );
  }
}

export const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }
  if (!isAxiosError(error)) {
    return new ApiError('unknown');
  }
  const axiosError = error as AxiosError<TmdbErrorBody>;
  if (axiosError.code === AxiosError.ERR_CANCELED) {
    return new ApiError('cancelled');
  }
  if (
    axiosError.code === AxiosError.ECONNABORTED ||
    axiosError.code === AxiosError.ETIMEDOUT
  ) {
    return new ApiError('timeout');
  }
  const status = axiosError.response?.status;
  if (!status) {
    return new ApiError('network');
  }
  if (status === 401) {
    return new ApiError('unauthorized', status);
  }
  if (status === 404) {
    return new ApiError('notFound', status);
  }
  if (status >= 500) {
    return new ApiError('server', status);
  }
  return new ApiError(
    'unknown',
    status,
    axiosError.response?.data?.status_message,
  );
};

export const getErrorMessage = (error: unknown) => toApiError(error).message;
