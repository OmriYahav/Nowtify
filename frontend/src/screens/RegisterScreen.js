import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Email and password are required.');
      return;
    }

    try {
      setSubmitting(true);
      await register(email, password);
    } catch (e) {
      Alert.alert('Registration failed', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.logo}>Nowtify</Text>
        <Text style={styles.subtitle}>Create your account</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholder="Password (min 6 chars)"
          secureTextEntry
          placeholderTextColor={colors.textSecondary}
        />

        <TouchableOpacity disabled={submitting} style={[styles.button, submitting && styles.buttonDisabled]} onPress={submit}>
          <Text style={styles.buttonText}>{submitting ? 'Creating account...' : 'Register'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Already have an account? Login</Text>
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
  input: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    color: colors.textPrimary,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12
  },
  button: { backgroundColor: colors.accent, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.textPrimary, fontWeight: '700', fontSize: 16 },
  link: { color: colors.textSecondary, textAlign: 'center', marginTop: 14 }
});
