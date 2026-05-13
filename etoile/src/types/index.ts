export interface YearlyGoal {
  currentMonth: number;
  monthLabel: string;
  yearTotal: number;
  yearLabel: string;
  target: number;
  unit: string;
}

export interface NextClass {
  time: string;
  day: string;
  date: string;
  label: string;
}

export interface MonthlyActivity {
  count: number;
  month: string;
  weekData: number[];
}

export interface StudioVisit {
  name: string;
  count: number;
  color: string;
}

export interface WeeklyHours {
  hours: number;
  dateRange: string;
  weekData: number[];
}
