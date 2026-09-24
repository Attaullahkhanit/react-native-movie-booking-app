import type { Video } from '@domain/entities/Movie';
import { selectTrailer } from '@domain/usecases/selectTrailer';

const video = (overrides: Partial<Video>): Video => ({
  id: 'id',
  key: 'key',
  name: 'name',
  site: 'YouTube',
  type: 'Trailer',
  official: true,
  publishedAt: null,
  ...overrides,
});

describe('selectTrailer', () => {
  it('returns null when there are no playable videos', () => {
    expect(selectTrailer(undefined)).toBeNull();
    expect(selectTrailer([video({ site: 'Vimeo' })])).toBeNull();
  });

  it('prefers official YouTube trailers over teasers and clips', () => {
    const result = selectTrailer([
      video({ key: 'clip', type: 'Clip' }),
      video({ key: 'teaser', type: 'Teaser' }),
      video({ key: 'fan-trailer', type: 'Trailer', official: false }),
      video({ key: 'official-trailer', type: 'Trailer' }),
    ]);
    expect(result?.key).toBe('official-trailer');
  });

  it('falls back to any YouTube video', () => {
    expect(
      selectTrailer([video({ key: 'bts', type: 'Behind the Scenes' })])?.key,
    ).toBe('bts');
  });
});
