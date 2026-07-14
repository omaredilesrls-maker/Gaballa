import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { fonts } from '../theme';

interface Category {
  label: string;
  bg: string;
  color: string;
  border: string;
}

interface Props {
  categories: Category[];
  onSelect: (label: string) => void;
  compact?: boolean;
}

export default function CategoryChips({ categories, onSelect, compact }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {categories.map(cat => (
        <Pressable
          key={cat.label}
          onPress={() => onSelect(cat.label)}
          style={[
            styles.chip,
            {
              backgroundColor: cat.bg,
              borderColor: cat.border,
              paddingVertical: compact ? 8 : 9,
              paddingHorizontal: compact ? 14 : 15,
            },
          ]}
        >
          <Text style={[styles.label, { color: cat.color, fontSize: compact ? 12.5 : 13 }]}>{cat.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingBottom: 2,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1.5,
  },
  label: {
    fontFamily: fonts.bodySemibold,
  },
});
