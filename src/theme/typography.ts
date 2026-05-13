import { TextStyle } from 'react-native';

export const typography = {
  heroTitle: {
    fontFamily: 'PlayfairDisplay_700Bold_Italic',
    fontSize: 42,
    lineHeight: 50,
  } as TextStyle,
  sectionTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
  } as TextStyle,
  statLarge: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 56,
    lineHeight: 64,
  } as TextStyle,
  statMedium: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 40,
    lineHeight: 48,
  } as TextStyle,
  body: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400' as const,
  } as TextStyle,
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  } as TextStyle,
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  } as TextStyle,
  link: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400' as const,
  } as TextStyle,
  timeDisplay: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 44,
    lineHeight: 52,
  } as TextStyle,
  dateDisplay: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '300' as const,
  } as TextStyle,
};
