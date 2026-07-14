import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts as usePlusJakartaSans } from '@expo-google-fonts/plus-jakarta-sans/useFonts';
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans/800ExtraBold';
import { useFonts as useInter } from '@expo-google-fonts/inter/useFonts';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';

import { useAppState } from './src/state/useAppState';
import LocationScreen from './src/screens/LocationScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import DetailScreen from './src/screens/DetailScreen';
import ListScreen from './src/screens/ListScreen';
import ProfiloScreen from './src/screens/ProfiloScreen';
import TabBar from './src/components/TabBar';
import { colors } from './src/theme';

export default function App() {
  const [jakartaLoaded] = usePlusJakartaSans({
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  const [interLoaded] = useInter({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const state = useAppState();

  if (!jakartaLoaded || !interLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {state.isLocation && (
          <LocationScreen
            capInput={state.capInput}
            setCapInput={state.setCapInput}
            onUseGps={state.onUseGps}
            onConfirmLocation={state.onConfirmLocation}
          />
        )}
        {state.isHome && (
          <HomeScreen
            locationLabel={state.locationLabel}
            goLocation={state.goLocation}
            goSearch={state.goSearch}
            goList={state.goList}
            categories={state.categories}
            selectCategory={state.selectCategory}
            homeDeals={state.homeDeals}
            openProduct={state.openProduct}
            hasCartItems={state.hasCartItems}
            cartCount={state.cartCount}
            cartTotalSavingsLabel={state.cartTotalSavingsLabel}
            cartBestStoreName={state.cartBestStoreName}
          />
        )}
        {state.isSearch && (
          <SearchScreen
            goHome={state.goHome}
            searchQuery={state.searchQuery}
            setSearchQuery={state.setSearchQuery}
            categories={state.categories}
            selectCategory={state.selectCategory}
            resultsCountLabel={state.resultsCountLabel}
            filteredProducts={state.filteredProducts}
            openProduct={state.openProduct}
          />
        )}
        {state.isDetail && state.selectedProduct && (
          <DetailScreen
            goBack={state.goBack}
            selectedProduct={state.selectedProduct}
            storeRows={state.storeRows}
            detailQty={state.detailQty}
            onQtyPlus={state.onQtyPlus}
            onQtyMinus={state.onQtyMinus}
            onAddToList={state.onAddToList}
            addButtonLabel={state.addButtonLabel}
          />
        )}
        {state.isList && (
          <ListScreen
            cartCount={state.cartCount}
            hasCartItems={state.hasCartItems}
            isCartEmpty={state.isCartEmpty}
            cartBestStoreName={state.cartBestStoreName}
            cartBestTotalLabel={state.cartBestTotalLabel}
            cartTotalSavingsLabel={state.cartTotalSavingsLabel}
            cartTotals={state.cartTotals}
            cartItems={state.cartItems}
            itemQtyPlus={state.itemQtyPlus}
            itemQtyMinus={state.itemQtyMinus}
            itemRemove={state.itemRemove}
            goSearch={state.goSearch}
          />
        )}
        {state.isProfilo && <ProfiloScreen locationLabel={state.locationLabel} profileRows={state.profileRows} />}

        {state.showTabBar && (
          <TabBar
            tabColors={state.tabColors}
            hasCartItems={state.hasCartItems}
            cartCount={state.cartCount}
            goHome={state.goHome}
            goSearch={state.goSearch}
            goList={state.goList}
            goProfilo={state.goProfilo}
          />
        )}
        <StatusBar style="light" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
