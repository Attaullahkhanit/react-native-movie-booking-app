import type { Video } from '@domain/entities/Movie';
import { playableVideos } from '@domain/usecases/selectTrailer';

const video = (overrides: Partial<Video>): Video => ({
  id: overrides.key ?? 'id',
  key: 'key',
  name: 'name',
  site: 'YouTube',
  type: 'Trailer',
  official: true,
  publishedAt: null,
  ...overrides,
});

describe('playableVideos', () => {
  it('keeps only YouTube videos with a key, best first', () => {
    const result = playableVideos([
      video({ key: 'clip', type: 'Clip' }),
      video({ key: 'vimeo', site: 'Vimeo' }),
      video({ key: '', type: 'Trailer' }),
      video({ key: 'teaser', type: 'Teaser' }),
      video({ key: 'trailer', type: 'Trailer' }),
    ]);
    expect(result.map(v => v.key)).toEqual(['trailer', 'teaser', 'clip']);
  });

  it('does not mutate the input array', () => {
    const input = [
      video({ key: 'b', type: 'Clip' }),
      video({ key: 'a', type: 'Trailer' }),
    ];
    playableVideos(input);
    expect(input.map(v => v.key)).toEqual(['b', 'a']);
  });
});
