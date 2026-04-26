import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    apiRequest(`/users/${user.id}/profile`).then(setProfile);
  }, []);

  if (!profile) return <View style={styles.container}><Text style={styles.label}>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>@{profile.user.username}</Text>
      <View style={styles.stats}>
        <Text style={styles.label}>Score: {profile.user.score}</Text>
        <Text style={styles.label}>Total predictions: {profile.user.totalPredictions}</Text>
        <Text style={styles.label}>Correct: {profile.user.correctPredictions}</Text>
        <Text style={styles.label}>Wrong: {profile.user.wrongPredictions}</Text>
        <Text style={styles.label}>Accuracy: {profile.user.accuracyPercentage}%</Text>
      </View>
      <Text style={styles.subheader}>Your votes</Text>
      <FlatList
        data={profile.votes}
        keyExtractor={(item) => String(item.voteId)}
        renderItem={({ item }) => (
          <View style={styles.voteCard}>
            <Text style={styles.voteTitle}>{item.eventTitle}</Text>
            <Text style={styles.voteMeta}>Voted: {item.voteOption} · Status: {item.eventStatus}</Text>
            {item.outcome && <Text style={styles.voteMeta}>Outcome: {item.outcome} · {item.wasCorrect ? 'Correct' : 'Wrong'}</Text>}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: { color: colors.textPrimary, fontSize: 26, fontWeight: '800', marginBottom: 12 },
  stats: { backgroundColor: colors.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 14 },
  label: { color: colors.textPrimary, marginBottom: 4 },
  subheader: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 10 },
  voteCard: { backgroundColor: colors.cardSoft, borderRadius: 12, padding: 12, marginBottom: 8 },
  voteTitle: { color: colors.textPrimary, fontWeight: '700' },
  voteMeta: { color: colors.textSecondary, fontSize: 12 }
});
