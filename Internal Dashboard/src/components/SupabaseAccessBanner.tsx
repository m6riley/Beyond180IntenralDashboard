import { Platform, StyleSheet, Text, View } from 'react-native';

import { isSupabaseConfigured } from '../config/env';
import { useSupabaseReadAccess } from '../hooks/useSupabaseReadAccess';

export function SupabaseAccessBanner() {
  const readAccess = useSupabaseReadAccess();

  if (
    Platform.OS !== 'web' ||
    !isSupabaseConfigured() ||
    readAccess.status !== 'blocked'
  ) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.title}>Supabase is connected but returning no rows</Text>
      <Text style={styles.body}>
        Your tables have data in the Supabase dashboard, but row-level security
        is blocking reads for the anon key. Supabase returns an empty list
        instead of an error. Run{' '}
        <Text style={styles.code}>supabase/dashboard-read-policies.sql</Text>{' '}
        in the Supabase SQL editor to grant read-only dashboard access.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fcd34d',
    backgroundColor: '#fffbeb',
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    color: '#78350f',
  },
  code: {
    fontFamily: Platform.select({
      web: 'monospace',
      default: undefined,
    }),
    fontWeight: '600',
  },
});
