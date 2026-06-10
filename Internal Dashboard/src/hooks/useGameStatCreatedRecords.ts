import { useEffect, useState } from 'react';

import { useRepositories } from '../context/useRepositories';

export type GameStatCreatedRecordsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; records: { createdAt: string }[] };

export function useGameStatCreatedRecords(): GameStatCreatedRecordsState {
  const { gameStats } = useRepositories();
  const [state, setState] = useState<GameStatCreatedRecordsState>({
    status: 'loading',
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const result = await gameStats.getCreatedAtRecords();

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
  }, [gameStats]);

  return state;
}
