import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type {
  DateRange,
  TeamLifecycleRecord,
  TimePeriod,
} from '../data/team-count-time-series';
import { getSquadDataDateRange, normalizeDateRange } from '../data/team-count-time-series';
import {
  useTeamLifecycleRecords,
  type TeamLifecycleRecordsState,
} from '../hooks/useTeamLifecycleRecords';

type SquadsChartFiltersContextValue = {
  period: TimePeriod;
  setPeriod: (period: TimePeriod) => void;
  dateRange: DateRange | null;
  setDateRange: (range: DateRange) => void;
  fullDateRange: DateRange | null;
  lifecycleState: TeamLifecycleRecordsState;
  records: TeamLifecycleRecord[];
};

const SquadsChartFiltersContext =
  createContext<SquadsChartFiltersContextValue | null>(null);

type SquadsChartFiltersProviderProps = {
  children: ReactNode;
};

export function SquadsChartFiltersProvider({
  children,
}: SquadsChartFiltersProviderProps) {
  const lifecycleState = useTeamLifecycleRecords();
  const [period, setPeriod] = useState<TimePeriod>('month');
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [fullDateRange, setFullDateRange] = useState<DateRange | null>(null);

  const records = useMemo(
    () => (lifecycleState.status === 'success' ? lifecycleState.records : []),
    [lifecycleState],
  );

  useEffect(() => {
    if (lifecycleState.status !== 'success') {
      return;
    }

    const range = getSquadDataDateRange(lifecycleState.records);
    if (!range) {
      return;
    }

    const normalized = normalizeDateRange(range);
    setFullDateRange(normalized);
    setDateRange(normalized);
  }, [lifecycleState]);

  const value = useMemo(
    () => ({
      period,
      setPeriod,
      dateRange,
      setDateRange,
      fullDateRange,
      lifecycleState,
      records,
    }),
    [period, dateRange, fullDateRange, lifecycleState, records],
  );

  return (
    <SquadsChartFiltersContext.Provider value={value}>
      {children}
    </SquadsChartFiltersContext.Provider>
  );
}

export function useSquadsChartFilters(): SquadsChartFiltersContextValue {
  const context = useContext(SquadsChartFiltersContext);

  if (!context) {
    throw new Error(
      'useSquadsChartFilters must be used within a SquadsChartFiltersProvider',
    );
  }

  return context;
}
