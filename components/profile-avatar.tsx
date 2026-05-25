import { DEFAULT_AVATAR } from '@/utils/profile-avatar';
import { Image, type ImageStyle } from 'expo-image';
import { StyleSheet, type StyleProp } from 'react-native';

type Props = {
  uri: string | null;
  /** Bumps when the user picks a new photo so the same file path still reloads. */
  revision?: number;
  size: number;
  style?: StyleProp<ImageStyle>;
};

export function ProfileAvatar({ uri, revision = 0, size, style }: Props) {
  const radius = size / 2;
  const imageKey = uri ? `${uri}::${revision}` : `default::${revision}`;

  return (
    <Image
      key={imageKey}
      source={uri ? { uri } : DEFAULT_AVATAR}
      style={[{ width: size, height: size, borderRadius: radius }, style]}
      contentFit="cover"
      cachePolicy="none"
      recyclingKey={imageKey}
    />
  );
}

export const profileAvatarBaseStyle = StyleSheet.create({
  base: {
    overflow: 'hidden',
    backgroundColor: '#e8e6ed',
  },
});
