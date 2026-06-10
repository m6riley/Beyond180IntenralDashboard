import { useGamesChartFilters } from '../context/GamesChartFiltersContext';
import { ChartRangeControls } from './ChartRangeControls';

export function GamesChartControls() {
  const { period, setPeriod, dateRange, setDateRange, fullDateRange } =
    useGamesChartFilters();

  return (
    <ChartRangeControls
      period={period}
      setPeriod={setPeriod}
      dateRange={dateRange}
      setDateRange={setDateRange}
      fullDateRange={fullDateRange}
    />
  );
}
