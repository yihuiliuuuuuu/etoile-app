export interface YearlyGoal {
  currentMonthValue: number;
  currentMonth: string;
  yearlyTotal: number;
  year: number;
  target: number;
  unit: string;
}

export interface NextClass {
  time: string;
  dayOfWeek: string;
  monthDay: string;
  subtitle: string;
}

export interface MonthlyActivity {
  value: number;
  month: string;
  weekBars: number[];
}

export interface Studio {
  name: string;
  color: string;
  percentage: number;
  isMost?: boolean;
}

export interface WeeklyHours {
  value: number;
  dateRange: string;
  weekBars: number[];
}

export type TabType = 'classes' | 'practice';
