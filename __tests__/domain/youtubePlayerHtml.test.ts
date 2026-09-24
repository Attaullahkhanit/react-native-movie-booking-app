import {
  buildYouTubePlayerHtml,
  PLAYER_ORIGIN,
} from '@presentation/features/movies/components/youtubePlayerHtml';

describe('buildYouTubePlayerHtml', () => {
  it('embeds the video id with muted autoplay and the app origin', () => {
    const html = buildYouTubePlayerHtml('dQw4w9WgXcQ');
    expect(html).toContain("videoId: 'dQw4w9WgXcQ'");
    expect(html).toContain('autoplay: 1');
    expect(html).toContain('mute: 1');
    expect(html).toContain(`origin: '${PLAYER_ORIGIN}'`);
  });

  it('rejects anything that is not a YouTube id (no script injection)', () => {
    expect(buildYouTubePlayerHtml("x'); alert(1); ('")).toBeNull();
    expect(buildYouTubePlayerHtml('<script>')).toBeNull();
    expect(buildYouTubePlayerHtml('')).toBeNull();
  });
});
