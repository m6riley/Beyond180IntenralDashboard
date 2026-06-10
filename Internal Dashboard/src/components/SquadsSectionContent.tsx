import { StyleSheet, View } from 'react-native';

import { SquadsChartFiltersProvider } from '../context/SquadsChartFiltersContext';
import { SquadAddedBarChart, SquadDeletedBarChart } from './SquadEventBarChart';
import { SquadsBarChart } from './SquadsBarChart';
import { SquadsChartControls } from './SquadsChartControls';

export function SquadsSectionContent() {
  return (
    <SquadsChartFiltersProvider>
      <View style={styles.container}>
        <SquadsChartControls />
        <View style={styles.charts}>
          <View style={styles.chartSlot}>
            <SquadsBarChart />
          </View>
          <View style={styles.chartSlot}>
            <SquadAddedBarChart />
          </View>
          <View style={styles.chartSlot}>
            <SquadDeletedBarChart />
          </View>
        </View>
      </View>
    </SquadsChartFiltersProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    gap: 8,
  },
  charts: {
    flex: 1,
    minHeight: 0,
    gap: 8,
  },
  chartSlot: {
    flex: 1,
    minHeight: 0,
  },
});
