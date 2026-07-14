import { useEffect, useMemo, useState } from 'react';
import * as Location from 'expo-location';
import {
  Catalog,
  DEMO_CATALOG,
  enrichProduct,
  eur,
  storesSortedFor,
  withDistances,
} from '../data';
import { fetchCatalog } from '../lib/catalog';
import { GeoPosition, geocodePlace, reverseLabel } from '../lib/geocode';
import { nearbyChainDistancesKm } from '../lib/nearby';
import { colors } from '../theme';

export type Screen = 'location' | 'home' | 'search' | 'detail' | 'list' | 'profilo';

const DEFAULT_LOCATION = 'Milano, Zona Navigli';

export function useAppState() {
  const [screen, setScreen] = useState<Screen>('location');
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<GeoPosition | null>(null);
  // Distanza dal negozio reale più vicino di ogni catena (OpenStreetMap),
  // calcolata quando l'utente sceglie una posizione.
  const [nearbyKm, setNearbyKm] = useState<Record<string, number> | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [capInput, setCapInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [detailQty, setDetailQty] = useState(1);
  const [cart, setCart] = useState<Record<string, number>>({});

  // Parte coi dati demo locali; se il progetto Supabase è configurato e ha
  // prezzi, il catalogo vero li sostituisce appena arriva.
  const [catalog, setCatalog] = useState<Catalog>(DEMO_CATALOG);
  const [dataSource, setDataSource] = useState<'demo' | 'supabase'>('demo');

  useEffect(() => {
    let active = true;
    fetchCatalog()
      .then(remote => {
        if (active && remote) {
          setCatalog(remote);
          setDataSource('supabase');
        }
      })
      .catch(err => {
        console.warn('Catalogo Supabase non disponibile, resto sui dati demo:', err);
      });
    return () => {
      active = false;
    };
  }, []);

  // Chiave stabile: demo e Supabase hanno le stesse catene, così il cambio
  // di catalogo non fa ripartire la ricerca (Overpass rifiuta le richieste
  // ravvicinate dallo stesso IP).
  const chainNamesKey = catalog.stores
    .map(s => s.name)
    .sort()
    .join('|');

  useEffect(() => {
    if (!userPos) {
      setNearbyKm(null);
      return;
    }
    let active = true;
    nearbyChainDistancesKm(userPos, chainNamesKey.split('|'))
      .then(d => {
        if (active) setNearbyKm(d);
      })
      .catch(err => {
        console.warn('Negozi vicini (OpenStreetMap) non disponibili:', err);
      });
    return () => {
      active = false;
    };
  }, [userPos, chainNamesKey]);

  const goHome = () => setScreen('home');
  const goSearch = () => setScreen('search');
  const goList = () => setScreen('list');
  const goProfilo = () => setScreen('profilo');
  const goLocation = () => setScreen('location');
  const goBack = () => setScreen('home');

  const onUseGps = async () => {
    if (locating) return;
    setLocating(true);
    setLocationError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permesso negato: consenti la posizione o inserisci il CAP.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const pos = { lat: loc.coords.latitude, lon: loc.coords.longitude };
      setUserPos(pos);
      setLocationLabel(await reverseLabel(pos).catch(() => null) || 'La tua posizione');
      setScreen('home');
    } catch {
      setLocationError('Posizione non disponibile: riprova o inserisci il CAP.');
    } finally {
      setLocating(false);
    }
  };

  const onConfirmLocation = async () => {
    if (locating) return;
    const query = capInput.trim();
    if (!query) {
      setLocationError('Inserisci un CAP o una città.');
      return;
    }
    setLocating(true);
    setLocationError(null);
    try {
      const found = await geocodePlace(query);
      if (!found) {
        setLocationError('Località non trovata: controlla il CAP o il nome.');
        return;
      }
      setUserPos(found.pos);
      setLocationLabel(found.label);
      setScreen('home');
    } catch {
      setLocationError('Ricerca non riuscita: controlla la connessione e riprova.');
    } finally {
      setLocating(false);
    }
  };

  const selectCategory = (label: string) => {
    setSearchQuery(label);
    setScreen('search');
  };

  const openProduct = (id: string) => {
    setSelectedProductId(id);
    setDetailQty(1);
    setScreen('detail');
  };
  const onQtyPlus = () => setDetailQty(q => q + 1);
  const onQtyMinus = () => setDetailQty(q => Math.max(1, q - 1));
  const onAddToList = () => {
    if (!selectedProductId) return;
    const id = selectedProductId;
    const qty = detailQty;
    setCart(c => ({ ...c, [id]: (c[id] || 0) + qty }));
    setScreen('list');
  };

  const itemQtyPlus = (id: string) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const itemQtyMinus = (id: string) =>
    setCart(c => ({ ...c, [id]: Math.max(1, (c[id] || 1) - 1) }));
  const itemRemove = (id: string) =>
    setCart(c => {
      const next = { ...c };
      delete next[id];
      return next;
    });

  const derived = useMemo(() => {
    const { products } = catalog;
    // Distanze: prima i negozi reali vicini (OpenStreetMap), altrimenti i
    // negozi noti a catalogo rispetto alla posizione scelta.
    const stores = withDistances(catalog.stores, userPos).map(s => {
      const km = nearbyKm?.[s.name.toLowerCase()];
      return km != null ? { ...s, distanceKm: km } : s;
    });
    const resolvedLocationLabel = locationLabel || DEFAULT_LOCATION;

    const categories = catalog.categories.map(cat => ({
      label: cat.label,
      bg: cat.bg,
      color: cat.color,
      border: cat.bg,
    }));

    const q = searchQuery.trim().toLowerCase();
    const filteredProducts = products
      .filter(p => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .map(p => enrichProduct(p, catalog));

    const homeDeals = products
      .map(p => enrichProduct(p, catalog))
      .sort((a, b) => b.savingsPct - a.savingsPct)
      .slice(0, 4);

    // Il filtro sull'esistenza del prodotto protegge il carrello se il
    // catalogo cambia (demo -> Supabase) dopo che un articolo è stato aggiunto.
    const cartEntries = Object.entries(cart).filter(
      ([id, qty]) => qty > 0 && products.some(p => p.id === id)
    );
    const hasCartItems = cartEntries.length > 0;

    const cartItems = cartEntries.map(([id, qty]) => {
      const product = products.find(p => p.id === id)!;
      const enriched = enrichProduct(product, catalog);
      return {
        ...enriched,
        qty,
        unitPriceLabel: enriched.minPriceLabel + ' · ' + product.unit,
        bestStoreName: enriched.minStoreName,
      };
    });

    const storeTotalsRaw = stores
      .map(store => {
        const total = cartEntries.reduce((sum, [id, qty]) => {
          const product = products.find(p => p.id === id)!;
          return sum + (product.prices[store.id] ?? 0) * qty;
        }, 0);
        return { store, total };
      })
      .sort((a, b) => a.total - b.total);

    const maxTotal = storeTotalsRaw.length ? storeTotalsRaw[storeTotalsRaw.length - 1].total : 0;
    const minTotal = storeTotalsRaw.length ? storeTotalsRaw[0].total : 0;
    const cartTotals = storeTotalsRaw.map((t, i) => ({
      storeName: t.store.name,
      totalLabel: eur(t.total),
      barPct: maxTotal > 0 ? Math.max(6, Math.round((t.total / maxTotal) * 100)) : 6,
      barColor: i === 0 ? colors.green500 : 'rgba(255,255,255,0.35)',
    }));

    const cartBestStoreName = storeTotalsRaw.length ? storeTotalsRaw[0].store.name : '';
    const cartBestTotalLabel = eur(minTotal);
    const cartTotalSavingsLabel = eur(maxTotal - minTotal);
    const cartCount = cartEntries.reduce((sum, [, qty]) => sum + qty, 0);

    let selectedProduct = null as ReturnType<typeof enrichProduct> | null;
    let storeRows: {
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
    }[] = [];
    let addButtonLabel = 'Aggiungi alla lista';

    const selected = selectedProductId ? products.find(p => p.id === selectedProductId) : null;
    if (selected) {
      selectedProduct = enrichProduct(selected, catalog);
      const sorted = storesSortedFor(selected, stores);
      const min = sorted[0].price;
      storeRows = sorted.map((row, i) => ({
        storeName: row.store.name,
        storeInitials: row.store.initials,
        storeColor: row.store.color,
        distanceLabel: row.store.distanceKm.toFixed(1).replace('.', ',') + ' km',
        isBest: i === 0,
        priceLabel: eur(row.price),
        priceColor: i === 0 ? colors.green500 : colors.text,
        borderColor: i === 0 ? colors.green500 : colors.border,
        showDelta: i > 0,
        deltaLabel: eur(row.price - min),
      }));
      addButtonLabel = 'Aggiungi alla lista · ' + eur(min * detailQty);
    }

    const profileRows = [
      { label: 'Notifiche offerte' },
      { label: 'Metodo di risparmio preferito' },
      { label: 'Supermercati preferiti' },
      { label: 'Informazioni' },
      { label: dataSource === 'supabase' ? 'Dati prezzi: Supabase (live)' : 'Dati prezzi: demo locale' },
    ];

    const isHome = screen === 'home';
    const isSearch = screen === 'search';
    const isList = screen === 'list';
    const isProfilo = screen === 'profilo';
    const isDetail = screen === 'detail';
    const isLocation = screen === 'location';

    const activeTab = isHome ? 'home' : isSearch ? 'search' : isList ? 'list' : isProfilo ? 'profilo' : '';
    const tabColors = {
      home: activeTab === 'home' ? colors.green700 : colors.tabInactive,
      search: activeTab === 'search' ? colors.green700 : colors.tabInactive,
      list: activeTab === 'list' ? colors.green700 : colors.tabInactive,
      profilo: activeTab === 'profilo' ? colors.green700 : colors.tabInactive,
    };

    return {
      isLocation,
      isHome,
      isSearch,
      isDetail,
      isList,
      isProfilo,
      showTabBar: !isLocation && !isDetail,
      locationLabel: resolvedLocationLabel,
      resultsCountLabel:
        filteredProducts.length + (filteredProducts.length === 1 ? ' risultato' : ' risultati'),
      categories,
      filteredProducts,
      homeDeals,
      hasCartItems,
      isCartEmpty: !hasCartItems,
      cartItems,
      cartTotals,
      cartCount,
      cartBestStoreName,
      cartBestTotalLabel,
      cartTotalSavingsLabel,
      selectedProduct,
      storeRows,
      addButtonLabel,
      profileRows,
      tabColors,
    };
  }, [screen, locationLabel, userPos, nearbyKm, searchQuery, selectedProductId, detailQty, cart, catalog, dataSource]);

  return {
    screen,
    capInput,
    searchQuery,
    detailQty,
    dataSource,
    locating,
    locationError,
    setCapInput,
    setSearchQuery,
    goHome,
    goSearch,
    goList,
    goProfilo,
    goLocation,
    goBack,
    onUseGps,
    onConfirmLocation,
    selectCategory,
    openProduct,
    onQtyPlus,
    onQtyMinus,
    onAddToList,
    itemQtyPlus,
    itemQtyMinus,
    itemRemove,
    ...derived,
  };
}

export type AppState = ReturnType<typeof useAppState>;
