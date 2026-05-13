import { HomeSnapshot } from '@/src/types';

/**
 * Local mock data used while the app has no backend wired up. Replace
 * this single file with a real data source and the UI will keep working.
 */
export const homeSnapshot: HomeSnapshot = {
  user: {
    firstName: 'Émilie',
    initials: 'EM',
    avatarUri:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80&auto=format&fit=crop',
  },
  goalMinutesPerDay: 60,
  today: {
    minutes: 42,
    goalMinutes: 60,
    focusLabel: "Today's focus",
    detail: 'Adagio · Centre work',
  },
  week: {
    streak: 5,
    days: [
      { date: '2026-05-04', minutes: 55 },
      { date: '2026-05-05', minutes: 30 },
      { date: '2026-05-06', minutes: 65 },
      { date: '2026-05-07', minutes: 45 },
      { date: '2026-05-08', minutes: 50 },
      { date: '2026-05-09', minutes: 0 },
      { date: '2026-05-10', minutes: 42 },
    ],
  },
};

/**
 * Daily greeting based on the local hour. Kept here so screens stay
 * presentational and easy to swap to a real i18n / data source later.
 */
export function greetingForHour(hour: number): string {
  if (hour < 5) return 'Still dancing';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Bonne nuit';
}
