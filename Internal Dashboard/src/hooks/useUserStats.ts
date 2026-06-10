import { useEffect, useState } from 'react';

import { useRepositories } from '../context/useRepositories';
import { countUniqueFans, countUniqueStaffMembers } from '../data/user-stats';

export type UserStatsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'success';
      staffCount: number;
      playerCount: number;
      fanCount: number;
    };

export function useUserStats(): UserStatsState {
  const { teams, players } = useRepositories();
  const [state, setState] = useState<UserStatsState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [memberResult, playerResult] = await Promise.all([
        teams.getMemberLists(),
        players.getCount(),
      ]);

      if (cancelled) {
        return;
      }

      if (memberResult.error) {
        setState({ status: 'error', message: memberResult.error.message });
        return;
      }

      if (playerResult.error) {
        setState({ status: 'error', message: playerResult.error.message });
        return;
      }

      setState({
        status: 'success',
        staffCount: countUniqueStaffMembers(memberResult.data),
        playerCount: playerResult.data,
        fanCount: countUniqueFans(memberResult.data),
      });
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [teams, players]);

  return state;
}
