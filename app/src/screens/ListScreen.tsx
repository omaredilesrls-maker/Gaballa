import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import GradientHeader from '../components/GradientHeader';
import Panel from '../components/Panel';
import ProductAvatar from '../components/ProductAvatar';
import { CartIcon } from '../components/Icons';
import { colors, fonts } from '../theme';

interface CartItem {
  id: string;
  name: string;
  tileBg: string;
  tileColor: string;
  initials: string;
  bestStoreName: string;
  unitPriceLabel: string;
  qty: number;
}

interface CartTotal {
  storeName: string;
  totalLabel: string;
  barPct: number;
  barColor: string;
}

interface Props {
  cartCount: number;
  hasCartItems: boolean;
  isCartEmpty: boolean;
  cartBestStoreName: string;
  cartBestTotalLabel: string;
  cartTotalSavingsLabel: string;
  cartTotals: CartTotal[];
  cartItems: CartItem[];
  itemQtyPlus: (id: string) => void;
  itemQtyMinus: (id: string) => void;
  itemRemove: (id: string) => void;
  goSearch: () => void;
}

export default function ListScreen({
  cartCount,
  hasCartItems,
  isCartEmpty,
  cartBestStoreName,
  cartBestTotalLabel,
  cartTotalSavingsLabel,
  cartTotals,
  cartItems,
  itemQtyPlus,
  itemQtyMinus,
  itemRemove,
  goSearch,
}: Props) {
  return (
    <View style={styles.container}>
      <GradientHeader>
        <Text style={styles.headerTitle}>Lista della spesa</Text>
        <Text style={styles.headerSub}>{cartCount} articoli</Text>
      </GradientHeader>
      <Panel overlap={8}>
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {hasCartItems && (
            <View style={{ gap: 20 }}>
              <View style={styles.bestCard}>
                <Text style={styles.bestCardLabel}>Il supermercato più conveniente per tutta la lista</Text>
                <Text style={styles.bestCardValue}>
                  {cartBestStoreName} · {cartBestTotalLabel}
                </Text>
                <Text style={styles.bestCardSavings}>Risparmi {cartTotalSavingsLabel} rispetto al più caro</Text>
                <View style={{ gap: 8, marginTop: 14 }}>
                  {cartTotals.map(t => (
                    <View key={t.storeName} style={styles.barRow}>
                      <Text style={styles.barStoreName} numberOfLines={1}>
                        {t.storeName}
                      </Text>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, { width: `${t.barPct}%`, backgroundColor: t.barColor }]} />
                      </View>
                      <Text style={styles.barTotal}>{t.totalLabel}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={{ gap: 10 }}>
                {cartItems.map(it => (
                  <View key={it.id} style={styles.itemRow}>
                    <ProductAvatar size={46} bg={it.tileBg} color={it.tileColor} initials={it.initials} fontSize={12.5} radius={11} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={styles.itemName}>{it.name}</Text>
                      <Text style={styles.itemMeta}>
                        da {it.bestStoreName} · {it.unitPriceLabel}
                      </Text>
                    </View>
                    <View style={styles.stepper}>
                      <Pressable style={styles.stepperButton} onPress={() => itemQtyMinus(it.id)}>
                        <Text style={styles.stepperSymbol}>−</Text>
                      </Pressable>
                      <Text style={styles.stepperValue}>{it.qty}</Text>
                      <Pressable style={styles.stepperButton} onPress={() => itemQtyPlus(it.id)}>
                        <Text style={styles.stepperSymbol}>+</Text>
                      </Pressable>
                    </View>
                    <Pressable style={styles.removeButton} onPress={() => itemRemove(it.id)}>
                      <Text style={styles.removeSymbol}>✕</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          )}

          {isCartEmpty && (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <CartIcon size={28} color={colors.green700} strokeWidth={1.8} />
              </View>
              <Text style={styles.emptyTitle}>La tua lista è vuota</Text>
              <Text style={styles.emptySub}>Aggiungi prodotti per confrontare i prezzi tra i supermercati</Text>
              <Pressable style={styles.emptyButton} onPress={goSearch}>
                <Text style={styles.emptyButtonText}>Cerca prodotti</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </Panel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: 19,
    color: colors.white,
  },
  headerSub: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 3,
    fontFamily: fonts.body,
  },
  body: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  bestCard: {
    backgroundColor: colors.green800,
    borderRadius: 16,
    padding: 16,
  },
  bestCardLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontFamily: fonts.bodySemibold,
  },
  bestCardValue: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 19,
    marginTop: 6,
  },
  bestCardSavings: {
    color: colors.greenTintText,
    fontSize: 12.5,
    fontFamily: fonts.bodyBold,
    marginTop: 4,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  barStoreName: {
    width: 64,
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.75)',
    flexShrink: 0,
    fontFamily: fonts.body,
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  barTotal: {
    width: 56,
    textAlign: 'right',
    fontSize: 12,
    fontFamily: fonts.bodyBold,
    color: colors.white,
    flexShrink: 0,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
  },
  itemName: {
    fontSize: 14,
    fontFamily: fonts.bodySemibold,
    color: colors.text,
  },
  itemMeta: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: fonts.body,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bg,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  stepperButton: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperSymbol: {
    fontSize: 14,
    fontFamily: fonts.bodyBold,
    color: colors.green700,
  },
  stepperValue: {
    minWidth: 14,
    textAlign: 'center',
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.text,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  removeSymbol: {
    fontSize: 16,
    color: colors.red,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.greenTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 15.5,
    color: colors.text,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textMuted,
    maxWidth: 220,
    textAlign: 'center',
    fontFamily: fonts.body,
  },
  emptyButton: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.green500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButtonText: {
    color: colors.white,
    fontFamily: fonts.headingBold,
    fontSize: 14,
  },
});
