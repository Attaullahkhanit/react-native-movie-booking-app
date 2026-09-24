import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '@core/theme';
import { MovieDetailScreen } from '@presentation/features/movies/screens/MovieDetailScreen';
import { TrailerPlayerScreen } from '@presentation/features/movies/screens/TrailerPlayerScreen';
import { WatchListScreen } from '@presentation/features/movies/screens/WatchListScreen';
import { SearchScreen } from '@presentation/features/search/screens/SearchScreen';
import { SearchResultsScreen } from '@presentation/features/search/screens/SearchResultsScreen';
import { TicketBookingScreen } from '@presentation/features/booking/screens/TicketBookingScreen';
import { SeatSelectionScreen } from '@presentation/features/booking/screens/SeatSelectionScreen';
import { MoreScreen } from '@presentation/features/more/screens/MoreScreen';
import { PlaceholderScreen } from '@presentation/features/more/screens/PlaceholderScreen';
import { TabBar } from './TabBar';
import type {
  MainTabParamList,
  RootStackParamList,
  WatchStackParamList,
} from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const WatchStack = createNativeStackNavigator<WatchStackParamList>();

const stackScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background },
  statusBarStyle: 'dark' as const,
  animation: 'slide_from_right' as const,
};

const WatchNavigator = () => (
  <WatchStack.Navigator screenOptions={stackScreenOptions}>
    <WatchStack.Screen name="WatchList" component={WatchListScreen} />
    <WatchStack.Screen
      name="Search"
      component={SearchScreen}
      options={{ animation: 'fade' }}
    />
    <WatchStack.Screen name="SearchResults" component={SearchResultsScreen} />
  </WatchStack.Navigator>
);

const renderTabBar = (props: React.ComponentProps<typeof TabBar>) => (
  <TabBar {...props} />
);

const MainTabs = () => (
  <Tab.Navigator
    initialRouteName="Watch"
    tabBar={renderTabBar}
    screenOptions={{
      headerShown: false,
      lazy: true,
      sceneStyle: { backgroundColor: colors.background },
    }}
  >
    <Tab.Screen name="Dashboard" component={PlaceholderScreen} />
    <Tab.Screen name="Watch" component={WatchNavigator} />
    <Tab.Screen name="MediaLibrary" component={PlaceholderScreen} />
    <Tab.Screen name="More" component={MoreScreen} />
  </Tab.Navigator>
);

export const RootNavigator = () => (
  <RootStack.Navigator screenOptions={stackScreenOptions}>
    <RootStack.Screen name="MainTabs" component={MainTabs} />
    <RootStack.Screen
      name="MovieDetail"
      component={MovieDetailScreen}
      options={{ statusBarStyle: 'light' }}
    />
    <RootStack.Screen name="TicketBooking" component={TicketBookingScreen} />
    <RootStack.Screen name="SeatSelection" component={SeatSelectionScreen} />
    <RootStack.Screen
      name="TrailerPlayer"
      component={TrailerPlayerScreen}
      options={{
        presentation: 'fullScreenModal',
        animation: 'fade',
        statusBarHidden: true,
        contentStyle: { backgroundColor: '#000' },
        // Let the player rotate freely; users typically watch in landscape.
        orientation: 'all',
      }}
    />
  </RootStack.Navigator>
);
