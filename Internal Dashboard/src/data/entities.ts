import type { Tables, TablesInsert, TablesUpdate } from '../lib/supabase/types';

export type Team = Tables<'Team'>;
export type TeamInsert = TablesInsert<'Team'>;
export type TeamUpdate = TablesUpdate<'Team'>;

export type SubTeam = Tables<'SubTeam'>;
export type SubTeamInsert = TablesInsert<'SubTeam'>;
export type SubTeamUpdate = TablesUpdate<'SubTeam'>;

export type PlayerRecord = Tables<'PlayerRecord'>;
export type PlayerRecordInsert = TablesInsert<'PlayerRecord'>;
export type PlayerRecordUpdate = TablesUpdate<'PlayerRecord'>;

export type Event = Tables<'Event'>;
export type EventInsert = TablesInsert<'Event'>;
export type EventUpdate = TablesUpdate<'Event'>;

export type GameStat = Tables<'GameStat'>;
export type GameStatInsert = TablesInsert<'GameStat'>;
export type GameStatUpdate = TablesUpdate<'GameStat'>;

export type PlayerGameStat = Tables<'PlayerGameStat'>;
export type PlayerGameStatInsert = TablesInsert<'PlayerGameStat'>;
export type PlayerGameStatUpdate = TablesUpdate<'PlayerGameStat'>;

export type GameEvent = Tables<'GameEvent'>;
export type GameEventInsert = TablesInsert<'GameEvent'>;
export type GameEventUpdate = TablesUpdate<'GameEvent'>;

export type User = Tables<'User'>;
export type UserInsert = TablesInsert<'User'>;
export type UserUpdate = TablesUpdate<'User'>;

export type EventAvailability = Tables<'EventAvailability'>;
export type StaffEventAvailability = Tables<'StaffEventAvailability'>;
export type EventPlayerSlot = Tables<'EventPlayerSlot'>;
export type EventLink = Tables<'EventLink'>;
export type HouseMarker = Tables<'HouseMarker'>;
export type TeamJoinRequest = Tables<'TeamJoinRequest'>;
