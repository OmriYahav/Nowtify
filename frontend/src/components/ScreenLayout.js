import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function ScreenLayout({ title, subtitle, children }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={styles.headerWrap}>
          <Text style={styles.brand}>Nowtify</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.content}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 16 },
  headerWrap: { paddingTop: 8, paddingBottom: 14 },
  brand: {
    color: colors.accent,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontSize: 12,
    marginBottom: 6
  },
  title: { color: colors.textPrimary, fontSize: 30, fontWeight: '900' },
  subtitle: { color: colors.textSecondary, marginTop: 4, fontSize: 14 },
  content: { flex: 1 }
});
