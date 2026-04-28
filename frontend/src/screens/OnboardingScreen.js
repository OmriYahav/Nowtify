import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function OnboardingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.logo}>Nowtify</Text>
        <Text style={styles.subtitle}>Real-time prediction feed and leaderboard</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondary]} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 24 },
  logo: { color: colors.textPrimary, fontSize: 42, fontWeight: '900', marginBottom: 8 },
  subtitle: { color: colors.textSecondary, fontSize: 16, marginBottom: 24 },
  button: { backgroundColor: colors.accent, padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  secondary: { backgroundColor: colors.cardSoft, borderWidth: 1, borderColor: colors.border },
  buttonText: { color: colors.textPrimary, fontWeight: '700', fontSize: 16 }
});
