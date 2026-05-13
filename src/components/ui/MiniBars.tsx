import { StyleSheet, View } from 'react-native';
import { colors, radii, spacing } from '../../theme';

type MiniBarsProps = {
  /** Heights in 0–1, rendered left to right */
  values: number[];
  activeIndex?: number;
};

export function MiniBars({ values, activeIndex }: MiniBarsProps) {
  const max = Math.max(...values, 0.0001);
  return (
    <View style={styles.row}>
      {values.map((v, i) => {
        const h = 36 * (v / max);
        const active =
          activeIndex === undefined ? i === values.length - 1 : i === activeIndex;
        return (
          <View
            key={i}
            style={[
              styles.bar,
              { height: Math.max(8, h) },
              active ? styles.barActive : styles.barInactive,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    height: 40,
  },
  bar: {
    width: 10,
    borderRadius: radii.bar,
  },
  barInactive: {
    backgroundColor: colors.barInactive,
  },
  barActive: {
    backgroundColor: colors.primary,
  },
});
