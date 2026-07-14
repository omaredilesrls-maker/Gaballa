import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import GradientHeader from '../components/GradientHeader';
import Panel from '../components/Panel';
import CategoryChips from '../components/CategoryChips';
import ProductAvatar from '../components/ProductAvatar';
import { BellIcon, CartIcon, ChevronRightIcon, PinIcon, SearchIcon } from '../components/Icons';
import { colors, fonts } from '../theme';
import { EnrichedProduct } from '../data';

interface Category {
  label: string;
  bg: string;
  color: string;
  border: string;
}

interface Props {
  locationLabel: string;
  goLocation: () => void;
  goSearch: () => void;
  goList: () => void;
  categories: Category[];
  selectCategory: (label: string) => void;
  homeDeals: EnrichedProduct[];
  openProduct: (id: string) => void;
  hasCartItems: boolean;
  cartCount: number;
  cartTotalSavingsLabel: string;
  cartBestStoreName: string;
}

export default function HomeScreen({
  locationLabel,
  goLocation,
  goSearch,
  goList,
  categories,
  selectCategory,
  homeDeals,
  openProduct,
  hasCartItems,
  cartCount,
  cartTotalSavingsLabel,
  cartBestStoreName,
}: Props) {
  return (
    <View style={styles.container}>
      <GradientHeader>
        <View style={styles.headerRow}>
          <Pressable style={styles.locationPill} onPress={goLocation}>
            <PinIcon size={14} strokeWidth={2} filledDot />
            <Text style={styles.locationText}>{locationLabel}</Text>
            <ChevronRightIcon size={9} color="rgba(255,255,255,0.7)" />
          </Pressable>
          <View style={styles.bellButton}>
            <BellIcon size={16} />
          </View>
        </View>
      </GradientHeader>
      <Panel overlap={14}>
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.greeting}>Ciao! 👋</Text>
            <Text style={styles.greetingSub}>Ecco i risparmi vicino a te oggi</Text>
          </View>

          <Pressable style={styles.searchBar} onPress={goSearch}>
            <SearchIcon size={17} color={colors.textMuted} strokeWidth={2} />
            <Text style={styles.searchPlaceholder}>Cerca un prodotto…</Text>
          </Pressable>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categorie</Text>
            <CategoryChips categories={categories} onSelect={selectCategory} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Offerte migliori nella tua zona</Text>
            <View style={{ gap: 10 }}>
              {homeDeals.map(p => (
                <Pressable key={p.id} style={styles.dealRow} onPress={() => openProduct(p.id)}>
                  <ProductAvatar size={52} bg={p.tileBg} color={p.tileColor} initials={p.initials} fontSize={14} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.dealName} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text style={styles.dealMeta} numberOfLines={1}>
                      {p.unit} · da <Text style={styles.dealPrice}>{p.minPriceLabel}</Text> da {p.minStoreName}
                    </Text>
                  </View>
                  <View style={styles.savingsBadge}>
                    <Text style={styles.savingsBadgeText}>-{p.savingsPctLabel}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {hasCartItems && (
            <Pressable style={styles.cartBanner} onPress={goList}>
              <View style={styles.cartBannerIcon}>
                <CartIcon size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cartBannerTitle}>{cartCount} articoli nella lista</Text>
                <Text style={styles.cartBannerSub}>
                  Risparmi {cartTotalSavingsLabel} da {cartBestStoreName}
                </Text>
              </View>
              <ChevronRightIcon size={8} color="rgba(255,255,255,0.6)" />
            </Pressable>
          )}
        </ScrollView>
      </Panel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  locationText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: fonts.bodySemibold,
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 20,
    paddingBottom: 100,
    gap: 22,
  },
  greeting: {
    fontFamily: fonts.heading,
    fontSize: 21,
    color: colors.text,
  },
  greetingSub: {
    fontSize: 13.5,
    color: colors.textMuted,
    marginTop: 3,
    fontFamily: fonts.body,
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
  searchPlaceholder: {
    color: colors.textPlaceholder,
    fontSize: 14.5,
    fontFamily: fonts.body,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 14.5,
    color: colors.text,
  },
  dealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
  },
  dealName: {
    fontSize: 14.5,
    fontFamily: fonts.bodySemibold,
    color: colors.text,
  },
  dealMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: fonts.body,
  },
  dealPrice: {
    color: colors.green700,
    fontFamily: fonts.bodyBold,
  },
  savingsBadge: {
    flexShrink: 0,
    backgroundColor: colors.orangeTint,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 9,
  },
  savingsBadgeText: {
    color: colors.orange,
    fontSize: 11.5,
    fontFamily: fonts.headingBold,
  },
  cartBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.green800,
    borderRadius: 16,
    padding: 16,
  },
  cartBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBannerTitle: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.headingBold,
  },
  cartBannerSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12.5,
    marginTop: 2,
    fontFamily: fonts.body,
  },
});
