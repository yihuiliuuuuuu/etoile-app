import React from 'react';
import Svg, { Circle } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export default function GoalIcon({ size = 18, color = '#E63A1E' }: Props) {
  const r = size / 2;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
      <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" fill="none" />
      <Circle cx="12" cy="12" r="2" fill={color} />
    </Svg>
  );
}
