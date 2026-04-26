import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import EventSource from 'react-native-sse';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
import { apiRequest, API_BASE_URL } from '../services/api';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    const data = await apiRequest(`/events?userId=${user.id}`);
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    const stream = new EventSource(`${API_BASE_URL}/events/stream`);
    stream.addEventListener('vote-updated', loadEvents);
    stream.addEventListener('event-resolved', loadEvents);
    stream.addEventListener('event-created', loadEvents);
    return () => stream.close();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Live Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await loadEvents(); setRefreshing(false); }} tintColor={colors.accent} />}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: { color: colors.textPrimary, fontSize: 28, fontWeight: '800', marginBottom: 14 }
});
