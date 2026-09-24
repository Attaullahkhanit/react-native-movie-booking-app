import type { Video } from '@domain/entities/Movie';

const TYPE_PRIORITY = ['Trailer', 'Teaser', 'Clip', 'Featurette'];

const rank = (video: Video) => {
  const typeRank = TYPE_PRIORITY.indexOf(video.type);
  return (
    (typeRank === -1 ? TYPE_PRIORITY.length : typeRank) * 2 +
    (video.official ? 0 : 1)
  );
};

/**
 * Videos the app can play (YouTube only, since the player is YouTube-based),
 * best first: official trailers, then teasers, clips, featurettes, the rest.
 */
export const playableVideos = (videos: Video[] | undefined): Video[] =>
  (videos ?? [])
    .filter(v => v.site === 'YouTube' && v.key)
    .sort((a, b) => rank(a) - rank(b));

/** The single best video for the "Watch Trailer" button. */
export const selectTrailer = (videos: Video[] | undefined): Video | null =>
  playableVideos(videos)[0] ?? null;
