import { Text, TextProps, TextStyle } from 'react-native';

import { colors, typography } from '@/src/theme';

type Variant = keyof typeof typography;

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  style?: TextStyle | TextStyle[];
}

export function AppText({
  variant = 'body',
  color = colors.textPrimary,
  style,
  children,
  ...rest
}: AppTextProps) {
  return (
    <Text {...rest} style={[typography[variant], { color }, style]}>
      {children}
    </Text>
  );
}
