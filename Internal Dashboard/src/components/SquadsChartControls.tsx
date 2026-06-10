import { useSquadsChartFilters } from '../context/SquadsChartFiltersContext';
import { ChartRangeControls } from './ChartRangeControls';

export function SquadsChartControls() {
  const { period, setPeriod, dateRange, setDateRange, fullDateRange } =
    useSquadsChartFilters();

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
