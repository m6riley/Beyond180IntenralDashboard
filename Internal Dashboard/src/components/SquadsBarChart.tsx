import type { EChartsOption } from 'echarts';
import { useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { isSupabaseConfigured } from '../config/env';
import { useSquadsChartFilters } from '../context/SquadsChartFiltersContext';
import {
  buildTeamCountTimeSeries,
  filterTimeSeriesByDateRange,
  type TeamCountTimeSeries,
} from '../data/team-count-time-series';
import { BarChart } from './BarChart';

function buildChartOption(series: TeamCountTimeSeries): EChartsOption {
  return {
    grid: {
      top: 28,
      left: 40,
      right: 12,
      bottom: series.points.length > 6 ? 56 : 32,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: series.points.map((point) => point.label),
      axisLabel: {
        rotate: series.points.length > 6 ? 35 : 0,
        fontSize: 10,
      },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
    },
    series: [
      {
        name: 'Squads',
        type: 'bar',
        data: series.points.map((point) => point.count),
        itemStyle: {
          color: '#3b82f6',
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 10,
          color: '#475569',
        },
      },
    ],
  };
}

function SquadsBarChartConnected() {
  const { period, dateRange, lifecycleState } = useSquadsChartFilters();

  const series = useMemo(() => {
    if (lifecycleState.status !== 'success' || !dateRange) {
      return null;
    }

    const fullSeries = buildTeamCountTimeSeries(lifecycleState.records, period);
    return filterTimeSeriesByDateRange(fullSeries, dateRange);
  }, [dateRange, lifecycleState, period]);

  const option = useMemo(() => {
    if (!series || series.points.length === 0) {
      return null;
    }

    return buildChartOption(series);
  }, [series]);

  if (lifecycleState.status === 'loading') {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.cardTitle}>Squads Managed</Text>
        </View>
        <View style={styles.messageState}>
          <Text style={styles.messageText}>Loading squad data…</Text>
        </View>
      </View>
    );
  }

  if (lifecycleState.status === 'error') {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.cardTitle}>Squads Managed</Text>
        </View>
        <View style={styles.messageState}>
          <Text style={styles.errorText}>
            Failed to load squad data: {lifecycleState.message}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.cardTitle}>Squads Managed</Text>
      </View>

      {!series || series.points.length === 0 ? (
        <View style={styles.messageState}>
          <Text style={styles.messageText}>
            No squad data in the selected time frame.
          </Text>
        </View>
      ) : option ? (
        <View style={styles.chartArea}>
          <BarChart option={option} />
        </View>
      ) : null}
    </View>
  );
}

export function SquadsBarChart() {
  if (Platform.OS !== 'web') {
    return (
      <View style={styles.card}>
        <Text style={styles.messageText}>Charts are available on web.</Text>
      </View>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <View style={styles.card}>
        <Text style={styles.messageText}>
          Configure Supabase to load squad data.
        </Text>
      </View>
    );
  }

  return <SquadsBarChartConnected />;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  chartArea: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  messageState: {
    flex: 1,
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  messageText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
  },
});
