import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { apiRequest } from '../services/api';
import { colors } from '../theme/colors';

export default function LeaderboardScreen() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLeaders = useCallback(async () => {
    try {
      setError('');
      const data = await apiRequest('/leaderboard');
      setLeaders(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load leaderboard');
      setLeaders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaders();
  }, [loadLeaders]);

  return (
    <ScreenLayout title="Leaderboard" subtitle="Top predictors this cycle">
      {loading ? (
        <View style={styles.stateWrap}><ActivityIndicator color={colors.accent} /></View>
      ) : (
        <FlatList
          data={leaders}
          keyExtractor={(item) => `${item.rank}-${item.userId}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            error ? (
              <View style={styles.fallbackCard}>
                <Text style={styles.fallbackTitle}>Leaderboard unavailable right now</Text>
                <Text style={styles.fallbackBody}>{error}</Text>
                <TouchableOpacity style={styles.retry} onPress={loadLeaders}><Text style={styles.retryText}>Retry</Text></TouchableOpacity>
              </View>
            ) : null
          }
          ListEmptyComponent={<Text style={styles.empty}>{error ? 'No leaderboard data available yet.' : 'No leaderboard data yet.'}</Text>}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rankBadge}><Text style={styles.rank}>#{item.rank}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.email || item.username || 'Unknown user'}</Text>
                <Text style={styles.meta}>{item.totalPredictions} predictions</Text>
              </View>
              <View style={styles.metrics}>
                <Text style={styles.score}>{item.score} pts</Text>
                <Text style={styles.acc}>{item.accuracyPercentage}% accuracy</Text>
              </View>
            </View>
          )}
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: 24 },
  stateWrap: { paddingTop: 16 },
  fallbackCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12
  },
  fallbackTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '800', marginBottom: 4 },
  fallbackBody: { color: colors.textSecondary, marginBottom: 10 },
  empty: { color: colors.textSecondary },
  retry: { backgroundColor: colors.cardSoft, borderColor: colors.border, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, alignSelf: 'flex-start' },
  retryText: { color: colors.textPrimary, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border, gap: 12 },
  rankBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1A3870', alignItems: 'center', justifyContent: 'center' },
  rank: { color: colors.textPrimary, fontWeight: '900' },
  name: { color: colors.textPrimary, fontWeight: '800', fontSize: 16 },
  meta: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  metrics: { alignItems: 'flex-end' },
  score: { color: colors.textPrimary, fontWeight: '900', fontSize: 17 },
  acc: { color: colors.accent, fontSize: 12, marginTop: 2 }
});
