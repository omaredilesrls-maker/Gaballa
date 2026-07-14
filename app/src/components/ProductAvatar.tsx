import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { fonts } from '../theme';

interface Props {
  size: number;
  bg: string;
  color: string;
  initials: string;
  fontSize?: number;
  radius?: number;
  // Foto del prodotto (da Supabase Storage): se presente sostituisce le iniziali.
  fotoUrl?: string | null;
}

export default function ProductAvatar({ size, bg, color, initials, fontSize = 14, radius, fotoUrl }: Props) {
  const borderRadius = radius ?? size * 0.23;
  if (fotoUrl) {
    return (
      <Image
        source={{ uri: fotoUrl }}
        style={[styles.tile, { width: size, height: size, borderRadius, backgroundColor: bg }]}
        resizeMode="cover"
      />
    );
  }
  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius,
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
