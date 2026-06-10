import type { Team } from './entities';

export function countUniqueStaffMembers(
  teams: Pick<Team, 'staff'>[],
): number {
  const staffIds = new Set<string>();

  for (const team of teams) {
    for (const staffId of team.staff ?? []) {
      staffIds.add(staffId);
    }
  }

  return staffIds.size;
}

export function countUniqueFans(teams: Pick<Team, 'fans'>[]): number {
  const fanIds = new Set<string>();

  for (const team of teams) {
    for (const fanId of team.fans ?? []) {
      fanIds.add(fanId);
    }
  }

  return fanIds.size;
}
