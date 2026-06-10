import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../lib/supabase/types';
import { EventRepository } from './repositories/event-repository';
import { GameStatRepository } from './repositories/game-stat-repository';
import { PlayerRecordRepository } from './repositories/player-record-repository';
import { SubTeamRepository } from './repositories/sub-team-repository';
import { TeamRepository } from './repositories/team-repository';
import { UserRepository } from './repositories/user-repository';
import { TableRepository } from './table-repository';

export type Repositories = {
  teams: TeamRepository;
  subTeams: SubTeamRepository;
  players: PlayerRecordRepository;
  events: EventRepository;
  gameStats: GameStatRepository;
  users: UserRepository;
  eventAvailability: TableRepository<'EventAvailability'>;
  staffEventAvailability: TableRepository<'StaffEventAvailability'>;
  eventPlayerSlots: TableRepository<'EventPlayerSlot'>;
  playerGameStats: TableRepository<'PlayerGameStat'>;
  gameEvents: TableRepository<'GameEvent'>;
  eventLinks: TableRepository<'EventLink'>;
  houseMarkers: TableRepository<'HouseMarker'>;
  teamJoinRequests: TableRepository<'TeamJoinRequest'>;
  playerRecordToSubTeam: TableRepository<'_PlayerRecordToSubTeam'>;
};

export function createRepositories(
  client: SupabaseClient<Database>,
): Repositories {
  return {
    teams: new TeamRepository(client),
    subTeams: new SubTeamRepository(client),
    players: new PlayerRecordRepository(client),
    events: new EventRepository(client),
    gameStats: new GameStatRepository(client),
    users: new UserRepository(client),
    eventAvailability: new TableRepository(client, 'EventAvailability'),
    staffEventAvailability: new TableRepository(
      client,
      'StaffEventAvailability',
    ),
    eventPlayerSlots: new TableRepository(client, 'EventPlayerSlot'),
    playerGameStats: new TableRepository(client, 'PlayerGameStat'),
    gameEvents: new TableRepository(client, 'GameEvent'),
    eventLinks: new TableRepository(client, 'EventLink'),
    houseMarkers: new TableRepository(client, 'HouseMarker'),
    teamJoinRequests: new TableRepository(client, 'TeamJoinRequest'),
    playerRecordToSubTeam: new TableRepository(
      client,
      '_PlayerRecordToSubTeam',
    ),
  };
}
