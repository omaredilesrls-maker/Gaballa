import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CartIcon, HomeTabIcon, SearchIcon, UserIcon } from './Icons';
import { colors, fonts } from '../theme';

interface Props {
  tabColors: { home: string; search: string; list: string; profilo: string };
  hasCartItems: boolean;
  cartCount: number;
  goHome: () => void;
  goSearch: () => void;
  goList: () => void;
  goProfilo: () => void;
}

export default function TabBar({ tabColors, hasCartItems, cartCount, goHome, goSearch, goList, goProfilo }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom + 10 }]}>
      <Pressable style={styles.item} onPress={goHome}>
        <HomeTabIcon color={tabColors.home} />
        <Text style={[styles.label, { color: tabColors.home }]}>Home</Text>
      </Pressable>
      <Pressable style={styles.item} onPress={goSearch}>
        <SearchIcon size={21} color={tabColors.search} strokeWidth={2} />
        <Text style={[styles.label, { color: tabColors.search }]}>Cerca</Text>
      </Pressable>
      <Pressable style={styles.item} onPress={goList}>
        <View>
          <CartIcon size={21} color={tabColors.list} strokeWidth={2} />
          {hasCartItems && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.label, { color: tabColors.list }]}>Lista</Text>
      </Pressable>
      <Pressable style={styles.item} onPress={goProfilo}>
        <UserIcon color={tabColors.profilo} />
        <Text style={[styles.label, { color: tabColors.profilo }]}>Profilo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexShrink: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10.5,
    fontFamily: fonts.bodySemibold,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -6,
    width: 15,
    height: 15,
    borderRadius: 999,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.headingBold,
  },
});
