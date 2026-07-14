import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientHeader from '../components/GradientHeader';
import Panel from '../components/Panel';
import ProductAvatar from '../components/ProductAvatar';
import { ChevronLeftIcon } from '../components/Icons';
import { colors, fonts } from '../theme';
import { EnrichedProduct } from '../data';

interface StoreRow {
  storeName: string;
  storeInitials: string;
  storeColor: string;
  distanceLabel: string;
  isBest: boolean;
  priceLabel: string;
  priceColor: string;
  borderColor: string;
  showDelta: boolean;
  deltaLabel: string;
}

interface Props {
  goBack: () => void;
  selectedProduct: EnrichedProduct;
  storeRows: StoreRow[];
  detailQty: number;
  onQtyPlus: () => void;
  onQtyMinus: () => void;
  onAddToList: () => void;
  addButtonLabel: string;
}

export default function DetailScreen({
  goBack,
  selectedProduct,
  storeRows,
  detailQty,
  onQtyPlus,
  onQtyMinus,
  onAddToList,
  addButtonLabel,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <GradientHeader>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={goBack}>
            <ChevronLeftIcon size={9} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {selectedProduct.name}
          </Text>
        </View>
      </GradientHeader>
      <Panel overlap={8}>
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.productRow}>
            <ProductAvatar
              size={76}
              bg={selectedProduct.tileBg}
              color={selectedProduct.tileColor}
              initials={selectedProduct.initials}
              fontSize={19}
              radius={18}
              fotoUrl={selectedProduct.fotoUrl}
            />
            <View>
              <Text style={styles.productName}>{selectedProduct.name}</Text>
              <Text style={styles.productMeta}>
                {selectedProduct.unit} · {selectedProduct.category}
              </Text>
            </View>
          </View>

          <View style={styles.savingsBox}>
            <Text style={styles.savingsBoxText}>
              Risparmi <Text style={styles.bold}>{selectedProduct.savingsLabel}</Text> (
              {selectedProduct.savingsPctLabel}) scegliendo{' '}
              <Text style={styles.bold}>{selectedProduct.minStoreName}</Text> invece del prezzo più
              alto in zona.
            </Text>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={styles.sectionTitle}>Confronto prezzi vicino a te</Text>
            {storeRows.map(row => (
              <View key={row.storeName} style={[styles.storeRow, { borderColor: row.borderColor }]}>
                <View style={[styles.storeAvatar, { backgroundColor: row.storeColor }]}>
                  <Text style={styles.storeInitials}>{row.storeInitials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.storeName}>{row.storeName}</Text>
                  <Text style={styles.storeDistance}>{row.distanceLabel}</Text>
                </View>
                {row.isBest && (
                  <View style={styles.bestBadge}>
                    <Text style={styles.bestBadgeText}>MIGLIORE</Text>
                  </View>
                )}
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.storePrice, { color: row.priceColor }]}>{row.priceLabel}</Text>
                  {row.showDelta && <Text style={styles.storeDelta}>+{row.deltaLabel}</Text>}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </Panel>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.stepper}>
          <Pressable style={styles.stepperButton} onPress={onQtyMinus}>
            <Text style={styles.stepperSymbol}>−</Text>
          </Pressable>
          <Text style={styles.stepperValue}>{detailQty}</Text>
          <Pressable style={styles.stepperButton} onPress={onQtyPlus}>
            <Text style={styles.stepperSymbol}>+</Text>
          </Pressable>
        </View>
        <Pressable style={styles.addButton} onPress={onAddToList}>
          <Text style={styles.addButtonText}>{addButtonLabel}</Text>
        </Pressable>
      </View>
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
    fontSize: 17,
    color: colors.white,
    flexShrink: 1,
  },
  body: {
    padding: 20,
    paddingTop: 22,
    paddingBottom: 130,
    gap: 20,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  productName: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.text,
  },
  productMeta: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 3,
    fontFamily: fonts.body,
  },
  savingsBox: {
    backgroundColor: colors.greenTint,
    borderRadius: 14,
    padding: 13,
    paddingHorizontal: 16,
  },
  savingsBoxText: {
    fontSize: 13,
    color: colors.green700,
    lineHeight: 20,
    fontFamily: fonts.body,
  },
  bold: {
    fontFamily: fonts.bodyBold,
  },
  sectionTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 14.5,
    color: colors.text,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    paddingHorizontal: 14,
  },
  storeAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  storeInitials: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 12,
  },
  storeName: {
    fontSize: 14,
    fontFamily: fonts.headingBold,
    color: colors.text,
  },
  storeDistance: {
    fontSize: 11.5,
    color: colors.textFaint,
    marginTop: 1,
    fontFamily: fonts.body,
  },
  bestBadge: {
    backgroundColor: colors.green500,
    borderRadius: 7,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  bestBadgeText: {
    color: colors.white,
    fontSize: 10.5,
    fontFamily: fonts.headingBold,
  },
  storePrice: {
    fontSize: 16,
    fontFamily: fonts.heading,
  },
  storeDelta: {
    fontSize: 11,
    color: colors.amber,
    marginTop: 1,
    fontFamily: fonts.body,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  stepperSymbol: {
    fontSize: 16,
    fontFamily: fonts.bodyBold,
    color: colors.green700,
  },
  stepperValue: {
    minWidth: 16,
    textAlign: 'center',
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.text,
  },
  addButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.green500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontFamily: fonts.headingBold,
    fontSize: 14.5,
  },
});
