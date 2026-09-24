import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useResponsive } from '@core/hooks/useResponsive';
import { colors, layout, radius, spacing } from '@core/theme';
import { formatReleaseDate } from '@core/utils/date';
import { listImageSize, tmdbImageUrl } from '@core/utils/image';
import type { MovieImage, Video } from '@domain/entities/Movie';
import { AppText } from '@presentation/components/AppText';
import { IconButton } from '@presentation/components/IconButton';
import { ChevronLeftIcon, PlayIcon } from '@presentation/components/Icons';
import { PrimaryButton } from '@presentation/components/PrimaryButton';
import { RemoteImage } from '@presentation/components/RemoteImage';
import { ErrorState, OfflineState } from '@presentation/components/StateViews';
import { isWaitingForNetwork } from '@presentation/hooks/queryStatus';
import {
  useMovieDetail,
  useMovieImages,
  useMovieTrailer,
  useMovieVideos,
} from '@presentation/hooks/useMovieQueries';
import type { RootScreenProps } from '@presentation/navigation/types';
import { GenreChips } from '../components/GenreChips';
import { MovieDetailSkeleton } from '../components/MovieDetailSkeleton';
import {
  VIDEO_THUMB_WIDTH,
  VideoThumbnail,
} from '../components/VideoThumbnail';

const EMPTY_VIDEOS: Video[] = [];
const EMPTY_IMAGES: MovieImage[] = [];

const GALLERY_ITEM_WIDTH = 220;
const GALLERY_ITEM_HEIGHT = Math.round((GALLERY_ITEM_WIDTH * 9) / 16);
/** Thumbnail (16:9) + two caption lines. */
const VIDEO_ROW_HEIGHT = Math.round((VIDEO_THUMB_WIDTH * 9) / 16) + 56;

export const MovieDetailScreen = ({
  route,
  navigation,
}: RootScreenProps<'MovieDetail'>) => {
  const { movieId } = route.params;
  const insets = useSafeAreaInsets();
  const { width, height, isLandscape } = useResponsive();

  const detail = useMovieDetail(movieId);
  const images = useMovieImages(movieId);
  const trailer = useMovieTrailer(movieId);
  const videos = useMovieVideos(movieId).data ?? EMPTY_VIDEOS;
  const movie = detail.data;

  const logo = images.data?.logo ?? null;
  const gallery = images.data?.backdrops ?? EMPTY_IMAGES;

  // Portrait: tall poster hero on top. Landscape: poster left, content right.
  const heroWidth = isLandscape ? Math.round(width * 0.45) : width;
  const heroHeight = isLandscape
    ? height
    : Math.round(Math.min(width * 1.28, height * 0.6));

  const onGetTickets = useCallback(() => {
    if (!movie) {
      return;
    }
    navigation.navigate('TicketBooking', {
      movieId: movie.id,
      title: movie.title,
      releaseDate: movie.releaseDate,
    });
  }, [movie, navigation]);

  // The player (a WebView) only mounts after a tap, on its own screen.
  const playVideo = useCallback(
    (video: Video) =>
      navigation.navigate('TrailerPlayer', {
        videoKey: video.key,
        title: video.name,
      }),
    [navigation],
  );
  const renderVideo = useCallback(
    ({ item }: { item: Video }) => (
      <VideoThumbnail video={item} onPress={playVideo} />
    ),
    [playVideo],
  );

  const onWatchTrailer = useCallback(() => {
    if (trailer.data) {
      navigation.navigate('TrailerPlayer', {
        videoKey: trailer.data.key,
        title: trailer.data.name,
      });
    }
  }, [navigation, trailer.data]);

  const backButton = (
    <View
      style={[
        styles.backRow,
        {
          top: insets.top + spacing.xs,
          left: Math.max(insets.left, spacing.sm),
        },
      ]}
    >
      <IconButton accessibilityLabel="Go back" onPress={navigation.goBack}>
        <ChevronLeftIcon color={colors.textOnDark} />
      </IconButton>
      <AppText variant="heading" color={colors.textOnDark}>
        Watch
      </AppText>
    </View>
  );

  if (isWaitingForNetwork(detail)) {
    return (
      <View
        style={[
          styles.screen,
          { paddingTop: insets.top + layout.headerHeight },
        ]}
      >
        <OfflineState />
        <View style={styles.darkBack}>{backButton}</View>
      </View>
    );
  }

  if (detail.isPending) {
    return (
      <View style={styles.screen}>
        <MovieDetailSkeleton
          heroWidth={heroWidth}
          heroHeight={heroHeight}
          horizontal={isLandscape}
        />
        {backButton}
      </View>
    );
  }

  if (!movie) {
    return (
      <View
        style={[
          styles.screen,
          { paddingTop: insets.top + layout.headerHeight },
        ]}
      >
        <ErrorState error={detail.error} onRetry={detail.refetch} />
        <View style={styles.darkBack}>{backButton}</View>
      </View>
    );
  }

  const trailerOffline = isWaitingForNetwork(trailer);
  const trailerLoading = trailer.isPending && !trailerOffline;
  const trailerTitle = trailerOffline
    ? 'Trailer Needs Internet'
    : trailerLoading
      ? 'Loading Trailer'
      : trailer.data
        ? 'Watch Trailer'
        : 'No Trailer Available';

  const hero = (
    <View style={{ width: heroWidth, height: heroHeight }}>
      <RemoteImage
        uri={tmdbImageUrl(movie.posterPath ?? movie.backdropPath, 'w780')}
        style={StyleSheet.absoluteFill}
        priority="high"
        accessibilityLabel={`${movie.title} poster`}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.45)', 'transparent', 'rgba(0,0,0,0.85)']}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          styles.heroContent,
          {
            paddingBottom: isLandscape
              ? insets.bottom + spacing.xl
              : spacing.xxxl,
          },
        ]}
      >
        {logo ? (
          <RemoteImage
            uri={tmdbImageUrl(logo.filePath, 'w300')}
            style={[styles.logo, { aspectRatio: logo.aspectRatio || 3 }]}
            contentFit="contain"
            shimmer={false}
            accessibilityLabel={movie.title}
          />
        ) : (
          <AppText variant="display" color={colors.textOnDark} align="center">
            {movie.title}
          </AppText>
        )}
        <AppText variant="heading" color={colors.textOnDark} align="center">
          In Theaters {formatReleaseDate(movie.releaseDate)}
        </AppText>
        <View style={styles.actions}>
          <PrimaryButton
            title="Get Tickets"
            onPress={onGetTickets}
            accessibilityHint="Choose a date, showtime and seats"
          />
          <PrimaryButton
            title={trailerTitle}
            variant="outline"
            onPress={onWatchTrailer}
            disabled={!trailer.data}
            loading={trailerLoading}
            icon={<PlayIcon />}
            accessibilityHint="Plays the trailer full screen"
          />
        </View>
      </View>
    </View>
  );

  const body = (
    <View
      style={[
        styles.body,
        isLandscape && { paddingRight: Math.max(insets.right, spacing.xl) },
      ]}
    >
      {movie.genres.length > 0 && (
        <View style={styles.section}>
          <AppText variant="heading" accessibilityRole="header">
            Genres
          </AppText>
          <GenreChips genres={movie.genres} />
        </View>
      )}
      <View style={styles.divider} />
      <View style={styles.section}>
        <AppText variant="heading" accessibilityRole="header">
          Overview
        </AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          {movie.overview || 'No overview available yet.'}
        </AppText>
      </View>
      {videos.length > 0 && (
        <View style={styles.section}>
          <AppText variant="heading" accessibilityRole="header">
            Videos
          </AppText>
          <View style={styles.videoRow}>
            <FlashList
              horizontal
              data={videos}
              keyExtractor={videoKey}
              renderItem={renderVideo}
              ItemSeparatorComponent={HorizontalGap}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      )}
      {gallery.length > 0 && (
        <View style={styles.section}>
          <AppText variant="heading" accessibilityRole="header">
            Images
          </AppText>
          <View style={styles.galleryRow}>
            <FlashList
              horizontal
              data={gallery}
              keyExtractor={galleryKey}
              renderItem={renderGalleryItem}
              ItemSeparatorComponent={HorizontalGap}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      )}
      <View style={{ height: insets.bottom + spacing.xl }} />
    </View>
  );

  return (
    <View style={styles.screen}>
      {isLandscape ? (
        <View style={styles.row}>
          {hero}
          <ScrollView
            style={styles.flex}
            contentContainerStyle={{ paddingTop: insets.top }}
          >
            {body}
          </ScrollView>
        </View>
      ) : (
        <ScrollView bounces={false}>
          {hero}
          {body}
        </ScrollView>
      )}
      {backButton}
    </View>
  );
};

const galleryKey = (image: MovieImage) => image.filePath;
const renderGalleryItem = ({ item }: { item: MovieImage }) => (
  <RemoteImage
    uri={tmdbImageUrl(item.filePath, listImageSize(GALLERY_ITEM_WIDTH))}
    style={styles.galleryItem}
  />
);
const videoKey = (video: Video) => video.id;
const HorizontalGap = () => <View style={styles.hGap} />;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  row: { flex: 1, flexDirection: 'row' },
  backRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.lg,
  },
  darkBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: colors.tabBar,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    paddingHorizontal: spacing.xxxl + spacing.lg,
    gap: spacing.md,
  },
  logo: {
    alignSelf: 'center',
    width: '70%',
    maxHeight: 80,
    backgroundColor: 'transparent',
  },
  actions: { gap: spacing.md, marginTop: spacing.xs },
  body: {
    paddingHorizontal: layout.screenPadding + spacing.sm,
    paddingTop: spacing.xl,
  },
  section: { gap: spacing.md, paddingVertical: spacing.sm },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: spacing.lg,
  },
  // Horizontal FlashLists need a bounded height inside a vertical ScrollView.
  galleryRow: { height: GALLERY_ITEM_HEIGHT },
  videoRow: { height: VIDEO_ROW_HEIGHT },
  hGap: { width: spacing.md },
  galleryItem: {
    width: GALLERY_ITEM_WIDTH,
    height: GALLERY_ITEM_HEIGHT,
    borderRadius: radius.md,
  },
});
