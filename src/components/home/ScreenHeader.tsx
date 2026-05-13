import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, type } from '../../theme';

const HEADER_URI =
  'https://images.unsplash.com/photo-1518611012118-396072d25398?auto=format&fit=crop&w=1400&q=85';

const AVATAR_URI =
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&h=200&q=80';

type ScreenHeaderProps = {
  title: string;
};

export function ScreenHeader({ title }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.wrap}>
      <Image source={{ uri: HEADER_URI }} style={styles.photo} contentFit="cover" />
      <LinearGradient
        colors={['rgba(0,0,0,0.15)', 'rgba(242,242,247,0)', colors.background]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <View style={{ flex: 1 }} />
        <Image source={{ uri: AVATAR_URI }} style={styles.avatar} contentFit="cover" />
      </View>
      <Text style={[type.heroTitle, styles.title]}>{title}</Text>
    </View>
  );
}

const HEADER_HEIGHT = 248;

const styles = StyleSheet.create({
  wrap: {
    height: HEADER_HEIGHT,
    marginHorizontal: -spacing.lg,
    marginTop: -spacing.lg,
    marginBottom: spacing.md,
  },
  photo: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.92,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.white,
  },
  title: {
    position: 'absolute',
    left: spacing.lg,
    bottom: spacing.sm,
    color: colors.primary,
  },
});
