import { TextStyle } from 'react-native';

/**
 * Font families.
 *
 * Loaded asynchronously in `app/_layout.tsx`. Until the fonts load we
 * fall back to the platform defaults so first paint still looks clean.
 */
export const fonts = {
  serif: 'PlayfairDisplay_700Bold',
  serifItalic: 'PlayfairDisplay_700Bold_Italic',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemibold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
} as const;

type Variant = TextStyle;

export const typography: Record<
  | 'displaySerif'
  | 'sectionTitleSerif'
  | 'sectionTitle'
  | 'cardLabel'
  | 'metricLarge'
  | 'metricMedium'
  | 'body'
  | 'bodyMuted'
  | 'caption'
  | 'tabLabel',
  Variant
> = {
  displaySerif: {
    fontFamily: fonts.serif,
    fontSize: 44,
    lineHeight: 48,
    letterSpacing: -0.5,
  },
  sectionTitleSerif: {
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 28,
  },
  sectionTitle: {
    fontFamily: fonts.sansSemibold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  cardLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  metricLarge: {
    fontFamily: fonts.sansBold,
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -1.2,
  },
  metricMedium: {
    fontFamily: fonts.sansBold,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.8,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 20,
  },
  bodyMuted: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    lineHeight: 18,
  },
  caption: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  tabLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.1,
  },
};
