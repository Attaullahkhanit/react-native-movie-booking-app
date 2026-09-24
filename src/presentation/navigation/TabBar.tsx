import { ComponentType, memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { useKeyboardVisible } from '@core/hooks/useKeyboardVisible';
import { useResponsive } from '@core/hooks/useResponsive';
import { colors, layout, radius, spacing } from '@core/theme';
import { AppText } from '@presentation/components/AppText';
import {
  DashboardIcon,
  MediaLibraryIcon,
  MoreListIcon,
  WatchIcon,
} from '@presentation/components/Icons';
import type { MainTabParamList } from './types';

const TABS: Record<
  keyof MainTabParamList,
  { label: string; Icon: ComponentType<{ color?: string }> }
> = {
  Dashboard: { label: 'Dashboard', Icon: DashboardIcon },
  Watch: { label: 'Watch', Icon: WatchIcon },
  MediaLibrary: { label: 'Media Library', Icon: MediaLibraryIcon },
  More: { label: 'More', Icon: MoreListIcon },
};

/** Dark rounded tab bar from the Figma design; hides while typing. */
export const TabBar = memo(
  ({ state, navigation, insets }: BottomTabBarProps) => {
    const keyboardVisible = useKeyboardVisible();
    const { isLandscape } = useResponsive();

    if (keyboardVisible) {
      return null;
    }

    return (
      <View style={styles.wrapper}>
        <View
          accessibilityRole="tablist"
          style={[
            styles.bar,
            {
              paddingBottom: Math.max(insets.bottom, spacing.sm),
              paddingLeft: insets.left,
              paddingRight: insets.right,
              minHeight:
                (isLandscape ? 56 : layout.tabBarHeight) + insets.bottom,
            },
          ]}
        >
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const { label, Icon } = TABS[route.name as keyof MainTabParamList];
            const tint = focused ? colors.textOnDark : colors.tabInactive;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                accessibilityRole="tab"
                accessibilityLabel={label}
                accessibilityState={{ selected: focused }}
                style={[styles.tab, isLandscape && styles.tabLandscape]}
              >
                <Icon color={tint} />
                <AppText
                  variant="tiny"
                  color={tint}
                  numberOfLines={1}
                  style={focused ? styles.labelFocused : undefined}
                >
                  {label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  // Matches the screen background so the rounded corners blend in.
  wrapper: { backgroundColor: colors.background },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.tabBar,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
  },
  tabLandscape: { flexDirection: 'row', gap: spacing.sm },
  labelFocused: { fontFamily: 'Poppins-Bold' },
});

TabBar.displayName = 'TabBar';
