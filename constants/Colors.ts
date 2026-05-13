export const Colors = {
  // Brand
  accent: '#E63A1E',       // primary red-orange
  accentLight: '#FF5C3E',  // lighter accent
  accentMuted: '#F0D4CF',  // pale accent for backgrounds

  // Neutrals
  background: '#F2F1EF',
  cardBackground: '#FFFFFF',
  surface: '#F8F7F5',

  // Text
  textPrimary: '#111111',
  textSecondary: '#8A8A8A',
  textTertiary: '#BBBBBB',
  textInverse: '#FFFFFF',

  // UI elements
  separator: '#E8E7E5',
  chartBar: '#E0DFDD',     // inactive bar
  chartBarActive: '#E63A1E',

  // Studios palette
  studio1: '#3D7BF5',   // Dock 11 – blue
  studio2: '#4AC26B',   // Fit' Ballet – green
  studio3: '#F5A623',   // Center of Dance – orange
  studio4: '#F5E642',   // Papillon – yellow
  studio5: '#9B59B6',   // House of Healing – purple
} as const;

export type ColorKey = keyof typeof Colors;
