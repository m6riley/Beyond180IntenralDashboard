import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { TimePeriod } from '../data/team-count-time-series';

const PERIOD_OPTIONS: { value: TimePeriod; label: string }[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'quarter', label: 'Quarter' },
];

type PeriodSelectorProps = {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
};

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <View style={styles.container}>
      {PERIOD_OPTIONS.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
  },
  optionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  optionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
  },
  optionTextSelected: {
    color: '#1d4ed8',
  },
});
