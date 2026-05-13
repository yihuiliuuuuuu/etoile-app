/**
 * Étoile color palette.
 *
 * A soft, feminine wellness aesthetic: warm ivory canvas, dusty rose
 * primary, a muted gold for accents, and aubergine-tinted neutrals for
 * type. Designed to feel calm and premium rather than loud.
 */
export const colors = {
  // Brand
  primary: '#B47882', // dusty rose
  primaryPressed: '#9A5F6B',
  primarySoft: '#F5E0DF', // blush wash for fills
  primaryDeep: '#6E3F49', // CTAs on light surfaces

  // Secondary highlights
  gold: '#C9A66B',
  lavender: '#C9BDDB',
  sage: '#A8B79C',

  // Surfaces
  background: '#FAF6F2', // warm ivory canvas
  surface: '#FFFFFF',
  surfaceAlt: '#F2EAE6', // blush card variant
  surfaceMuted: '#F6EFEB',
  divider: 'rgba(42, 31, 34, 0.06)',

  // Text
  textPrimary: '#2A1F22', // warm aubergine-black
  textSecondary: '#6B5660',
  textTertiary: '#A89299',
  textOnPrimary: '#FFFFFF',

  // States
  success: '#7B9E7E',
  warning: '#D4A862',

  // Chart palette
  chart: {
    rose: '#B47882',
    blush: '#E4B7B2',
    gold: '#C9A66B',
    lavender: '#C9BDDB',
    sage: '#A8B79C',
    track: '#EFE6E2',
  },

  // Tab bar / shadows
  tabBar: '#FFFFFF',
  shadow: '#2A1F22',
} as const;

export type AppColors = typeof colors;
