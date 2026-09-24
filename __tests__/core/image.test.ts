import { pickImageSize, youtubeThumbnailUrl } from '@core/utils/image';

describe('pickImageSize', () => {
  it('uses w342 as the baseline for small list images', () => {
    // 130dp search thumbnail on a 3x screen = 390px.
    expect(pickImageSize(390)).toBe('w342');
    expect(pickImageSize(100)).toBe('w342');
  });

  it('steps up only when the image would be visibly upscaled', () => {
    // ~170dp genre tile on 3x = 510px.
    expect(pickImageSize(510)).toBe('w500');
    // Full-width 335dp card on 3x = 1005px.
    expect(pickImageSize(1005)).toBe('w780');
  });

  it('caps at the largest size', () => {
    expect(pickImageSize(4000)).toBe('w1280');
  });
});

describe('youtubeThumbnailUrl', () => {
  it('builds a static thumbnail URL and escapes the key', () => {
    expect(youtubeThumbnailUrl('abc123')).toBe(
      'https://i.ytimg.com/vi/abc123/hqdefault.jpg',
    );
    expect(youtubeThumbnailUrl('a/b')).toContain('a%2Fb');
  });
});
