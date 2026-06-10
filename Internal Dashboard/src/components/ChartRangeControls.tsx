import { useCallback } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import type { DateRange, TimePeriod } from '../data/team-count-time-series';
import { normalizeDateRange } from '../data/team-count-time-series';
import { DualRangeSlider } from './DualRangeSlider';
import { PeriodSelector } from './PeriodSelector';

function formatRangeDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

type ChartRangeControlsProps = {
  period: TimePeriod;
  setPeriod: (period: TimePeriod) => void;
  dateRange: DateRange | null;
  setDateRange: (range: DateRange) => void;
  fullDateRange: DateRange | null;
};

export function ChartRangeControls({
  period,
  setPeriod,
  dateRange,
  setDateRange,
  fullDateRange,
}: ChartRangeControlsProps) {
  const handleStartChange = useCallback(
    (value: number) => {
      if (!dateRange || !fullDateRange) {
        return;
      }

      setDateRange(
        normalizeDateRange(
          {
            start: new Date(value),
            end: dateRange.end,
          },
          fullDateRange,
        ),
      );
    },
    [dateRange, fullDateRange, setDateRange],
  );

  const handleEndChange = useCallback(
    (value: number) => {
      if (!dateRange || !fullDateRange) {
        return;
      }

      setDateRange(
        normalizeDateRange(
          {
            start: dateRange.start,
            end: new Date(value),
          },
          fullDateRange,
        ),
      );
    },
    [dateRange, fullDateRange, setDateRange],
  );

  if (Platform.OS !== 'web' || !fullDateRange || !dateRange) {
    return (
      <View style={styles.container}>
        <PeriodSelector value={period} onChange={setPeriod} />
      </View>
    );
  }

  const min = fullDateRange.start.getTime();
  const max = fullDateRange.end.getTime();
  const startValue = dateRange.start.getTime();
  const endValue = dateRange.end.getTime();

  return (
    <View style={styles.container}>
      <PeriodSelector value={period} onChange={setPeriod} />
      <View style={styles.rangeSection}>
        <Text style={styles.rangeLabel}>
          {formatRangeDate(dateRange.start)} – {formatRangeDate(dateRange.end)}
        </Text>
        <DualRangeSlider
          min={min}
          max={max}
          startValue={startValue}
          endValue={endValue}
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    paddingBottom: 2,
    flexShrink: 0,
  },
  rangeSection: {
    gap: 4,
  },
  rangeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
});
