export type TeamLifecycleRecord = {
  createdAt: string | null;
  deletedAt: string | null;
};

export type TimePeriod = 'week' | 'month' | 'quarter';

export type SquadEventType = 'created' | 'deleted';

export type TeamCountTimeSeriesPoint = {
  label: string;
  count: number;
  periodStart: Date;
  periodEnd: Date;
};

export type TeamCountTimeSeries = {
  points: TeamCountTimeSeriesPoint[];
};

export type DateRange = {
  start: Date;
  end: Date;
};

type PeriodHelpers = {
  startOf: (date: Date) => Date;
  endOf: (date: Date) => Date;
  add: (date: Date, count: number) => Date;
  label: (date: Date) => string;
};

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function addMonths(date: Date, count: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function startOfWeek(date: Date): Date {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function endOfWeek(date: Date): Date {
  const end = new Date(startOfWeek(date));
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function addWeeks(date: Date, count: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + count * 7);
  return next;
}

function startOfQuarter(date: Date): Date {
  const quarterMonth = Math.floor(date.getMonth() / 3) * 3;
  return new Date(date.getFullYear(), quarterMonth, 1);
}

function endOfQuarter(date: Date): Date {
  const start = startOfQuarter(date);
  return new Date(start.getFullYear(), start.getMonth() + 3, 0, 23, 59, 59, 999);
}

function addQuarters(date: Date, count: number): Date {
  return addMonths(date, count * 3);
}

function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatWeekLabel(date: Date): string {
  const end = endOfWeek(date);
  const sameYear = date.getFullYear() === end.getFullYear();
  const startLabel = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  const endLabel = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${startLabel} – ${endLabel}`;
}

function formatQuarterLabel(date: Date): string {
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  return `Q${quarter} ${date.getFullYear()}`;
}

function getPeriodHelpers(period: TimePeriod): PeriodHelpers {
  switch (period) {
    case 'week':
      return {
        startOf: startOfWeek,
        endOf: endOfWeek,
        add: addWeeks,
        label: formatWeekLabel,
      };
    case 'month':
      return {
        startOf: startOfMonth,
        endOf: endOfMonth,
        add: addMonths,
        label: formatMonthLabel,
      };
    case 'quarter':
      return {
        startOf: startOfQuarter,
        endOf: endOfQuarter,
        add: addQuarters,
        label: formatQuarterLabel,
      };
  }
}

function getEventDate(
  team: TeamLifecycleRecord,
  eventType: SquadEventType,
): Date | null {
  const value = eventType === 'created' ? team.createdAt : team.deletedAt;
  return value ? new Date(value) : null;
}

function isActiveAt(
  team: TeamLifecycleRecord,
  snapshotAt: Date,
): boolean {
  if (!team.createdAt) {
    return false;
  }

  const createdAt = new Date(team.createdAt);
  if (createdAt > snapshotAt) {
    return false;
  }

  if (team.deletedAt) {
    const deletedAt = new Date(team.deletedAt);
    if (deletedAt <= snapshotAt) {
      return false;
    }
  }

  return true;
}

function countActiveTeamsAt(
  teams: TeamLifecycleRecord[],
  snapshotAt: Date,
): number {
  return teams.filter((team) => isActiveAt(team, snapshotAt)).length;
}

function buildPeriodTimeSeries(
  eventDates: Date[],
  period: TimePeriod,
): TeamCountTimeSeries {
  if (eventDates.length === 0) {
    return { points: [] };
  }

  const earliest = eventDates.reduce((min, date) => (date < min ? date : min));
  const helpers = getPeriodHelpers(period);
  const periodStart = helpers.startOf(earliest);
  const finalPeriodStart = helpers.startOf(new Date());
  const points: TeamCountTimeSeriesPoint[] = [];

  for (
    let cursor = new Date(periodStart);
    cursor <= finalPeriodStart;
    cursor = helpers.add(cursor, 1)
  ) {
    const periodEnd = helpers.endOf(cursor);
    const count = eventDates.filter(
      (date) => date >= cursor && date <= periodEnd,
    ).length;

    points.push({
      label: helpers.label(cursor),
      count,
      periodStart: new Date(cursor),
      periodEnd,
    });
  }

  return { points };
}

export function buildTeamCountTimeSeries(
  teams: TeamLifecycleRecord[],
  period: TimePeriod,
): TeamCountTimeSeries {
  const teamsWithCreatedAt = teams.filter(
    (team): team is TeamLifecycleRecord & { createdAt: string } =>
      team.createdAt !== null,
  );

  if (teamsWithCreatedAt.length === 0) {
    return { points: [] };
  }

  const earliestCreatedAt = teamsWithCreatedAt.reduce((earliest, team) => {
    const createdAt = new Date(team.createdAt);
    return createdAt < earliest ? createdAt : earliest;
  }, new Date(teamsWithCreatedAt[0].createdAt));

  const helpers = getPeriodHelpers(period);
  const periodStart = helpers.startOf(earliestCreatedAt);
  const finalPeriodStart = helpers.startOf(new Date());
  const points: TeamCountTimeSeriesPoint[] = [];

  for (
    let cursor = new Date(periodStart);
    cursor <= finalPeriodStart;
    cursor = helpers.add(cursor, 1)
  ) {
    const periodEnd = helpers.endOf(cursor);
    points.push({
      label: helpers.label(cursor),
      count: countActiveTeamsAt(teamsWithCreatedAt, periodEnd),
      periodStart: new Date(cursor),
      periodEnd,
    });
  }

  return { points };
}

export function buildSquadEventTimeSeries(
  teams: TeamLifecycleRecord[],
  eventType: SquadEventType,
  period: TimePeriod,
): TeamCountTimeSeries {
  const eventDates = teams
    .map((team) => getEventDate(team, eventType))
    .filter((date): date is Date => date !== null);

  return buildPeriodTimeSeries(eventDates, period);
}

export function buildCreatedAtTimeSeries(
  createdAtValues: (string | null)[],
  period: TimePeriod,
): TeamCountTimeSeries {
  const eventDates = createdAtValues
    .filter((value): value is string => value !== null)
    .map((value) => new Date(value));

  return buildPeriodTimeSeries(eventDates, period);
}

export function getDateRangeFromCreatedAtValues(
  createdAtValues: (string | null)[],
): DateRange | null {
  const dates = createdAtValues
    .filter((value): value is string => value !== null)
    .map((value) => new Date(value));

  if (dates.length === 0) {
    return null;
  }

  return normalizeDateRange({
    start: dates.reduce((earliest, date) => (date < earliest ? date : earliest)),
    end: new Date(),
  });
}

function startOfDay(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

function endOfDay(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

const MIN_RANGE_MS = 24 * 60 * 60 * 1000;

export function normalizeDateRange(
  range: DateRange,
  bounds?: DateRange,
): DateRange {
  let start = startOfDay(range.start);
  let end = endOfDay(range.end);

  if (start.getTime() > end.getTime()) {
    [start, end] = [startOfDay(end), endOfDay(start)];
  }

  if (end.getTime() - start.getTime() < MIN_RANGE_MS) {
    if (bounds) {
      return {
        start: startOfDay(bounds.start),
        end: endOfDay(bounds.end),
      };
    }

    end = endOfDay(start);
  }

  if (bounds) {
    start = new Date(Math.max(start.getTime(), startOfDay(bounds.start).getTime()));
    end = new Date(Math.min(end.getTime(), endOfDay(bounds.end).getTime()));

    if (end.getTime() - start.getTime() < MIN_RANGE_MS) {
      return {
        start: startOfDay(bounds.start),
        end: endOfDay(bounds.end),
      };
    }
  }

  return { start, end };
}

export function getSquadDataDateRange(
  teams: TeamLifecycleRecord[],
): DateRange | null {
  const dates: Date[] = [];

  for (const team of teams) {
    if (team.createdAt) {
      dates.push(new Date(team.createdAt));
    }
    if (team.deletedAt) {
      dates.push(new Date(team.deletedAt));
    }
  }

  if (dates.length === 0) {
    return null;
  }

  return normalizeDateRange({
    start: dates.reduce((earliest, date) =>
      date < earliest ? date : earliest,
    ),
    end: new Date(),
  });
}

export function filterTimeSeriesByDateRange(
  series: TeamCountTimeSeries,
  range: DateRange,
): TeamCountTimeSeries {
  const rangeStart = range.start.getTime();
  const rangeEnd = range.end.getTime();

  return {
    points: series.points.filter((point) => {
      const pointStart = point.periodStart.getTime();
      const pointEnd = point.periodEnd.getTime();
      return pointEnd >= rangeStart && pointStart <= rangeEnd;
    }),
  };
}
