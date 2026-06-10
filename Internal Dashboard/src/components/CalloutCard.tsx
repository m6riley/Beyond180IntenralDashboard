import { StyleSheet, Text, View } from 'react-native';

type CalloutCardProps = {
  label: string;
  value: string;
};

export function CalloutCard({ label, value }: CalloutCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
  },
});
