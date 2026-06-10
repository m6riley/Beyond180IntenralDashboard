import { StyleSheet, View } from 'react-native';

import { GamesChartFiltersProvider } from '../context/GamesChartFiltersContext';
import { GameStatsCreatedBarChart } from './GameStatsCreatedBarChart';
import { GamesChartControls } from './GamesChartControls';

export function GamesSectionContent() {
  return (
    <GamesChartFiltersProvider>
      <View style={styles.container}>
        <View style={styles.controls}>
          <GamesChartControls />
        </View>
        <View style={styles.chartSlot}>
          <GameStatsCreatedBarChart />
        </View>
      </View>
    </GamesChartFiltersProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
    gap: 6,
  },
  controls: {
    flexShrink: 0,
  },
  chartSlot: {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
  },
});
