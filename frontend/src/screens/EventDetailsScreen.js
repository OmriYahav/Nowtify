import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  if (!event) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.container}><Text style={styles.text}>Loading event...</Text></View>
      </SafeAreaView>
    );
  }

  const votingDisabled = !!event.userVote || event.status === 'RESOLVED';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.brand}>Nowtify</Text>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <Text style={styles.meta}>{event.category} · {event.status}</Text>
        <View style={styles.card}>
          <Text style={styles.question}>{event.predictionQuestion}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity disabled={votingDisabled} style={[styles.voteButton, styles.yes, votingDisabled && styles.disabled]} onPress={() => vote('YES')}><Text style={styles.voteText}>YES</Text></TouchableOpacity>
            <TouchableOpacity disabled={votingDisabled} style={[styles.voteButton, styles.no, votingDisabled && styles.disabled]} onPress={() => vote('NO')}><Text style={styles.voteText}>NO</Text></TouchableOpacity>
          </View>
          <Text style={styles.text}>Yes: {event.yesPercentage}% · No: {event.noPercentage}%</Text>
          <Text style={styles.text}>Total votes: {event.totalVotes}</Text>
          <Text style={styles.text}>Closing: {new Date(event.closingTime).toLocaleString()}</Text>
          {event.outcome ? <Text style={styles.outcome}>Resolved outcome: {event.outcome}</Text> : null}
          {event.userVote ? <Text style={styles.text}>Your vote: {event.userVote}</Text> : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  brand: { color: colors.accent, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase', fontSize: 12, marginBottom: 8 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '900', marginBottom: 8 },
  description: { color: colors.textSecondary, marginBottom: 8, lineHeight: 20 },
  meta: { color: colors.accent, marginBottom: 14, fontWeight: '700' },
  card: { backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14 },
  question: { color: colors.textPrimary, fontSize: 19, fontWeight: '700', marginBottom: 14 },
  buttonRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  voteButton: { flex: 1, padding: 16, borderRadius: 14, alignItems: 'center' },
  yes: { backgroundColor: colors.success },
  no: { backgroundColor: colors.danger },
  disabled: { opacity: 0.5 },
  voteText: { color: colors.textPrimary, fontWeight: '900', fontSize: 20 },
  text: { color: colors.textPrimary, marginBottom: 6 },
  outcome: { color: colors.accent, marginTop: 8, fontWeight: '700' }
});
