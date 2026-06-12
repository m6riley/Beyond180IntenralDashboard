import type { EChartsOption } from 'echarts';
import { useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { isSupabaseConfigured } from '../config/env';
import { useGamesChartFilters } from '../context/GamesChartFiltersContext';
import {
  buildCreatedAtTimeSeries,
  filterTimeSeriesByDateRange,
  type TeamCountTimeSeries,
} from '../data/team-count-time-series';
import { BarChart } from './BarChart';
import { getChartEmptyMessage } from './chart-empty-message';

const CARD_HEADER_HEIGHT = 36;

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
        name: 'Game stats',
        type: 'bar',
        data: series.points.map((point) => point.count),
        itemStyle: {
          color: '#8b5cf6',
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

function GameStatsCreatedBarChartConnected() {
  const { period, dateRange, recordsState, records } = useGamesChartFilters();

  const series = useMemo(() => {
    if (recordsState.status !== 'success' || !dateRange) {
      return null;
    }

    const fullSeries = buildCreatedAtTimeSeries(
      records.map((record) => record.createdAt),
      period,
    );
    return filterTimeSeriesByDateRange(fullSeries, dateRange);
  }, [dateRange, period, records, recordsState]);

  const option = useMemo(() => {
    if (!series || series.points.length === 0) {
      return null;
    }

    return buildChartOption(series);
  }, [series]);

  if (recordsState.status === 'loading') {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.cardTitle}>Game Stats Created</Text>
        </View>
        <View style={styles.messageState}>
          <Text style={styles.messageText}>Loading game stat data…</Text>
        </View>
      </View>
    );
  }

  if (recordsState.status === 'error') {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.cardTitle}>Game Stats Created</Text>
        </View>
        <View style={styles.messageState}>
          <Text style={styles.errorText}>
            Failed to load game stat data: {recordsState.message}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.cardTitle}>Game Stats Created</Text>
      </View>

      {!series || series.points.length === 0 ? (
        <View style={styles.messageState}>
          <Text style={styles.messageText}>
            {getChartEmptyMessage(
              records.length,
              'No game stats in the selected time frame.',
            )}
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

export function GameStatsCreatedBarChart() {
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
          Configure Supabase to load game stat data.
        </Text>
      </View>
    );
  }

  return <GameStatsCreatedBarChartConnected />;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  header: {
    height: CARD_HEADER_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 12,
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  chartArea: {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
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
