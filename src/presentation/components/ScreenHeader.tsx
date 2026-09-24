import { memo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { colors, layout, spacing } from '@core/theme';
import { AppText } from './AppText';
import { IconButton } from './IconButton';
import { ChevronLeftIcon } from './Icons';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  /** Centered title with back button (booking flow) vs left title (tabs). */
  align?: 'left' | 'center';
  showBack?: boolean;
  right?: ReactNode;
}

export const ScreenHeader = memo(
  ({
    title,
    subtitle,
    align = 'left',
    showBack = false,
    right,
  }: ScreenHeaderProps) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const centered = align === 'center';

    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingLeft: Math.max(
              insets.left,
              layout.screenPadding - spacing.sm,
            ),
            paddingRight: Math.max(
              insets.right,
              layout.screenPadding - spacing.sm,
            ),
          },
        ]}
      >
        <View style={styles.row}>
          {showBack ? (
            <IconButton
              accessibilityLabel="Go back"
              onPress={navigation.goBack}
            >
              <ChevronLeftIcon />
            </IconButton>
          ) : null}
          <View
            style={[
              styles.titles,
              centered && styles.centered,
              !showBack && styles.inset,
            ]}
          >
            <AppText
              variant="heading"
              numberOfLines={1}
              accessibilityRole="header"
              align={centered ? 'center' : 'left'}
            >
              {title}
            </AppText>
            {subtitle ? (
              <AppText
                variant="caption"
                color={colors.primary}
                numberOfLines={1}
              >
                {subtitle}
              </AppText>
            ) : null}
          </View>
          <View style={[styles.right, centered && showBack && styles.balance]}>
            {right}
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  row: {
    minHeight: layout.headerHeight + spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titles: { flex: 1, justifyContent: 'center' },
  inset: { paddingLeft: spacing.sm },
  centered: { alignItems: 'center' },
  right: { minWidth: 44, alignItems: 'flex-end' },
  balance: { width: 44 },
});

ScreenHeader.displayName = 'ScreenHeader';
