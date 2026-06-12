import type { EChartsOption } from 'echarts';
import { useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { isSupabaseConfigured } from '../config/env';
import { useSquadsChartFilters } from '../context/SquadsChartFiltersContext';
import {
  buildSquadEventTimeSeries,
  filterTimeSeriesByDateRange,
  type SquadEventType,
  type TeamCountTimeSeries,
} from '../data/team-count-time-series';
import { BarChart } from './BarChart';
import { getChartEmptyMessage } from './chart-empty-message';

type SquadEventBarChartConfig = {
  eventType: SquadEventType;
  title: string;
  seriesName: string;
  color: string;
  emptyMessage: string;
};

const CREATED_CONFIG: SquadEventBarChartConfig = {
  eventType: 'created',
  title: 'Squads Added',
  seriesName: 'Added',
  color: '#22c55e',
  emptyMessage: 'No squads have been added in the selected time frame.',
};

const DELETED_CONFIG: SquadEventBarChartConfig = {
  eventType: 'deleted',
  title: 'Squads Deleted',
  seriesName: 'Deleted',
  color: '#ef4444',
  emptyMessage: 'No squads have been deleted in the selected time frame.',
};

function buildChartOption(
  series: TeamCountTimeSeries,
  config: SquadEventBarChartConfig,
): EChartsOption {
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
        name: config.seriesName,
        type: 'bar',
        data: series.points.map((point) => point.count),
        itemStyle: {
          color: config.color,
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

type SquadEventBarChartConnectedProps = {
  config: SquadEventBarChartConfig;
};

function SquadEventBarChartConnected({
  config,
}: SquadEventBarChartConnectedProps) {
  const { period, dateRange, lifecycleState } = useSquadsChartFilters();

  const series = useMemo(() => {
    if (lifecycleState.status !== 'success' || !dateRange) {
      return null;
    }

    const fullSeries = buildSquadEventTimeSeries(
      lifecycleState.records,
      config.eventType,
      period,
    );
    return filterTimeSeriesByDateRange(fullSeries, dateRange);
  }, [config.eventType, dateRange, lifecycleState, period]);

  const option = useMemo(() => {
    if (!series || series.points.length === 0) {
      return null;
    }

    return buildChartOption(series, config);
  }, [config, series]);

  if (lifecycleState.status === 'loading') {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.cardTitle}>{config.title}</Text>
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
          <Text style={styles.cardTitle}>{config.title}</Text>
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
        <Text style={styles.cardTitle}>{config.title}</Text>
      </View>

      {!series || series.points.length === 0 ? (
        <View style={styles.messageState}>
          <Text style={styles.messageText}>
            {getChartEmptyMessage(
              lifecycleState.status === 'success'
                ? lifecycleState.records.length
                : 0,
              config.emptyMessage,
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

type SquadEventBarChartProps = {
  variant: 'created' | 'deleted';
};

function SquadEventBarChart({ variant }: SquadEventBarChartProps) {
  const config = variant === 'created' ? CREATED_CONFIG : DELETED_CONFIG;

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

  return <SquadEventBarChartConnected config={config} />;
}

export function SquadAddedBarChart() {
  return <SquadEventBarChart variant="created" />;
}

export function SquadDeletedBarChart() {
  return <SquadEventBarChart variant="deleted" />;
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
