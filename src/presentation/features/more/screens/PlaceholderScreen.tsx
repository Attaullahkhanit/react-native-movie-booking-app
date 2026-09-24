import { StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { colors } from '@core/theme';
import { ScreenHeader } from '@presentation/components/ScreenHeader';
import { EmptyState } from '@presentation/components/StateViews';

const TITLES: Record<string, string> = {
  Dashboard: 'Dashboard',
  MediaLibrary: 'Media Library',
};

/** Tabs that exist in the design but are out of scope for this assignment. */
export const PlaceholderScreen = () => {
  const route = useRoute();
  const title = TITLES[route.name] ?? route.name;
  return (
    <View style={styles.screen}>
      <ScreenHeader title={title} />
      <EmptyState
        title="Coming soon"
        message={`${title} is not part of this build yet.`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
});
