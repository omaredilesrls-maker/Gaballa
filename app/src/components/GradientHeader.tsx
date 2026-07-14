import React, { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { gradient } from '../theme';

interface Props {
  children: ReactNode;
  paddingBottom?: number;
  style?: StyleProp<ViewStyle>;
}

export default function GradientHeader({ children, paddingBottom = 20, style }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={gradient.header}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.75, y: 1 }}
      style={[
        {
          paddingTop: insets.top + 18,
          paddingHorizontal: 20,
          paddingBottom,
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}
