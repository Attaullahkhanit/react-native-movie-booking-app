import { memo, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Image, ImageContentFit } from 'expo-image';

import { colors } from '@core/theme';
import { Skeleton } from './Skeleton';

interface RemoteImageProps {
  uri: string | undefined;
  style?: StyleProp<ViewStyle>;
  contentFit?: ImageContentFit;
  priority?: 'low' | 'normal' | 'high';
  /** Shimmer while the image downloads. Disable for tiny thumbnails. */
  shimmer?: boolean;
  accessibilityLabel?: string;
}

/**
 * expo-image (SDWebImage / Glide) keeps a memory + disk cache, so posters that
 * were seen once still render offline.
 */
export const RemoteImage = memo(
  ({
    uri,
    style,
    contentFit = 'cover',
    priority = 'normal',
    shimmer = true,
    accessibilityLabel,
  }: RemoteImageProps) => {
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);

    return (
      <View style={[styles.container, style]}>
        {uri && !failed ? (
          <Image
            source={{ uri }}
            contentFit={contentFit}
            priority={priority}
            cachePolicy="memory-disk"
            recyclingKey={uri}
            transition={200}
            style={StyleSheet.absoluteFill}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            accessible={!!accessibilityLabel}
            accessibilityLabel={accessibilityLabel}
          />
        ) : null}
        {shimmer && uri && !loaded && !failed ? (
          <Skeleton style={StyleSheet.absoluteFill} radius={0} />
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.tabBar,
  },
});

RemoteImage.displayName = 'RemoteImage';
