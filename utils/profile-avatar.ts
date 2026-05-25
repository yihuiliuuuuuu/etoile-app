import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';

const AVATAR_STORAGE_KEY = 'etoile_profile_avatar_uri_v1';
const AVATAR_FILENAME = 'profile-avatar.jpg';

export const DEFAULT_AVATAR = require('@/assets/profile-default.png');

function avatarFilePath(): string | null {
  if (!FileSystem.documentDirectory) return null;
  return `${FileSystem.documentDirectory}${AVATAR_FILENAME}`;
}

export async function loadPersistedAvatarUri(): Promise<string | null> {
  try {
    const stored = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
    if (!stored) return null;
    const info = await FileSystem.getInfoAsync(stored);
    if (!info.exists) {
      await AsyncStorage.removeItem(AVATAR_STORAGE_KEY);
      return null;
    }
    return stored;
  } catch {
    return null;
  }
}

export async function pickAndPersistAvatar(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (permission.status !== 'granted') {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
  });

  if (result.canceled || !result.assets?.[0]?.uri) {
    return null;
  }

  const dest = avatarFilePath();
  if (!dest) return null;

  try {
    const existing = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
    if (existing && existing !== dest) {
      const info = await FileSystem.getInfoAsync(existing);
      if (info.exists) {
        await FileSystem.deleteAsync(existing, { idempotent: true });
      }
    }
  } catch {
    // ignore cleanup errors
  }

  await FileSystem.copyAsync({ from: result.assets[0].uri, to: dest });
  await AsyncStorage.setItem(AVATAR_STORAGE_KEY, dest);
  return dest;
}

export async function clearPersistedAvatar(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
    if (stored) {
      await FileSystem.deleteAsync(stored, { idempotent: true });
    }
    await AsyncStorage.removeItem(AVATAR_STORAGE_KEY);
  } catch {
    // ignore
  }
}
