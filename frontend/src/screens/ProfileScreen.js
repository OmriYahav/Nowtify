import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    apiRequest(`/users/${user.id}/profile`).then(setProfile);
  }, [user.id]);

  if (!profile) {
    return (
      <ScreenLayout title="Profile" subtitle="Your prediction performance">
        <ActivityIndicator color={colors.accent} />
      </ScreenLayout>
    );
  }

  const statCards = [
    { label: 'Score', value: profile.user.score },
    { label: 'Total Predictions', value: profile.user.totalPredictions },
    { label: 'Correct', value: profile.user.correctPredictions },
    { label: 'Wrong', value: profile.user.wrongPredictions },
    { label: 'Accuracy', value: `${profile.user.accuracyPercentage}%` }
  ];

  return (
    <ScreenLayout title="Profile" subtitle="Your prediction performance">
      <View style={styles.userCard}>
        <Text style={styles.username}>@{profile.user.username}</Text>
      </View>

      <View style={styles.statsGrid}>
        {statCards.map((item) => (
          <View key={item.label} style={styles.statCard}>
            <Text style={styles.statLabel}>{item.label}</Text>
            <Text style={styles.statValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.subheader}>Your votes</Text>
      {profile.votes.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>You have not voted yet.</Text>
        </View>
      ) : (
        <FlatList
          data={profile.votes}
          keyExtractor={(item) => String(item.voteId)}
          contentContainerStyle={styles.voteList}
          renderItem={({ item }) => (
            <View style={styles.voteCard}>
              <Text style={styles.voteTitle}>{item.eventTitle}</Text>
              <Text style={styles.voteMeta}>Your vote: {item.voteOption} · Status: {item.eventStatus}</Text>
              {item.outcome ? (
                <Text style={styles.voteMeta}>Outcome: {item.outcome} · {item.wasCorrect ? 'Correct' : 'Wrong'}</Text>
              ) : null}
            </View>
          )}
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  userCard: { backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 12 },
  username: { color: colors.textPrimary, fontSize: 24, fontWeight: '900' },
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
  subheader: { color: colors.textPrimary, fontSize: 18, fontWeight: '800', marginBottom: 10 },
  emptyWrap: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16 },
  emptyTitle: { color: colors.textSecondary },
  voteList: { paddingBottom: 24 },
  voteCard: { backgroundColor: colors.cardSoft, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  voteTitle: { color: colors.textPrimary, fontWeight: '700' },
  voteMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 4 }
});
