import { YearlyGoal, NextClass, MonthlyActivity, StudioVisit, WeeklyHours } from '../types';

export const classesGoal: YearlyGoal = {
  currentMonth: 8,
  monthLabel: 'May',
  yearTotal: 35,
  yearLabel: '2026',
  target: 100,
  unit: 'classes',
};

export const practiceGoal: YearlyGoal = {
  currentMonth: 5,
  monthLabel: 'May',
  yearTotal: 125.5,
  yearLabel: '2026',
  target: 400,
  unit: 'hrs',
};

export const nextClass: NextClass = {
  time: '10:00',
  day: 'Fri',
  date: 'Jun 12',
  label: 'Monthly Classes',
};

export const classesMonthlyActivity: MonthlyActivity = {
  count: 8,
  month: 'May',
  weekData: [0.3, 0.55, 0.7, 0.85, 1.0],
};

export const practiceMonthlyHours: MonthlyActivity = {
  count: 40,
  month: 'May',
  weekData: [0.3, 0.55, 0.7, 0.85, 1.0],
};

export const practiceWeeklyHours: WeeklyHours = {
  hours: 5,
  dateRange: 'May 2–9',
  weekData: [0.3, 0.55, 0.7, 0.85, 1.0],
};

export const studiosAttended: StudioVisit[] = [
  { name: 'Dock 11', count: 12, color: '#2563EB' },
  { name: "Fit' Ballet", count: 8, color: '#16A34A' },
  { name: 'Center of Dance', count: 5, color: '#EAB308' },
  { name: 'Papillon', count: 3, color: '#F59E0B' },
  { name: 'House of Healing', count: 2, color: '#7C3AED' },
];
