import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BarChartData } from '../types';
import { Colors } from '../constants/Colors';

interface BarChartProps {
  data: BarChartData[];
  height?: number;
}

export default function BarChart({ data, height = 56 }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={[styles.container, { height }]}>
      {data.map((bar, i) => {
        const barHeight = (bar.value / maxValue) * height;
        return (
          <View key={i} style={styles.barWrapper}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    backgroundColor: bar.isActive ? Colors.chartBarActive : Colors.chartBar,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
});
