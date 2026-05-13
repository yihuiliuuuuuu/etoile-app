import { Platform, ViewStyle } from 'react-native';

import { colors } from './colors';

/**
 * Soft, low-opacity shadows. The "card" shadow has a faint warm tint so
 * white cards lift gently off the ivory canvas without looking harsh.
 */
export const shadows: { card: ViewStyle; raised: ViewStyle } = {
  card: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 18,
    },
    android: {
      elevation: 1,
    },
    default: {},
  }) as ViewStyle,
  raised: Platform.select({
    ios: {
      shadowColor: colors.primary,
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 20,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }) as ViewStyle,
};
