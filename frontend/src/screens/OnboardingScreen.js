import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function OnboardingScreen() {
  const [username, setUsername] = useState('');
  const { onboard } = useAuth();

  const submit = async () => {
    if (!username.trim()) {
      Alert.alert('Username required', 'Please choose a username.');
      return;
    }
    try {
      await onboard(username);
    } catch (e) {
      Alert.alert('Could not continue', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Nowtify</Text>
      <Text style={styles.subtitle}>Real-time news predictions</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholder="Enter username"
        placeholderTextColor={colors.textSecondary}
      />
      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Enter as Guest</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 24 },
  logo: { color: colors.textPrimary, fontSize: 42, fontWeight: '900', marginBottom: 8 },
  subtitle: { color: colors.textSecondary, fontSize: 16, marginBottom: 24 },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    color: colors.textPrimary,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16
  },
  button: { backgroundColor: colors.accent, padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: colors.textPrimary, fontWeight: '700', fontSize: 16 }
});
