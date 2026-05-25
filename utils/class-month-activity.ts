import type { ClassLogEntry } from '@/contexts/class-log-context';

export function countClassesInMonth(
  entries: ClassLogEntry[],
  year: number,
  month: number,
): number {
  return entries.filter((e) => {
    const d = new Date(e.dateTimeISO);
    return !Number.isNaN(d.getTime()) && d.getFullYear() === year && d.getMonth() === month;
  }).length;
}

export type MonthChartPoint = {
  count: number;
  label: string;
  longLabel: string;
  monthIndex: number;
  year: number;
};

/** Jan through the current month for the given year. */
export function buildYearMonthlyChart(
  entries: ClassLogEntry[],
  now = new Date(),
): MonthChartPoint[] {
  const year = now.getFullYear();
  const currentMonth = now.getMonth();
  return Array.from({ length: currentMonth + 1 }, (_, month) => {
    const d = new Date(year, month, 1);
    return {
      count: countClassesInMonth(entries, year, month),
      label: d.toLocaleString('en-US', { month: 'short' }),
      longLabel: d.toLocaleString('en-US', { month: 'long' }),
      monthIndex: month,
      year,
    };
  });
}

export const BAR_HEIGHT_MIN = 24;
export const BAR_HEIGHT_MAX = 75;

export function buildLastFourMonthBars(entries: ClassLogEntry[], now = new Date()) {
  const months = Array.from({ length: 4 }, (_, i) => {
    const offset = 3 - i;
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const count = countClassesInMonth(entries, d.getFullYear(), d.getMonth());
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      count,
      isCurrent: offset === 0,
    };
  });
  const maxCount = Math.max(...months.map((m) => m.count), 1);
  return months.map((m) => ({
    ...m,
    barHeight:
      m.count === 0
        ? BAR_HEIGHT_MIN
        : BAR_HEIGHT_MIN + (m.count / maxCount) * (BAR_HEIGHT_MAX - BAR_HEIGHT_MIN),
  }));
}
