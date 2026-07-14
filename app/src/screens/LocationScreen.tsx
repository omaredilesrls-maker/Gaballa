import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PinIcon } from '../components/Icons';
import { colors, fonts, gradient } from '../theme';

interface Props {
  capInput: string;
  setCapInput: (v: string) => void;
  onUseGps: () => void;
  onConfirmLocation: () => void;
  locating: boolean;
  locationError: string | null;
}

export default function LocationScreen({
  capInput,
  setCapInput,
  onUseGps,
  onConfirmLocation,
  locating,
  locationError,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient colors={gradient.header} start={{ x: 0.2, y: 0 }} end={{ x: 0.75, y: 1 }} style={styles.container}>
      <View style={{ height: insets.top + 40 }} />
      <View style={styles.hero}>
        <View style={styles.iconTile}>
          <PinIcon size={30} color="#fff" strokeWidth={1.8} filledDot={false} />
        </View>
        <View>
          <Text style={styles.title}>MigliorSpesa</Text>
          <Text style={styles.subtitle}>
            Confronta i prezzi dei supermercati vicino a te e trova sempre l'offerta migliore.
          </Text>
        </View>
      </View>
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.sheetTitle}>Dove fai la spesa?</Text>
        <Pressable
          style={[styles.gpsButton, locating && styles.buttonDisabled]}
          onPress={onUseGps}
          disabled={locating}
        >
          <PinIcon size={18} color="#fff" strokeWidth={2} filledDot />
          <Text style={styles.gpsButtonText}>
            {locating ? 'Ricerca in corso…' : 'Usa la mia posizione'}
          </Text>
        </Pressable>
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>oppure</Text>
          <View style={styles.dividerLine} />
        </View>
        <TextInput
          value={capInput}
          onChangeText={setCapInput}
          placeholder="Inserisci CAP o città"
          placeholderTextColor={colors.textFaint}
          style={styles.input}
        />
        <Pressable
          style={[styles.confirmButton, locating && styles.buttonDisabled]}
          onPress={onConfirmLocation}
          disabled={locating}
        >
          <Text style={styles.confirmButtonText}>Conferma</Text>
        </Pressable>
        {locationError && <Text style={styles.errorText}>{locationError}</Text>}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 18,
  },
  iconTile: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 28,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 8,
    lineHeight: 22,
    textAlign: 'center',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 26,
    paddingHorizontal: 22,
    gap: 14,
  },
  sheetTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 17,
    color: colors.text,
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.green500,
  },
  gpsButtonText: {
    color: colors.white,
    fontFamily: fonts.headingBold,
    fontSize: 15,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  dividerText: {
    color: colors.textPlaceholder,
    fontSize: 12,
    fontFamily: fonts.body,
  },
  input: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.text,
  },
  confirmButton: {
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.green700,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: colors.green700,
    fontFamily: fonts.headingBold,
    fontSize: 15,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  errorText: {
    color: colors.red,
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
    textAlign: 'center',
  },
});
