import type { ECharts, EChartsOption } from 'echarts';
import * as echarts from 'echarts/dist/echarts.esm.min.js';
import { useId, useLayoutEffect, useRef } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

const MAX_INIT_ATTEMPTS = 40;

function toDomId(reactId: string): string {
  return `chart-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

type BarChartProps = {
  option: EChartsOption;
  style?: ViewStyle;
};

export function BarChart({ option, style }: BarChartProps) {
  const reactId = useId();
  const chartDomId = toDomId(reactId);
  const chartRef = useRef<ECharts | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const domNodeRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    let cancelled = false;
    let frameId = 0;
    let attempts = 0;

    const cleanup = () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      chartRef.current?.dispose();
      chartRef.current = null;
    };

    const mountChart = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        if (attempts < MAX_INIT_ATTEMPTS) {
          attempts += 1;
          frameId = requestAnimationFrame(tryMount);
        }
        return;
      }

      if (!chartRef.current) {
        const chart = echarts.init(element);
        chartRef.current = chart;

        const resizeObserver = new ResizeObserver(() => {
          chart.resize();
        });
        resizeObserver.observe(element);
        resizeObserverRef.current = resizeObserver;
      }

      chartRef.current.setOption(option, true);
      chartRef.current.resize();
    };

    const tryMount = () => {
      if (cancelled) {
        return;
      }

      const element =
        domNodeRef.current ?? document.getElementById(chartDomId);
      if (!element) {
        if (attempts < MAX_INIT_ATTEMPTS) {
          attempts += 1;
          frameId = requestAnimationFrame(tryMount);
        }
        return;
      }

      mountChart(element);
    };

    tryMount();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      cleanup();
    };
  }, [chartDomId, option]);

  return (
    <View
      id={chartDomId}
      ref={(node) => {
        domNodeRef.current = node as unknown as HTMLElement | null;
      }}
      style={[styles.chart, style]}
      collapsable={false}
    />
  );
}

const styles = StyleSheet.create({
  chart: {
    width: '100%',
    flex: 1,
    minHeight: 0,
    backgroundColor: '#fff',
  },
});
