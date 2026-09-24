import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';

/** Upper bound in case the navigator never emits `transitionEnd` (e.g. tabs). */
const FALLBACK_MS = 400;

/**
 * Returns `false` while the screen's enter animation is running and `true`
 * once it has finished. Screens render a lightweight skeleton first and mount
 * heavy content (seat maps, SVG previews) afterwards, so the native transition
 * never competes with a large JS render and stays at 60fps.
 */
export const useAfterTransition = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), FALLBACK_MS);
    const unsubscribe = navigation.addListener('transitionEnd', event => {
      if (!event.data.closing) {
        clearTimeout(timer);
        setReady(true);
      }
    });
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [navigation]);

  return ready;
};
