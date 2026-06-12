import { useEffect, useState } from 'react';

import { useRepositories } from '../context/useRepositories';

export type SupabaseReadAccessState =
  | { status: 'checking' }
  | { status: 'ok' }
  | { status: 'blocked' };

export function useSupabaseReadAccess(): SupabaseReadAccessState {
  const { teams, gameStats, players } = useRepositories();
  const [state, setState] = useState<SupabaseReadAccessState>({
    status: 'checking',
  });

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const [teamResult, gameStatResult, playerResult] = await Promise.all([
        teams.getLifecycleRecords(),
        gameStats.getCreatedAtRecords(),
        players.getCount(),
      ]);

      if (cancelled) {
        return;
      }

      const hasError =
        teamResult.error ?? gameStatResult.error ?? playerResult.error;
      if (hasError) {
        setState({ status: 'ok' });
        return;
      }

      const teamCount = teamResult.data?.length ?? 0;
      const gameStatCount = gameStatResult.data?.length ?? 0;
      const playerCount = playerResult.data ?? 0;

      if (teamCount === 0 && gameStatCount === 0 && playerCount === 0) {
        setState({ status: 'blocked' });
        return;
      }

      setState({ status: 'ok' });
    }

    void check();

    return () => {
      cancelled = true;
    };
  }, [gameStats, players, teams]);

  return state;
}
