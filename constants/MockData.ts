import { Colors } from './Colors';
import { ClassesData, PracticeData } from '../types';

export const classesData: ClassesData = {
  yearlyGoal: {
    monthValue: 8,
    yearValue: 35,
    totalGoal: 100,
    unit: 'classes',
    month: 'May',
    year: 2026,
  },
  nextClass: {
    time: '10:00',
    dayOfWeek: 'Fri',
    month: 'Jun',
    day: 12,
    seriesName: 'Monthly Classes',
  },
  monthlyActivity: {
    month: 'May',
    value: 8,
    bars: [
      { label: 'Jan', value: 12, isActive: false },
      { label: 'Feb', value: 9,  isActive: false },
      { label: 'Mar', value: 14, isActive: false },
      { label: 'Apr', value: 11, isActive: false },
      { label: 'May', value: 8,  isActive: true  },
    ],
  },
  studiosAttended: {
    studios: [
      { name: "Dock 11",        color: Colors.studio1, percentage: 40 },
      { name: "Fit' Ballet",    color: Colors.studio2, percentage: 22 },
      { name: "Center of Dance",color: Colors.studio3, percentage: 18 },
      { name: "Papillon",       color: Colors.studio4, percentage: 10 },
      { name: "House of Healing",color: Colors.studio5, percentage: 10 },
    ],
  },
};

export const practiceData: PracticeData = {
  yearlyGoal: {
    monthValue: 5,
    yearValue: 125.5,
    totalGoal: 400,
    unit: 'hrs',
    month: 'May',
    year: 2026,
  },
  monthlyHours: {
    month: 'May',
    value: 40,
    bars: [
      { label: 'Jan', value: 38, isActive: false },
      { label: 'Feb', value: 32, isActive: false },
      { label: 'Mar', value: 44, isActive: false },
      { label: 'Apr', value: 36, isActive: false },
      { label: 'May', value: 40, isActive: true  },
    ],
  },
  weeklyHours: {
    weekRange: 'May 2–9',
    value: 5,
    bars: [
      { label: 'W1', value: 8,  isActive: false },
      { label: 'W2', value: 10, isActive: false },
      { label: 'W3', value: 7,  isActive: false },
      { label: 'W4', value: 9,  isActive: false },
      { label: 'W5', value: 5,  isActive: true  },
    ],
  },
};
