import { useEffect, useState } from 'react';

import { useRepositories } from '../context/useRepositories';
import type { TeamLifecycleRecord } from '../data/team-count-time-series';

export type TeamLifecycleRecordsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; records: TeamLifecycleRecord[] };

export function useTeamLifecycleRecords(): TeamLifecycleRecordsState {
  const { teams } = useRepositories();
  const [state, setState] = useState<TeamLifecycleRecordsState>({
    status: 'loading',
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const result = await teams.getLifecycleRecords();

      if (cancelled) {
        return;
      }

      if (result.error) {
        setState({ status: 'error', message: result.error.message });
        return;
      }

      setState({
        status: 'success',
        records: result.data,
      });
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [teams]);

  return state;
}
