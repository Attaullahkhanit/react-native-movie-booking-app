/** Origin the embedded player identifies with (YouTube rejects embeds without one). */
export const PLAYER_ORIGIN = 'https://com.tentwenty.movies';

/** YouTube player states, as reported by the IFrame API. */
export const YT_STATE = {
  ENDED: 0,
  PLAYING: 1,
} as const;

export type PlayerMessage =
  | { type: 'ready' }
  | { type: 'state'; data: number }
  | { type: 'error'; data: number };

/** TMDB video keys are YouTube IDs; reject anything else before templating. */
const isYouTubeId = (id: string) => /^[A-Za-z0-9_-]{6,20}$/.test(id);

/**
 * Minimal YouTube IFrame API page. Playback is started from *inside* the page
 * (muted autoplay, then unmute once playing), so nothing has to be sent from
 * React Native into the WebView. The page only reports events back through
 * `ReactNativeWebView.postMessage`, which works on both platforms.
 */
export const buildYouTubePlayerHtml = (videoId: string) => {
  if (!isYouTubeId(videoId)) {
    return null;
  }
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
  html, body { margin: 0; height: 100%; background: #000; overflow: hidden; }
  #player { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
</style>
</head>
<body>
<div id="player"></div>
<script>
  function post(type, data) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, data: data }));
  }
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);

  function onYouTubeIframeAPIReady() {
    new YT.Player('player', {
      videoId: '${videoId}',
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 1, mute: 1, playsinline: 1, rel: 0, fs: 0,
        origin: '${PLAYER_ORIGIN}'
      },
      events: {
        onReady: function (e) { e.target.mute(); e.target.playVideo(); post('ready'); },
        onStateChange: function (e) {
          if (e.data === 1) { e.target.unMute(); }
          post('state', e.data);
        },
        onError: function (e) { post('error', e.data); }
      }
    });
  }
</script>
</body>
</html>`;
};
