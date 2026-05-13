import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, radii, spacing, type } from '../../theme';

type TabKey = 'classes' | 'practice';

type BottomNavProps = {
  active: TabKey;
  onTabPress?: (tab: TabKey) => void;
  onFabPress?: () => void;
};

export function BottomNav({ active, onTabPress, onFabPress }: BottomNavProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.shell, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <View style={styles.pill}>
        <Pressable
          onPress={() => onTabPress?.('classes')}
          style={[styles.tab, active === 'classes' && styles.tabActive]}
        >
          <Ionicons
            name="diamond"
            size={20}
            color={active === 'classes' ? colors.primary : colors.navInactive}
          />
          <Text
            style={[type.navLabel, active === 'classes' ? styles.labelOn : styles.labelOff]}
          >
            Classes
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onTabPress?.('practice')}
          style={[styles.tab, active === 'practice' && styles.tabActive]}
        >
          <View
            style={[
              styles.circleIcon,
              active === 'practice' && { backgroundColor: colors.primary },
            ]}
          />
          <Text
            style={[type.navLabel, active === 'practice' ? styles.labelOn : styles.labelOff]}
          >
            Practice
          </Text>
        </Pressable>
      </View>
      <Pressable style={styles.fab} onPress={onFabPress} accessibilityRole="button">
        <MaterialCommunityIcons name="plus" size={30} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    pointerEvents: 'box-none',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.pill,
    padding: 6,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: radii.pill,
    gap: 4,
  },
  tabActive: {
    backgroundColor: '#E5E5EA',
  },
  labelOn: {
    color: colors.primary,
  },
  labelOff: {
    color: colors.navInactive,
  },
  circleIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.navInactive,
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});
