import { forwardRef, memo } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { colors, fonts, radius, spacing } from '@core/theme';
import { IconButton } from './IconButton';
import { CloseIcon, SearchIcon } from './Icons';

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export const SearchBar = memo(
  forwardRef<TextInput, SearchBarProps>(
    ({ value, onChangeText, onClear, ...rest }, ref) => (
      <View style={styles.container}>
        <SearchIcon size={18} />
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder="TV shows, movies and more"
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="never"
          accessibilityLabel="Search movies"
          maxFontSizeMultiplier={1.3}
          style={styles.input}
          {...rest}
        />
        <IconButton accessibilityLabel="Clear search" onPress={onClear}>
          <CloseIcon size={18} />
        </IconButton>
      </View>
    ),
  ),
);

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
});

SearchBar.displayName = 'SearchBar';
