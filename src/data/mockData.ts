import { YearlyGoal, NextClass, MonthlyActivity, Studio, WeeklyHours } from '../types';
import { colors } from '../theme';

export const classesGoal: YearlyGoal = {
  currentMonthValue: 8,
  currentMonth: 'May',
  yearlyTotal: 35,
  year: 2026,
  target: 100,
  unit: 'classes',
};

export const practiceGoal: YearlyGoal = {
  currentMonthValue: 5,
  currentMonth: 'May',
  yearlyTotal: 125.5,
  year: 2026,
  target: 400,
  unit: 'hrs',
};

export const nextClass: NextClass = {
  time: '10:00',
  dayOfWeek: 'Fri',
  monthDay: 'Jun 12',
  subtitle: 'Monthly Classes',
};

export const classesMonthlyActivity: MonthlyActivity = {
  value: 8,
  month: 'May',
  weekBars: [0.6, 0.85, 0.75, 1.0],
};

export const practiceMonthlyHours: MonthlyActivity = {
  value: 40,
  month: 'May',
  weekBars: [0.6, 0.85, 0.75, 1.0],
};

export const practiceWeeklyHours: WeeklyHours = {
  value: 5,
  dateRange: 'May 2–9',
  weekBars: [0.6, 0.85, 0.75, 1.0],
};

export const studiosAttended: Studio[] = [
  { name: 'Dock 11', color: colors.studios.dock11, percentage: 35, isMost: true },
  { name: "Fit' Ballet", color: colors.studios.fitBallet, percentage: 25 },
  { name: 'Center of Dance', color: colors.studios.centerOfDance, percentage: 20 },
  { name: 'Papillon', color: '#F5A623', percentage: 12 },
  { name: 'House of Healing', color: colors.studios.houseOfHealing, percentage: 8 },
];
