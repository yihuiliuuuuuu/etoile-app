import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { ProfileAvatar } from './ProfileAvatar';
import { Colors, Spacing } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderBannerProps {
  title: string;
}

export function HeaderBanner({ title }: HeaderBannerProps) {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&q=80' }}
      style={styles.container}
      imageStyle={styles.image}
    >
      <LinearGradient
        colors={['rgba(250,248,245,0)', 'rgba(250,248,245,0.7)', 'rgba(250,248,245,1)']}
        locations={[0, 0.6, 1]}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <ProfileAvatar />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    justifyContent: 'flex-end',
  },
  image: {
    resizeMode: 'cover',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: 42,
    fontStyle: 'italic',
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
});
