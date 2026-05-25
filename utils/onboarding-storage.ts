import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'etoile_onboarding_completed_v1';

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function setOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // Ignore — app should still proceed if storage is unavailable.
  }
}

/** Dev helper — call from a debug menu if needed. */
export async function clearOnboardingCompleted(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
