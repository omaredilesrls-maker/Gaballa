export const colors = {
  bg: '#F6F8F4',
  text: '#12241C',
  textMuted: '#6B7A72',
  textFaint: '#9AA39D',
  textPlaceholder: '#B8C0BB',
  border: 'rgba(11,77,48,0.08)',
  borderInput: '#E4E9E2',
  divider: '#EEF1EC',
  green700: '#146C43',
  green800: '#0B4D30',
  green500: '#1E9E5C',
  greenTint: '#EAF7EF',
  greenTintText: '#8FE3B8',
  orange: '#FF7A45',
  orangeTint: '#FFF1EA',
  amber: '#C77F1A',
  red: '#C4453B',
  tabInactive: '#B7C0BA',
  chevron: '#C7CFC9',
  white: '#fff',
};

export const gradient = {
  header: ['#146C43', '#0B4D30'] as const,
  angle: 160,
};

export const fonts = {
  heading: 'PlusJakartaSans_800ExtraBold',
  headingBold: 'PlusJakartaSans_700Bold',
  headingSemibold: 'PlusJakartaSans_600SemiBold',
  headingMedium: 'PlusJakartaSans_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
};

export const catColors: Record<string, { bg: string; color: string }> = {
  'Dispensa': { bg: '#FDF1E0', color: '#C77F1A' },
  'Latticini e Uova': { bg: '#EAF3FF', color: '#2563AA' },
  'Panetteria': { bg: '#FBEFE6', color: '#B25E2A' },
  'Bevande': { bg: '#E7F5F0', color: '#0E8A6C' },
  'Frutta e Verdura': { bg: '#EFF7E6', color: '#5A8F1F' },
  'Carne e Pesce': { bg: '#FCEAEA', color: '#C23B3B' },
  'Cura Casa': { bg: '#EFEAFB', color: '#6B4FBF' },
};
