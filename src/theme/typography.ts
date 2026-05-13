import { TextStyle } from 'react-native';

/**
 * Font families.
 *
 * Headlines use Playfair Display for an editorial / ballet feel, with the
 * italic cut reserved for soft phrases like the greeting. Body and UI text
 * use Manrope which reads as warmer and rounder than typical UI sans.
 *
 * Loaded asynchronously in `app/_layout.tsx`. Until the fonts load we fall
 * back to the platform defaults so the first paint still looks clean.
 */
export const fonts = {
  serif: 'PlayfairDisplay_500Medium',
  serifBold: 'PlayfairDisplay_700Bold',
  serifItalic: 'PlayfairDisplay_500Medium_Italic',
  sans: 'Manrope_400Regular',
  sansMedium: 'Manrope_500Medium',
  sansSemibold: 'Manrope_600SemiBold',
  sansBold: 'Manrope_700Bold',
} as const;

type Variant = TextStyle;

export const typography: Record<
  | 'displaySerif'
  | 'titleSerif'
  | 'subtitleSerifItalic'
  | 'sectionTitle'
  | 'cardLabel'
  | 'eyebrow'
  | 'metricXL'
  | 'metricL'
  | 'metricM'
  | 'body'
  | 'bodyMuted'
  | 'caption'
  | 'tabLabel'
  | 'button',
  Variant
> = {
  displaySerif: {
    fontFamily: fonts.serifBold,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  titleSerif: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: -0.2,
  },
  subtitleSerifItalic: {
    fontFamily: fonts.serifItalic,
    fontSize: 18,
    lineHeight: 22,
  },
  sectionTitle: {
    fontFamily: fonts.sansSemibold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  cardLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  eyebrow: {
    fontFamily: fonts.sansSemibold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  metricXL: {
    fontFamily: fonts.serifBold,
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: -1.5,
  },
  metricL: {
    fontFamily: fonts.serifBold,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.8,
  },
  metricM: {
    fontFamily: fonts.sansBold,
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
  },
  bodyMuted: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    lineHeight: 20,
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
    letterSpacing: 0.2,
  },
  button: {
    fontFamily: fonts.sansSemibold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
};
