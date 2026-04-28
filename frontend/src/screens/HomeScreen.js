import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EventSource from 'react-native-sse';
import EventCard from '../components/EventCard';
import ScreenLayout from '../components/ScreenLayout';
import { apiRequest, API_BASE_URL, ApiError } from '../services/api';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEvents = useCallback(async () => {
    try {
      setError('');
      let data;
      try {
        data = await apiRequest(`/events?userId=${encodeURIComponent(user.id)}`);
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) {
          data = await apiRequest('/events');
        } else {
          throw e;
        }
      }
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Unable to load events');
      if (__DEV__) console.error('[home] load failed', e);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    const stream = new EventSource(`${API_BASE_URL}/events/stream`);
    stream.addEventListener('vote-updated', loadEvents);
    stream.addEventListener('event-resolved', loadEvents);
    stream.addEventListener('event-created', loadEvents);
    return () => stream.close();
  }, [loadEvents]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  return (
    <ScreenLayout title="Live Events" subtitle="Track active predictions in real time">
      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.stateTitle}>Loading events...</Text>
        </View>
      ) : error && events.length === 0 ? (
        <View style={styles.centerState}>
          <Text style={styles.errorTitle}>Unable to load events</Text>
          <Text style={styles.stateSubtitle}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadEvents}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
          renderItem={({ item }) => (
            <EventCard event={item} onPress={() => navigation.navigate('EventDetails', { eventId: item.id })} />
          )}
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Text style={styles.stateTitle}>No live events yet</Text>
              <Text style={styles.stateSubtitle}>Check back soon for new predictions.</Text>
            </View>
          }
          contentContainerStyle={events.length === 0 ? styles.emptyContainer : styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: 24 },
  emptyContainer: { flexGrow: 1, justifyContent: 'center', paddingBottom: 80 },
  centerState: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    alignItems: 'center',
    marginTop: 8
  },
  stateTitle: { color: colors.textPrimary, fontSize: 19, fontWeight: '800', marginTop: 12 },
  errorTitle: { color: colors.danger, fontSize: 19, fontWeight: '800' },
  stateSubtitle: { color: colors.textSecondary, marginTop: 6, textAlign: 'center', lineHeight: 20 },
  retryButton: { marginTop: 14, backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20 },
  retryText: { color: colors.textPrimary, fontWeight: '700' }
});
