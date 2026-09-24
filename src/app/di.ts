/**
 * Composition root: the only place that knows which concrete implementations
 * back the domain contracts.
 */
import { httpClient } from '@core/network/httpClient';
import { TmdbRemoteDataSource } from '@data/datasources/TmdbRemoteDataSource';
import { TmdbMovieRepository } from '@data/repositories/TmdbMovieRepository';
import type { MovieRepository } from '@domain/repositories/MovieRepository';

export const movieRepository: MovieRepository = new TmdbMovieRepository(
  new TmdbRemoteDataSource(httpClient),
);
