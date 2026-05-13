import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/AppText';
import { colors } from '@/src/theme';

interface AvatarProps {
  uri?: string;
  initials?: string;
  size?: number;
}

/**
 * Round avatar with a soft blush border. Falls back to initials in a
 * primary-tinted circle when no image is provided.
 */
export function Avatar({ uri, initials = '', size = 44 }: AvatarProps) {
  const dimension = { width: size, height: size, borderRadius: size / 2 };

  return (
    <View style={[styles.wrapper, dimension]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, dimension]}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <View style={[styles.fallback, dimension]}>
          <AppText variant="cardLabel" color={colors.textOnPrimary}>
            {initials.slice(0, 2).toUpperCase()}
          </AppText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 2,
    borderColor: colors.primarySoft,
    backgroundColor: colors.primarySoft,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
});
