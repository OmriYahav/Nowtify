import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest(`/users/${user.id}/profile`);
        setProfile(data);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [user.id]);

  if (!profile && !error) {
    return (
      <ScreenLayout title="Profile" subtitle="Your prediction performance">
        <ActivityIndicator color={colors.accent} />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Profile" subtitle="Your prediction performance">
      <View style={styles.userCard}>
        <Text style={styles.username}>{user.email}</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {profile ? (
        <View style={styles.statsGrid}>
          <View style={styles.statCard}><Text style={styles.statLabel}>Score</Text><Text style={styles.statValue}>{profile.score}</Text></View>
          <View style={styles.statCard}><Text style={styles.statLabel}>Total Predictions</Text><Text style={styles.statValue}>{profile.totalPredictions}</Text></View>
          <View style={styles.statCard}><Text style={styles.statLabel}>Correct</Text><Text style={styles.statValue}>{profile.correct}</Text></View>
          <View style={styles.statCard}><Text style={styles.statLabel}>Wrong</Text><Text style={styles.statValue}>{profile.wrong}</Text></View>
          <View style={styles.statCard}><Text style={styles.statLabel}>Accuracy</Text><Text style={styles.statValue}>{profile.accuracy}%</Text></View>
        </View>
      ) : null}

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  userCard: { backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 12 },
  username: { color: colors.textPrimary, fontSize: 20, fontWeight: '800' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12
  },
  statLabel: { color: colors.textSecondary, fontSize: 12 },
  statValue: { color: colors.textPrimary, fontSize: 19, fontWeight: '800', marginTop: 6 },
  error: { color: colors.danger, marginBottom: 10 },
  logoutBtn: { backgroundColor: colors.cardSoft, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, alignItems: 'center' },
  logoutText: { color: colors.textPrimary, fontWeight: '700' }
});
