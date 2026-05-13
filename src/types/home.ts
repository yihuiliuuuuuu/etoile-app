export type YearlyGoal = {
  currentCount: number;
  goalCount: number;
  monthLabel: string;
  yearLabel: string;
  monthValue: number;
  yearValue: number;
};

export type NextClass = {
  timeLabel: string;
  dateLabel: string;
  locationLabel: string;
};

export type MonthlyActivity = {
  monthCount: number;
  monthLabel: string;
  /** Relative bar heights 0–1 for last N periods */
  barHeights: number[];
};

export type StudioSlice = {
  id: string;
  name: string;
  color: string;
  percent: number;
};

export type StudiosAttended = {
  slices: StudioSlice[];
};

export type HomeMock = {
  yearlyGoal: YearlyGoal;
  nextClass: NextClass;
  monthlyActivity: MonthlyActivity;
  studiosAttended: StudiosAttended;
};
