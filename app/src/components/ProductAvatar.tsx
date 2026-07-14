import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fonts } from '../theme';

interface Props {
  size: number;
  bg: string;
  color: string;
  initials: string;
  fontSize?: number;
  radius?: number;
}

export default function ProductAvatar({ size, bg, color, initials, fontSize = 14, radius }: Props) {
  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: radius ?? size * 0.23,
          backgroundColor: bg,
        },
      ]}
    >
      <Text style={{ color, fontFamily: fonts.heading, fontSize }}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
