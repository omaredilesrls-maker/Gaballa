import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import GradientHeader from '../components/GradientHeader';
import Panel from '../components/Panel';
import CategoryChips from '../components/CategoryChips';
import ProductAvatar from '../components/ProductAvatar';
import { ChevronLeftIcon, SearchIcon } from '../components/Icons';
import { colors, fonts } from '../theme';
import { EnrichedProduct } from '../data';

interface Category {
  label: string;
  bg: string;
  color: string;
  border: string;
}

interface Props {
  goHome: () => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  categories: Category[];
  selectCategory: (label: string) => void;
  resultsCountLabel: string;
  filteredProducts: EnrichedProduct[];
  openProduct: (id: string) => void;
}

export default function SearchScreen({
  goHome,
  searchQuery,
  setSearchQuery,
  categories,
  selectCategory,
  resultsCountLabel,
  filteredProducts,
  openProduct,
}: Props) {
  return (
    <View style={styles.container}>
      <GradientHeader paddingBottom={18}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={goHome}>
            <ChevronLeftIcon size={9} />
          </Pressable>
          <Text style={styles.headerTitle}>Cerca</Text>
        </View>
      </GradientHeader>
      <Panel overlap={8}>
        <View style={styles.body}>
          <View style={styles.searchBar}>
            <SearchIcon size={17} color={colors.textMuted} strokeWidth={2} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Es. pasta, latte, caffè…"
              placeholderTextColor={colors.textPlaceholder}
              autoFocus
              style={styles.searchInput}
            />
          </View>

          <CategoryChips categories={categories} onSelect={selectCategory} compact />

          <Text style={styles.resultsCount}>{resultsCountLabel}</Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 100 }}>
            {filteredProducts.map(p => (
              <Pressable key={p.id} style={styles.row} onPress={() => openProduct(p.id)}>
                <ProductAvatar size={48} bg={p.tileBg} color={p.tileColor} initials={p.initials} fontSize={13} fotoUrl={p.fotoUrl} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.rowName}>{p.name}</Text>
                  <Text style={styles.rowMeta}>
                    {p.unit} · {p.category}
                  </Text>
                </View>
                <View style={styles.priceCol}>
                  <Text style={styles.priceLabel}>da</Text>
                  <Text style={styles.price}>{p.minPriceLabel}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Panel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: 19,
    color: colors.white,
  },
  body: {
    flex: 1,
    padding: 20,
    paddingTop: 18,
    gap: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    fontFamily: fonts.body,
    color: colors.text,
  },
  resultsCount: {
    fontSize: 12.5,
    color: colors.textMuted,
    fontFamily: fonts.bodySemibold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
  },
  rowName: {
    fontSize: 14.5,
    fontFamily: fonts.bodySemibold,
    color: colors.text,
  },
  rowMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: fonts.body,
  },
  priceCol: {
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 11,
    color: colors.textFaint,
    fontFamily: fonts.body,
  },
  price: {
    fontSize: 15,
    color: colors.green700,
    fontFamily: fonts.heading,
  },
});
