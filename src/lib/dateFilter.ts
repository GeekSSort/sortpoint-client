/**
 * Rows stamp dates in a couple of shapes — "17 May 2026 - 10:45 AM" and
 * "25 May 2024, 10:30 AM" — so pull the leading day/month/year off either.
 */
export function matchesDay(dateTime: string, day: Date | null): boolean {
  if (!day) return true;
  const head = dateTime.match(/^\d{1,2}\s+\w+\s+\d{4}/)?.[0] ?? dateTime.split(/\s*[-,]\s/)[0];
  const parsed = new Date(head);
  if (Number.isNaN(parsed.getTime())) return true;
  return (
    parsed.getFullYear() === day.getFullYear() &&
    parsed.getMonth() === day.getMonth() &&
    parsed.getDate() === day.getDate()
  );
}
