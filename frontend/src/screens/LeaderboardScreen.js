import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { apiRequest } from '../services/api';
import { colors } from '../theme/colors';

export default function LeaderboardScreen() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    apiRequest('/leaderboard').then(setLeaders);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leaderboard</Text>
      <FlatList
        data={leaders}
        keyExtractor={(item) => `${item.rank}-${item.username}`}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>#{item.rank}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.username}</Text>
              <Text style={styles.meta}>{item.totalPredictions} predictions · {item.accuracyPercentage}% accuracy</Text>
            </View>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: { color: colors.textPrimary, fontSize: 28, fontWeight: '800', marginBottom: 14 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  rank: { color: colors.accent, width: 44, fontWeight: '800' },
  name: { color: colors.textPrimary, fontWeight: '700' },
  meta: { color: colors.textSecondary, fontSize: 12 },
  score: { color: colors.textPrimary, fontWeight: '900', fontSize: 18 }
});
