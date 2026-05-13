import { Image, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/src/theme';

import { AppText } from './AppText';

interface ScreenHeaderProps {
  title: string;
  avatarUri?: string;
}

/**
 * The large editorial title that sits over a hero photograph at the top of
 * each main screen. The avatar circle is rendered on top right.
 */
export function ScreenHeader({
  title,
  avatarUri = 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=160&q=80&auto=format&fit=crop',
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=900&q=80&auto=format&fit=crop',
        }}
        style={StyleSheet.absoluteFill}
        accessibilityIgnoresInvertColors
      />
      <View style={styles.tintOverlay} />
      <View style={styles.row}>
        <AppText variant="displaySerif" color={colors.accent} style={styles.title}>
          {title}
        </AppText>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatar}
            accessibilityIgnoresInvertColors
          />
        </View>
      </View>
    </View>
  );
}

const HEADER_HEIGHT = 220;

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    width: '100%',
    backgroundColor: '#111',
    overflow: 'hidden',
  },
  tintOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  title: {
    flexShrink: 1,
  },
  avatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#222',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});
