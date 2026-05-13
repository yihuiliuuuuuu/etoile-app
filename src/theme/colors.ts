/**
 * Étoile color palette.
 *
 * Inspired by editorial dance photography: paper-white surfaces with
 * a single saturated red accent and neutral typography tones.
 */
export const colors = {
  // Brand
  accent: '#FF3B12',
  accentPressed: '#E0320C',
  accentSoft: '#FFEDE6',

  // Surfaces
  background: '#EFEFF1',
  surface: '#FFFFFF',
  surfaceMuted: '#F6F6F8',
  divider: 'rgba(0,0,0,0.06)',

  // Text
  textPrimary: '#0A0A0A',
  textSecondary: '#6E6E73',
  textTertiary: '#9A9AA0',
  textOnAccent: '#FFFFFF',

  // Chart palette (Studios)
  chart: {
    blue: '#2F7BFF',
    green: '#1FB36F',
    orange: '#FF8A1F',
    pink: '#FF6BA1',
    purple: '#8A5BFF',
    track: '#E5E5EA',
  },

  // Tab bar
  tabBar: '#FFFFFF',
  tabBarBorder: 'rgba(0,0,0,0.04)',

  // Shadow
  shadow: '#000000',
} as const;

export type AppColors = typeof colors;
