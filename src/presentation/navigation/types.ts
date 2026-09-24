import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type WatchStackParamList = {
  WatchList: undefined;
  Search: undefined;
  SearchResults:
    | { kind: 'search'; query: string }
    | { kind: 'genre'; genreId: number; genreName: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Watch: NavigatorScreenParams<WatchStackParamList>;
  MediaLibrary: undefined;
  More: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  MovieDetail: { movieId: number; title?: string };
  TicketBooking: { movieId: number; title: string; releaseDate: string | null };
  SeatSelection: {
    movieId: number;
    title: string;
    date: string;
    showtimeId: string;
  };
  TrailerPlayer: { videoKey: string; title: string };
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type WatchScreenProps<T extends keyof WatchStackParamList> =
  NativeStackScreenProps<WatchStackParamList, T>;

declare global {
  namespace ReactNavigation {
    // Enables typed `useNavigation()` everywhere without generics.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
