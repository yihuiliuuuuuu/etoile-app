import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export default function ActivityIcon({ size = 18, color = '#E63A1E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="17" rx="3" stroke={color} strokeWidth="1.8" />
      <Path d="M3 9H21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M8 2V6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M16 2V6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Rect x="7" y="13" width="2" height="4" rx="1" fill={color} />
      <Rect x="11" y="12" width="2" height="5" rx="1" fill={color} />
      <Rect x="15" y="14" width="2" height="3" rx="1" fill={color} />
    </Svg>
  );
}
