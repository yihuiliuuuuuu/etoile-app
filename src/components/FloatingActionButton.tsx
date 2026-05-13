import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { colors, shadows } from '@/src/theme';

interface FloatingActionButtonProps {
  onPress?: () => void;
  bottomInset?: number;
}

export function FloatingActionButton({ onPress, bottomInset = 0 }: FloatingActionButtonProps) {
  return (
    <Pressable
      onPress={() => {
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        onPress?.();
      }}
      accessibilityRole="button"
      accessibilityLabel="Add new entry"
      style={({ pressed }) => [
        styles.fab,
        shadows.fab,
        { bottom: 16 + bottomInset, transform: [{ scale: pressed ? 0.96 : 1 }] },
      ]}
      hitSlop={8}
    >
      <Ionicons name="add" size={32} color={colors.textOnAccent} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
