import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function EventCard({ event, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.category}>{event.category}</Text>
        <Text style={[styles.status, event.status === 'LIVE' ? styles.live : styles.resolved]}>{event.status}</Text>
      </View>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{event.description}</Text>
      <Text style={styles.question}>{event.predictionQuestion}</Text>
      <Text style={styles.meta}>{event.totalVotes} votes · Closes {new Date(event.closingTime).toLocaleString()}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  category: { color: colors.accent, fontWeight: '700' },
  status: { fontWeight: '700' },
  live: { color: colors.success },
  resolved: { color: colors.textSecondary },
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  description: { color: colors.textSecondary, marginBottom: 8 },
  question: { color: colors.textPrimary, fontWeight: '600', marginBottom: 8 },
  meta: { color: colors.textSecondary, fontSize: 12 }
});
