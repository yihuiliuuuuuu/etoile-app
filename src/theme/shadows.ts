import { Platform, ViewStyle } from 'react-native';

import { colors } from './colors';

export const shadows: { card: ViewStyle; fab: ViewStyle } = {
  card: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 14,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }) as ViewStyle,
  fab: Platform.select({
    ios: {
      shadowColor: colors.accent,
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 16,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }) as ViewStyle,
};
