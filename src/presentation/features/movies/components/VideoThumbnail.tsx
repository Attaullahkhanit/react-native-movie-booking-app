import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@core/theme';
import { youtubeThumbnailUrl } from '@core/utils/image';
import type { Video } from '@domain/entities/Movie';
import { AppText } from '@presentation/components/AppText';
import { PlayIcon } from '@presentation/components/Icons';
import { RemoteImage } from '@presentation/components/RemoteImage';

export const VIDEO_THUMB_WIDTH = 220;
const THUMB_HEIGHT = Math.round((VIDEO_THUMB_WIDTH * 9) / 16);

interface VideoThumbnailProps {
  video: Video;
  onPress: (video: Video) => void;
}

/**
 * A static YouTube thumbnail, not a player: no WebView is created until the
 * user taps, which keeps the detail screen light no matter how many videos a
 * movie has.
 */
export const VideoThumbnail = memo(
  ({ video, onPress }: VideoThumbnailProps) => {
    const handlePress = useCallback(() => onPress(video), [onPress, video]);

    return (
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Play ${video.name}`}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <View style={styles.thumb}>
          <RemoteImage
            uri={youtubeThumbnailUrl(video.key)}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.play}>
            <PlayIcon size={16} />
          </View>
        </View>
        <AppText variant="caption" numberOfLines={2}>
          {video.name}
        </AppText>
        <AppText variant="tiny" color={colors.textSecondary}>
          {video.type}
        </AppText>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  card: { width: VIDEO_THUMB_WIDTH, gap: spacing.xs },
  pressed: { opacity: 0.8 },
  thumb: {
    height: THUMB_HEIGHT,
    borderRadius: radius.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  play: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

VideoThumbnail.displayName = 'VideoThumbnail';
