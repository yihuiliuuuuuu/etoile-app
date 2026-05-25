import { Platform } from 'react-native';

export const screenBackground = '#f1f2f5';

export const sfPro = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'system-ui',
});

export const letterTight = -0.45;
export const weightSemibold = '600' as const;
