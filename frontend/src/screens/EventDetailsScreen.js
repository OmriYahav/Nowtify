import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { apiRequest, ApiError } from '../services/api';
import { colors } from '../theme/colors';

export default function EventDetailsScreen({ route }) {
  const { eventId } = route.params;
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [submittingVote, setSubmittingVote] = useState(false);

  const load = async () => {
    try {
      setError('');
      const data = await apiRequest(`/events/${eventId}?userId=${encodeURIComponent(user.id)}`);
      setEvent(data);
    } catch (e) {
      setError(e.message || 'Failed to load event');
    }
  };

  useEffect(() => { load(); }, [eventId, user.id]);

  const vote = async (voteValue) => {
    try {
      setSubmittingVote(true);
      setError('');
      const updated = await apiRequest(`/events/${eventId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, vote: voteValue })
      });
      setEvent(updated);
    } catch (e) {
      if (e instanceof ApiError && e.status === 400) {
        setError('Vote was not accepted. You may have already voted or event is closed.');
      } else {
        setError(e.message || 'Vote failed');
      }
    } finally {
      setSubmittingVote(false);
    }
  };

  if (!event && !error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.container}><ActivityIndicator color={colors.accent} /></View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.container}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={load} style={styles.retry}><Text style={styles.retryText}>Retry</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const votingDisabled = submittingVote || event.status === 'RESOLVED';

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
            <TouchableOpacity
              disabled={votingDisabled}
              style={[styles.voteButton, styles.yes, event.userVote === 'YES' && styles.selected, votingDisabled && styles.disabled]}
              onPress={() => vote('YES')}
            ><Text style={styles.voteText}>YES</Text></TouchableOpacity>
            <TouchableOpacity
              disabled={votingDisabled}
              style={[styles.voteButton, styles.no, event.userVote === 'NO' && styles.selected, votingDisabled && styles.disabled]}
              onPress={() => vote('NO')}
            ><Text style={styles.voteText}>NO</Text></TouchableOpacity>
          </View>
          <Text style={styles.text}>Yes: {event.yesPercentage}% · No: {event.noPercentage}%</Text>
          <Text style={styles.text}>Total votes: {event.totalVotes}</Text>
          <Text style={styles.text}>Closing: {new Date(event.closingTime).toLocaleString()}</Text>
          {event.userVote ? <Text style={styles.text}>Your vote: {event.userVote}</Text> : null}
          {event.outcome ? <Text style={styles.outcome}>Resolved outcome: {event.outcome}</Text> : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  selected: { borderWidth: 2, borderColor: colors.textPrimary },
  disabled: { opacity: 0.6 },
  voteText: { color: colors.textPrimary, fontWeight: '900', fontSize: 20 },
  text: { color: colors.textPrimary, marginBottom: 6 },
  outcome: { color: colors.accent, marginTop: 8, fontWeight: '700' },
  errorText: { color: colors.danger, marginTop: 8 },
  retry: { marginTop: 10, backgroundColor: colors.accent, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, alignSelf: 'flex-start' },
  retryText: { color: colors.textPrimary, fontWeight: '700' }
});
