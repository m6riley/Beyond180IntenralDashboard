import { Platform, StyleSheet, Text, View } from 'react-native';

import { isSupabaseConfigured } from '../config/env';
import { useUserStats } from '../hooks/useUserStats';
import { CalloutCard } from './CalloutCard';

function formatCount(count: number): string {
  return count.toLocaleString('en-US');
}

function UsersCalloutRowConnected() {
  const stats = useUserStats();

  if (stats.status === 'loading') {
    return (
      <View style={styles.row}>
        <CalloutCard label="Staff members" value="—" />
        <CalloutCard label="Players" value="—" />
        <CalloutCard label="Fans" value="—" />
      </View>
    );
  }

  if (stats.status === 'error') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Failed to load user stats: {stats.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <CalloutCard
        label="Staff members"
        value={formatCount(stats.staffCount)}
      />
      <CalloutCard label="Players" value={formatCount(stats.playerCount)} />
      <CalloutCard label="Fans" value={formatCount(stats.fanCount)} />
    </View>
  );
}

export function UsersCalloutRow() {
  if (Platform.OS !== 'web' || !isSupabaseConfigured()) {
    return (
      <View style={styles.row}>
        <CalloutCard label="Staff members" value="—" />
        <CalloutCard label="Players" value="—" />
        <CalloutCard label="Fans" value="—" />
      </View>
    );
  }

  return <UsersCalloutRowConnected />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
  },
});
