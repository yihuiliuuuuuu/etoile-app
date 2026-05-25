import type { GoalCycle } from '@/contexts/goals-context';
import type { ClassLogEntry } from '@/contexts/class-log-context';
import type { PracticeLogEntry } from '@/contexts/practice-log-context';
import { countClassesInMonth } from '@/utils/class-month-activity';

export function startOfWeek(d: Date): Date {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - diff);
  return copy;
}

export function weekRangeLabel(weekStart: Date): string {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  if (weekStart.getMonth() === end.getMonth()) {
    const month = weekStart.toLocaleString('en-US', { month: 'short' });
    return `${month} ${weekStart.getDate()}–${end.getDate()}`;
  }
  const startFmt = weekStart.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  const endFmt = end.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  return `${startFmt}–${endFmt}`;
}

export function formatGoalHours(hours: number): string {
  const rounded = Math.round(hours * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export type GoalCardStats = {
  periodDisplay: string;
  periodLabel: string;
  yearDisplay: string;
  yearLabel: string;
  progressValue: number;
  progressTarget: number;
  progressPct: number;
};

function progressPct(value: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((value / target) * 100));
}

function countClassesInWeek(entries: ClassLogEntry[], weekStart: Date): number {
  const start = weekStart.getTime();
  const end = start + 7 * 24 * 60 * 60 * 1000;
  return entries.filter((e) => {
    const t = new Date(e.dateTimeISO).getTime();
    return !Number.isNaN(t) && t >= start && t < end;
  }).length;
}

function countClassesInYear(entries: ClassLogEntry[], year: number): number {
  return entries.filter((e) => {
    const d = new Date(e.dateTimeISO);
    return !Number.isNaN(d.getTime()) && d.getFullYear() === year;
  }).length;
}

export function sumPracticeHoursInWeek(entries: PracticeLogEntry[], weekStart: Date): number {
  const start = weekStart.getTime();
  const end = start + 7 * 24 * 60 * 60 * 1000;
  const totalMinutes = entries.reduce((sum, e) => {
    const t = new Date(e.dateISO).getTime();
    if (Number.isNaN(t) || t < start || t >= end) return sum;
    return sum + e.durationMinutes;
  }, 0);
  return totalMinutes / 60;
}

export function sumPracticeHoursInMonth(
  entries: PracticeLogEntry[],
  year: number,
  month: number,
): number {
  const totalMinutes = entries.reduce((sum, e) => {
    const d = new Date(e.dateISO);
    if (Number.isNaN(d.getTime()) || d.getFullYear() !== year || d.getMonth() !== month) return sum;
    return sum + e.durationMinutes;
  }, 0);
  return totalMinutes / 60;
}

function sumPracticeHoursInYear(entries: PracticeLogEntry[], year: number): number {
  const totalMinutes = entries.reduce((sum, e) => {
    const d = new Date(e.dateISO);
    if (Number.isNaN(d.getTime()) || d.getFullYear() !== year) return sum;
    return sum + e.durationMinutes;
  }, 0);
  return totalMinutes / 60;
}

function periodMetaForCycle(cycle: GoalCycle, now: Date) {
  const monthLabel = now.toLocaleString('en-US', { month: 'short' });
  const weekStart = startOfWeek(now);

  switch (cycle) {
    case 'weekly':
      return { weekStart, snapshotLabel: weekRangeLabel(weekStart) };
    case 'monthly':
    case 'yearly':
      return { weekStart, snapshotLabel: monthLabel };
  }
}

export function getClassGoalCardStats(
  entries: ClassLogEntry[],
  cycle: GoalCycle,
  target: number,
  now = new Date(),
): GoalCardStats {
  const year = now.getFullYear();
  const month = now.getMonth();
  const meta = periodMetaForCycle(cycle, now);

  const yearValue = countClassesInYear(entries, year);
  const monthValue = countClassesInMonth(entries, year, month);
  const weekValue = countClassesInWeek(entries, meta.weekStart);

  let periodValue: number;
  let progressValue: number;

  switch (cycle) {
    case 'weekly':
      periodValue = weekValue;
      progressValue = weekValue;
      break;
    case 'monthly':
      periodValue = monthValue;
      progressValue = monthValue;
      break;
    case 'yearly':
      periodValue = monthValue;
      progressValue = yearValue;
      break;
  }

  const periodLabel = cycle === 'weekly' ? meta.snapshotLabel : 'This month';
  const yearLabel = 'This year';

  return {
    periodDisplay: String(periodValue),
    periodLabel,
    yearDisplay: String(yearValue),
    yearLabel,
    progressValue,
    progressTarget: target,
    progressPct: progressPct(progressValue, target),
  };
}

export function getPracticeGoalCardStats(
  entries: PracticeLogEntry[],
  cycle: GoalCycle,
  target: number,
  now = new Date(),
): GoalCardStats {
  const year = now.getFullYear();
  const month = now.getMonth();
  const meta = periodMetaForCycle(cycle, now);

  const yearValue = sumPracticeHoursInYear(entries, year);
  const monthValue = sumPracticeHoursInMonth(entries, year, month);
  const weekValue = sumPracticeHoursInWeek(entries, meta.weekStart);

  let periodValue: number;
  let progressValue: number;

  switch (cycle) {
    case 'weekly':
      periodValue = weekValue;
      progressValue = weekValue;
      break;
    case 'monthly':
      periodValue = monthValue;
      progressValue = monthValue;
      break;
    case 'yearly':
      periodValue = monthValue;
      progressValue = yearValue;
      break;
  }

  const periodLabel = cycle === 'weekly' ? meta.snapshotLabel : 'This month';
  const yearLabel = 'This year';

  return {
    periodDisplay: formatGoalHours(periodValue),
    periodLabel,
    yearDisplay: formatGoalHours(yearValue),
    yearLabel,
    progressValue,
    progressTarget: target,
    progressPct: progressPct(progressValue, target),
  };
}
