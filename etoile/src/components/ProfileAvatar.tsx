import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Colors, BorderRadius } from '../constants/theme';

interface ProfileAvatarProps {
  size?: number;
}

export function ProfileAvatar({ size = 44 }: ProfileAvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face' }}
        style={[styles.image, { width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
});
