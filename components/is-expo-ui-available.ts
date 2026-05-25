import { requireOptionalNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';

/** True when @expo/ui is linked (e.g. dev build). False in Expo Go — no ExpoUI native module. */
export function isExpoUINativeModuleAvailable(): boolean {
  if (Platform.OS !== 'ios') return false;
  return requireOptionalNativeModule('ExpoUI') != null;
}
