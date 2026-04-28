import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function EventCard({ event, onPress }) {
  const isLive = event.status === 'LIVE';

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>
        <View style={[styles.statusBadge, isLive ? styles.liveBadge : styles.resolvedBadge]}>
          <Text style={[styles.statusText, isLive ? styles.liveText : styles.resolvedText]}>{event.status}</Text>
        </View>
      </View>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{event.description}</Text>
      <Text style={styles.question} numberOfLines={2}>{event.predictionQuestion}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{event.totalVotes} votes</Text>
        <Text style={styles.meta}>YES {event.yesPercentage}% · NO {event.noPercentage}%</Text>
      </View>
      <Text style={styles.meta}>Closes {new Date(event.closingTime).toLocaleString()}</Text>
      {event.userVote ? <Text style={styles.userVote}>Your vote: {event.userVote}</Text> : null}
      {event.outcome ? <Text style={styles.outcome}>Outcome: {event.outcome}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
  categoryBadge: { backgroundColor: '#1A3870', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  categoryText: { color: colors.textPrimary, fontWeight: '700', fontSize: 12 },
  statusBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  liveBadge: { backgroundColor: 'rgba(34, 197, 94, 0.15)' },
  resolvedBadge: { backgroundColor: 'rgba(156, 168, 199, 0.2)' },
  statusText: { fontWeight: '800', fontSize: 11, letterSpacing: 0.4 },
  liveText: { color: colors.success },
  resolvedText: { color: colors.textSecondary },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: '800', marginBottom: 8 },
  description: { color: colors.textSecondary, marginBottom: 8, lineHeight: 20 },
  question: { color: colors.textPrimary, fontWeight: '700', marginBottom: 10, lineHeight: 20 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  meta: { color: colors.textSecondary, fontSize: 12, flexShrink: 1, marginTop: 4 },
  userVote: { color: colors.accent, fontWeight: '700', marginTop: 6 },
  outcome: { color: colors.success, fontWeight: '700', marginTop: 4 }
});
