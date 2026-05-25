import type { PracticeLogEntry } from '@/contexts/practice-log-context';
import {
  formatGoalHours,
  startOfWeek,
  sumPracticeHoursInMonth,
  sumPracticeHoursInWeek,
  weekRangeLabel,
} from '@/utils/goal-progress';

export type WeekChartPoint = {
  hours: number;
  rangeStr: string;
  weekStart: Date;
  key: string;
};

export type MonthPracticeChartPoint = {
  hours: number;
  label: string;
  longLabel: string;
  monthIndex: number;
};

export function formatHoursLabel(hours: number): string {
  return formatGoalHours(hours);
}

export function chartMaxForHours(hours: number[]): number {
  const peak = Math.max(...hours, 0.1);
  return Math.max(4, Math.ceil(peak / 2) * 2);
}

export function yTicksForMax(max: number): number[] {
  const step = max / 4;
  return [max, max - step, max - step * 2, max - step * 3, 0].map((v) => {
    const rounded = Math.round(v * 10) / 10;
    return Number.isInteger(rounded) ? rounded : rounded;
  });
}

export function practicePeriodInsightMessage(
  current: number,
  previous: number | null,
  period: 'week' | 'month',
): string {
  const unit = period === 'week' ? 'week' : 'month';
  if (previous === null) {
    return `Practice time is off to a start this ${unit}. Keep the momentum going 🔥`;
  }
  if (current > previous) {
    return `Practice time increased this ${unit}. Keep the momentum going 🔥`;
  }
  if (current < previous) {
    return `Practice time decreased this ${unit}. Keep going ✨`;
  }
  return `Practice time held steady this ${unit}. Keep going ✨`;
}

/** Monday-based weeks from the start of the calendar year through the current week. */
export function buildYearWeeklyChart(
  entries: PracticeLogEntry[],
  now = new Date(),
): WeekChartPoint[] {
  const year = now.getFullYear();
  let weekStart = startOfWeek(new Date(year, 0, 1));
  const endWeek = startOfWeek(now);
  const weeks: WeekChartPoint[] = [];

  while (weekStart.getTime() <= endWeek.getTime()) {
    const start = new Date(weekStart);
    weeks.push({
      hours: sumPracticeHoursInWeek(entries, start),
      rangeStr: weekRangeLabel(start),
      weekStart: start,
      key: `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`,
    });
    weekStart.setDate(weekStart.getDate() + 7);
  }

  return weeks;
}

/** Jan through the current month for the given year. */
export function buildYearMonthlyPracticeChart(
  entries: PracticeLogEntry[],
  now = new Date(),
): MonthPracticeChartPoint[] {
  const year = now.getFullYear();
  const currentMonth = now.getMonth();

  return Array.from({ length: currentMonth + 1 }, (_, month) => {
    const d = new Date(year, month, 1);
    return {
      hours: sumPracticeHoursInMonth(entries, year, month),
      label: d.toLocaleString('en-US', { month: 'short' }),
      longLabel: d.toLocaleString('en-US', { month: 'long' }),
      monthIndex: month,
    };
  });
}
