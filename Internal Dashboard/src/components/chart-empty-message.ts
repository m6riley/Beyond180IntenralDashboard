export const NO_SOURCE_DATA_MESSAGE =
  'No records returned from Supabase. The database may be empty, or row-level security may be blocking reads for the anon key.';

export function getChartEmptyMessage(
  recordCount: number,
  filteredEmptyMessage: string,
): string {
  if (recordCount === 0) {
    return NO_SOURCE_DATA_MESSAGE;
  }

  return filteredEmptyMessage;
}
