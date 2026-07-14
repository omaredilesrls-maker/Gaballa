import React, { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { colors } from '../theme';

interface Props {
  children: ReactNode;
  overlap?: number;
  style?: StyleProp<ViewStyle>;
}

export default function Panel({ children, overlap = 8, style }: Props) {
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.bg,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginTop: -overlap,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
