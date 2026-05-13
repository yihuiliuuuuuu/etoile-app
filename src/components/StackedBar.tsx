import { StyleSheet, View } from 'react-native';

interface StackedBarSegment {
  id: string;
  color: string;
  value: number;
}

interface StackedBarProps {
  segments: StackedBarSegment[];
  height?: number;
  gap?: number;
}

/**
 * Horizontal proportional bar made of multiple colored segments.
 *
 * A small gap is left between segments so the colors stay distinct without
 * needing borders.
 */
export function StackedBar({ segments, height = 10, gap = 3 }: StackedBarProps) {
  const total = segments.reduce((acc, seg) => acc + seg.value, 0) || 1;

  return (
    <View
      style={[styles.row, { height, borderRadius: height / 2 }]}
      accessibilityRole="image"
    >
      {segments.map((segment, index) => {
        const flex = segment.value / total;
        if (flex <= 0) return null;
        return (
          <View
            key={segment.id}
            style={{
              flex,
              backgroundColor: segment.color,
              borderRadius: height / 2,
              marginLeft: index === 0 ? 0 : gap,
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    overflow: 'hidden',
  },
});
