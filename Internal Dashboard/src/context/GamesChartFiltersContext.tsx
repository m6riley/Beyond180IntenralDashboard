import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { DateRange, TimePeriod } from '../data/team-count-time-series';
import { getDateRangeFromCreatedAtValues } from '../data/team-count-time-series';
import {
  useGameStatCreatedRecords,
  type GameStatCreatedRecordsState,
} from '../hooks/useGameStatCreatedRecords';

type GameStatCreatedRecord = {
  createdAt: string;
};

type GamesChartFiltersContextValue = {
  period: TimePeriod;
  setPeriod: (period: TimePeriod) => void;
  dateRange: DateRange | null;
  setDateRange: (range: DateRange) => void;
  fullDateRange: DateRange | null;
  recordsState: GameStatCreatedRecordsState;
  records: GameStatCreatedRecord[];
};

const GamesChartFiltersContext =
  createContext<GamesChartFiltersContextValue | null>(null);

type GamesChartFiltersProviderProps = {
  children: ReactNode;
};

export function GamesChartFiltersProvider({
  children,
}: GamesChartFiltersProviderProps) {
  const recordsState = useGameStatCreatedRecords();
  const [period, setPeriod] = useState<TimePeriod>('month');
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [fullDateRange, setFullDateRange] = useState<DateRange | null>(null);

  const records = useMemo(
    () => (recordsState.status === 'success' ? recordsState.records : []),
    [recordsState],
  );

  useEffect(() => {
    if (recordsState.status !== 'success') {
      return;
    }

    const range = getDateRangeFromCreatedAtValues(
      recordsState.records.map((record) => record.createdAt),
    );
    if (!range) {
      return;
    }

    setFullDateRange(range);
    setDateRange(range);
  }, [recordsState]);

  const value = useMemo(
    () => ({
      period,
      setPeriod,
      dateRange,
      setDateRange,
      fullDateRange,
      recordsState,
      records,
    }),
    [period, dateRange, fullDateRange, recordsState, records],
  );

  return (
    <GamesChartFiltersContext.Provider value={value}>
      {children}
    </GamesChartFiltersContext.Provider>
  );
}

export function useGamesChartFilters(): GamesChartFiltersContextValue {
  const context = useContext(GamesChartFiltersContext);

  if (!context) {
    throw new Error(
      'useGamesChartFilters must be used within a GamesChartFiltersProvider',
    );
  }

  return context;
}
