export interface YearlyGoal {
  monthValue: number;    // this month's count (left stat)
  yearValue: number;     // year-to-date total (right stat)
  totalGoal: number;
  unit: 'classes' | 'hrs';
  month: string;
  year: number;
}

export interface NextClass {
  time: string;
  dayOfWeek: string;
  month: string;
  day: number;
  seriesName: string;
}

export interface BarChartData {
  label: string;
  value: number;
  isActive?: boolean;
}

export interface MonthlyActivity {
  month: string;
  value: number;
  bars: BarChartData[];
}

export interface WeeklyActivity {
  weekRange: string;
  value: number;
  bars: BarChartData[];
}

export interface Studio {
  name: string;
  color: string;
  percentage: number;
}

export interface StudiosAttended {
  studios: Studio[];
}

export interface ClassesData {
  yearlyGoal: YearlyGoal;
  nextClass: NextClass;
  monthlyActivity: MonthlyActivity;
  studiosAttended: StudiosAttended;
}

export interface PracticeData {
  yearlyGoal: YearlyGoal;
  monthlyHours: MonthlyActivity;
  weeklyHours: WeeklyActivity;
}
