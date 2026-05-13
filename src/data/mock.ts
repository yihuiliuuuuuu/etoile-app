import { colors } from '@/src/theme';
import { ClassesSummary } from '@/src/types';

/**
 * Local mock data used while the app has no backend wired up.
 * Numbers and dates match the design reference and will be replaced
 * once a real data source is connected.
 */
export const classesSummary: ClassesSummary = {
  monthLabel: 'May',
  monthShort: 'May',
  monthValue: 8,
  yearLabel: '2026',
  yearValue: 35,
  yearGoal: 100,
  monthlyActivity: [
    { month: 'February', shortMonth: 'Feb', value: 7 },
    { month: 'March', shortMonth: 'Mar', value: 9 },
    { month: 'April', shortMonth: 'Apr', value: 11 },
    { month: 'May', shortMonth: 'May', value: 8 },
  ],
  studios: [
    { id: 'dock-11', name: 'Dock 11 (Most)', color: colors.chart.blue, classes: 14 },
    { id: 'fit-ballet', name: "Fit' Ballet", color: colors.chart.green, classes: 8 },
    {
      id: 'center-of-dance',
      name: 'Center of Dance',
      color: colors.chart.orange,
      classes: 7,
    },
    { id: 'papillon', name: 'Papillon', color: colors.chart.pink, classes: 4 },
    {
      id: 'house-of-healing',
      name: 'House of Healing',
      color: colors.chart.purple,
      classes: 2,
    },
  ],
  nextClass: {
    id: 'next-1',
    studio: 'Monthly Classes',
    title: 'Monthly Classes',
    // June 12, 2026 at 10:00 local time
    startsAt: new Date(2026, 5, 12, 10, 0),
  },
};
