import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

interface ProfileAvatarProps {
  size?: number;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ size = 44 }) => (
  <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
    <LinearGradient
      colors={['#C9A96E', '#8B6914']}
      style={[styles.gradient, { borderRadius: size / 2 }]}
    />
    <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  gradient: {
    flex: 1,
  },
  ring: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: 2,
    borderColor: colors.white,
  },
});
