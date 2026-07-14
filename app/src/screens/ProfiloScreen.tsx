import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import GradientHeader from '../components/GradientHeader';
import Panel from '../components/Panel';
import { BellIcon, ChevronRightIcon, InfoIcon, StoreIcon, TagIcon } from '../components/Icons';
import { colors, fonts } from '../theme';

interface ProfileRow {
  label: string;
}

const ROW_ICONS = [BellIcon, TagIcon, StoreIcon, InfoIcon];

interface Props {
  locationLabel: string;
  profileRows: ProfileRow[];
}

export default function ProfiloScreen({ locationLabel, profileRows }: Props) {
  return (
    <View style={styles.container}>
      <GradientHeader paddingBottom={26}>
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>GC</Text>
          </View>
          <View>
            <Text style={styles.name}>Giulia Colombo</Text>
            <Text style={styles.locationLabel}>{locationLabel}</Text>
          </View>
        </View>
      </GradientHeader>
      <Panel overlap={8}>
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Risparmiati questo mese</Text>
              <Text style={[styles.statValue, { color: colors.green700 }]}>€18,40</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Confronti fatti</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>27</Text>
            </View>
          </View>

          <View style={styles.list}>
            {profileRows.map((row, i) => {
              const RowIcon = ROW_ICONS[i % ROW_ICONS.length];
              return (
                <View key={row.label} style={[styles.row, i < profileRows.length - 1 && styles.rowBorder]}>
                  <View style={styles.rowIcon}>
                    <RowIcon size={16} color={colors.green700} strokeWidth={1.7} />
                  </View>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <ChevronRightIcon size={8} color={colors.chevron} />
                </View>
              );
            })}
          </View>
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
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.heading,
    fontSize: 19,
    color: colors.white,
  },
  name: {
    fontFamily: fonts.heading,
    fontSize: 17,
    color: colors.white,
  },
  locationLabel: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    fontFamily: fonts.body,
  },
  body: {
    padding: 20,
    paddingBottom: 100,
    gap: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
  },
  statLabel: {
    fontSize: 11.5,
    color: colors.textMuted,
    fontFamily: fonts.bodySemibold,
  },
  statValue: {
    fontFamily: fonts.heading,
    fontSize: 20,
    marginTop: 6,
  },
  list: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3EF',
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: colors.greenTint,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontFamily: fonts.bodyMedium,
  },
});
