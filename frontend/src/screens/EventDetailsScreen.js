import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { colors } from '../theme/colors';

export default function EventDetailsScreen({ route }) {
  const { eventId } = route.params;
  const { user } = useAuth();
  const [event, setEvent] = useState(null);

  const load = async () => {
    const data = await apiRequest(`/events/${eventId}?userId=${user.id}`);
    setEvent(data);
  };

  useEffect(() => { load(); }, []);

  const vote = async (voteOption) => {
    try {
      const updated = await apiRequest(`/events/${eventId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, voteOption })
      });
      setEvent(updated);
    } catch (e) {
      Alert.alert('Vote failed', e.message);
    }
  };

  if (!event) return <View style={styles.container}><Text style={styles.text}>Loading...</Text></View>;

  const votingDisabled = !!event.userVote || event.status === 'RESOLVED';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <Text style={styles.meta}>{event.category} · {event.status}</Text>
      <Text style={styles.question}>{event.predictionQuestion}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity disabled={votingDisabled} style={[styles.voteButton, styles.yes]} onPress={() => vote('YES')}><Text style={styles.voteText}>YES</Text></TouchableOpacity>
        <TouchableOpacity disabled={votingDisabled} style={[styles.voteButton, styles.no]} onPress={() => vote('NO')}><Text style={styles.voteText}>NO</Text></TouchableOpacity>
      </View>
      <Text style={styles.text}>Yes: {event.yesPercentage}% · No: {event.noPercentage}%</Text>
      <Text style={styles.text}>Total votes: {event.totalVotes}</Text>
      <Text style={styles.text}>Closing: {new Date(event.closingTime).toLocaleString()}</Text>
      {event.outcome && <Text style={styles.outcome}>Resolved outcome: {event.outcome}</Text>}
      {event.userVote && <Text style={styles.text}>Your vote: {event.userVote}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginBottom: 8 },
  description: { color: colors.textSecondary, marginBottom: 8 },
  meta: { color: colors.accent, marginBottom: 16 },
  question: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 16 },
  buttonRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  voteButton: { flex: 1, padding: 16, borderRadius: 14, alignItems: 'center' },
  yes: { backgroundColor: colors.success },
  no: { backgroundColor: colors.danger },
  voteText: { color: colors.textPrimary, fontWeight: '900', fontSize: 20 },
  text: { color: colors.textPrimary, marginBottom: 6 },
  outcome: { color: colors.accent, marginTop: 8, fontWeight: '700' }
});
