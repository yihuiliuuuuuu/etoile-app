import type { HomeMock } from '../types/home';

export const homeMock: HomeMock = {
  yearlyGoal: {
    currentCount: 35,
    goalCount: 100,
    monthLabel: 'May',
    yearLabel: '2026',
    monthValue: 8,
    yearValue: 35,
  },
  nextClass: {
    timeLabel: '10:00',
    dateLabel: 'Fri Jun 12',
    locationLabel: 'Monthly Classes',
  },
  monthlyActivity: {
    monthCount: 8,
    monthLabel: 'May',
    barHeights: [0.45, 0.62, 0.55, 1],
  },
  studiosAttended: {
    slices: [
      { id: '1', name: 'Dock 11', color: '#007AFF', percent: 40 },
      { id: '2', name: "Fit' Ballet", color: '#34C759', percent: 20 },
      { id: '3', name: 'Center of Dance', color: '#FF9500', percent: 15 },
      { id: '4', name: 'Papillon', color: '#FFCC00', percent: 5 },
      { id: '5', name: 'House of Healing', color: '#AF52DE', percent: 5 },
    ],
  },
};
