import { memo, useEffect, useState } from 'react';
import {
  Animated,
  DimensionValue,
  Easing,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, radius as radii } from '@core/theme';

/**
 * One shared native-driver animation drives every shimmer on screen, so 20
 * skeletons cost the same as one and stay perfectly in sync.
 */
const progress = new Animated.Value(0);
let activeCount = 0;
let loop: Animated.CompositeAnimation | null = null;

const startShimmer = () => {
  activeCount += 1;
  if (activeCount === 1) {
    progress.setValue(0);
    loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
  }
};

const stopShimmer = () => {
  activeCount = Math.max(0, activeCount - 1);
  if (activeCount === 0) {
    loop?.stop();
    loop = null;
  }
};

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton = memo(
  ({
    width = '100%',
    height = 16,
    radius = radii.sm,
    style,
  }: SkeletonProps) => {
    const [layoutWidth, setLayoutWidth] = useState(0);

    useEffect(() => {
      startShimmer();
      return stopShimmer;
    }, []);

    const onLayout = (e: LayoutChangeEvent) =>
      setLayoutWidth(e.nativeEvent.layout.width);

    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-layoutWidth, layoutWidth],
    });

    return (
      <View
        onLayout={onLayout}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.base, { width, height, borderRadius: radius }, style]}
      >
        {layoutWidth > 0 && (
          <Animated.View
            style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}
          >
            <LinearGradient
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[
                colors.skeletonBase,
                colors.skeletonHighlight,
                colors.skeletonBase,
              ]}
            />
          </Animated.View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.skeletonBase,
    overflow: 'hidden',
  },
});

Skeleton.displayName = 'Skeleton';
