import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileAvatar } from './ProfileAvatar';
import { colors, typography, spacing } from '../theme';

interface HeroHeaderProps {
  title: string;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ title }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['rgba(220, 210, 200, 0.9)', 'rgba(220, 210, 200, 0.3)', 'rgba(245, 242, 239, 1)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.headerContent}>
        <Text style={styles.title}>{title}</Text>
        <ProfileAvatar size={44} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    justifyContent: 'flex-end',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.heroTitle,
    color: colors.primary,
  },
});
