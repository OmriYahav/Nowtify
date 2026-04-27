import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { apiRequest } from '../services/api';
import { colors } from '../theme/colors';

export default function LeaderboardScreen() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/leaderboard')
      .then(setLeaders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScreenLayout title="Leaderboard" subtitle="Top predictors this cycle">
      {loading ? (
        <View style={styles.stateWrap}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={leaders}
          keyExtractor={(item) => `${item.rank}-${item.username}`}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.empty}>No leaderboard data yet.</Text>}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rankBadge}><Text style={styles.rank}>#{item.rank}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.username}</Text>
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
  empty: { color: colors.textSecondary },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12
  },
  rankBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A3870',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rank: { color: colors.textPrimary, fontWeight: '900' },
  name: { color: colors.textPrimary, fontWeight: '800', fontSize: 16 },
  meta: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  metrics: { alignItems: 'flex-end' },
  score: { color: colors.textPrimary, fontWeight: '900', fontSize: 17 },
  acc: { color: colors.accent, fontSize: 12, marginTop: 2 }
});
