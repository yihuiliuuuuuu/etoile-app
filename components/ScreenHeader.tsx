import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ImageSourcePropType,
} from 'react-native';
import { Colors } from '../constants/Colors';

interface ScreenHeaderProps {
  title: string;
  heroSource: ImageSourcePropType;
  onProfile?: () => void;
}

const PROFILE_URI =
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=120&q=80';

export default function ScreenHeader({ title, heroSource, onProfile }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <Image source={heroSource} style={styles.hero} resizeMode="cover" />
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Pressable onPress={onProfile} style={styles.avatar}>
          <Image
            source={{ uri: PROFILE_URI }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    overflow: 'hidden',
  },
  hero: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  title: {
    fontSize: 52,
    fontWeight: '800',
    letterSpacing: -2,
    color: Colors.accent,
    lineHeight: 56,
    // Italic for that editorial touch
    fontStyle: 'italic',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.cardBackground,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});
