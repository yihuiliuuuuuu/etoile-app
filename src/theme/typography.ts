import { TextStyle } from 'react-native';

export const fonts = {
  serif: 'PlayfairDisplay_700Bold',
  sans: 'Inter_600SemiBold',
  sansRegular: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
} as const;

export const type: Record<string, TextStyle> = {
  heroTitle: {
    fontFamily: fonts.serif,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  cardTitle: {
    fontFamily: fonts.sans,
    fontSize: 17,
    letterSpacing: -0.2,
  },
  statLarge: {
    fontFamily: fonts.sans,
    fontSize: 34,
    letterSpacing: -0.8,
  },
  statLabel: {
    fontFamily: fonts.sans,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  body: {
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    letterSpacing: -0.1,
  },
  bodyBold: {
    fontFamily: fonts.sans,
    fontSize: 15,
    letterSpacing: -0.1,
  },
  caption: {
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    letterSpacing: 0.1,
  },
  micro: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 0.2,
  },
  navLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 0.3,
  },
};
