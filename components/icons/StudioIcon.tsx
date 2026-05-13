import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export default function StudioIcon({ size = 18, color = '#E63A1E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="3" stroke={color} strokeWidth="1.8" />
      <Circle cx="5" cy="10" r="2" stroke={color} strokeWidth="1.8" />
      <Circle cx="19" cy="10" r="2" stroke={color} strokeWidth="1.8" />
      <Path
        d="M2 20C2 17 3.5 15 5 15C6.5 15 7.5 16 8.5 16.5"
        stroke={color} strokeWidth="1.8" strokeLinecap="round"
      />
      <Path
        d="M22 20C22 17 20.5 15 19 15C17.5 15 16.5 16 15.5 16.5"
        stroke={color} strokeWidth="1.8" strokeLinecap="round"
      />
      <Path
        d="M7 20C7 17.2 9.2 15 12 15C14.8 15 17 17.2 17 20"
        stroke={color} strokeWidth="1.8" strokeLinecap="round"
      />
    </Svg>
  );
}
