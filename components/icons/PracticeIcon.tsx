import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export default function PracticeIcon({ size = 18, color = '#E63A1E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 18C5 18 6 12 9 9C11 7 13 7 14 8"
        stroke={color} strokeWidth="1.8" strokeLinecap="round"
      />
      <Path
        d="M19 6C19 6 18 12 15 15C13 17 11 17 10 16"
        stroke={color} strokeWidth="1.8" strokeLinecap="round"
      />
      <Circle cx="14.5" cy="7.5" r="2" fill={color} />
      <Circle cx="9.5" cy="16.5" r="2" fill={color} />
    </Svg>
  );
}
