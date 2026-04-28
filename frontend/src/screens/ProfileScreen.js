import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      setError('No active user found. Please sign in to see your profile.');
      return;
    }

    try {
      setError('');
      const data = await apiRequest(`/users/${user.id}/profile`);
      setProfile(data);
    } catch (e) {
      setError(e.message || 'Unable to load profile');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <ScreenLayout title="Profile" subtitle="Your prediction performance">
      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : error && !profile ? (
        <View>
          <Text style={styles.error}>{error}</Text>
          {!!user?.id && <TouchableOpacity style={styles.retryBtn} onPress={loadProfile}><Text style={styles.logoutText}>Retry</Text></TouchableOpacity>}
        </View>
      ) : (
        <FlatList
          data={profile?.votes || []}
          keyExtractor={(item) => String(item.voteId)}
          ListHeaderComponent={
            <>
              <View style={styles.userCard}>
                <Text style={styles.username}>{profile?.username || profile?.email || user?.email || 'Nowtify User'}</Text>
                <Text style={styles.userSub}>User ID: {profile?.userId || user?.id}</Text>
              </View>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}><Text style={styles.statLabel}>Score</Text><Text style={styles.statValue}>{profile?.score ?? 0}</Text></View>
                <View style={styles.statCard}><Text style={styles.statLabel}>Total</Text><Text style={styles.statValue}>{profile?.totalPredictions ?? 0}</Text></View>
                <View style={styles.statCard}><Text style={styles.statLabel}>Correct</Text><Text style={styles.statValue}>{profile?.correctPredictions ?? 0}</Text></View>
                <View style={styles.statCard}><Text style={styles.statLabel}>Wrong</Text><Text style={styles.statValue}>{profile?.wrongPredictions ?? 0}</Text></View>
                <View style={styles.statCard}><Text style={styles.statLabel}>Accuracy</Text><Text style={styles.statValue}>{profile?.accuracyPercentage ?? 0}%</Text></View>
              </View>
              <Text style={styles.section}>Vote History</Text>
            </>
          }
          ListEmptyComponent={<Text style={styles.empty}>No votes yet.</Text>}
          renderItem={({ item }) => (
            <View style={styles.voteCard}>
              <Text style={styles.voteTitle}>{item.eventTitle}</Text>
              <Text style={styles.voteMeta}>Vote: {item.voteOption} · Status: {item.eventStatus}</Text>
              {item.outcome ? <Text style={styles.voteMeta}>Outcome: {item.outcome}</Text> : null}
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  userCard: { backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 12 },
  username: { color: colors.textPrimary, fontSize: 20, fontWeight: '800' },
  userSub: { color: colors.textSecondary, marginTop: 4, fontSize: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: { width: '48%', backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 12 },
  statLabel: { color: colors.textSecondary, fontSize: 12 },
  statValue: { color: colors.textPrimary, fontSize: 19, fontWeight: '800', marginTop: 6 },
  section: { color: colors.textPrimary, fontWeight: '800', marginBottom: 10, fontSize: 16 },
  voteCard: { backgroundColor: colors.cardSoft, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, marginBottom: 10 },
  voteTitle: { color: colors.textPrimary, fontWeight: '700' },
  voteMeta: { color: colors.textSecondary, marginTop: 4 },
  empty: { color: colors.textSecondary, marginBottom: 12 },
  error: { color: colors.danger, marginBottom: 10 },
  retryBtn: { backgroundColor: colors.cardSoft, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, alignItems: 'center', marginBottom: 12 },
  logoutBtn: { backgroundColor: colors.cardSoft, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, alignItems: 'center', marginTop: 8 },
  logoutText: { color: colors.textPrimary, fontWeight: '700' }
});
