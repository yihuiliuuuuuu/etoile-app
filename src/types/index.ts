export type StudioId =
  | 'dock-11'
  | 'fit-ballet'
  | 'center-of-dance'
  | 'papillon'
  | 'house-of-healing';

export interface Studio {
  id: StudioId;
  name: string;
  color: string;
  classes: number;
}

export interface UpcomingClass {
  id: string;
  studio: string;
  title: string;
  startsAt: Date;
}

export interface MonthBucket {
  month: string;
  shortMonth: string;
  value: number;
}

export interface ClassesSummary {
  monthLabel: string;
  monthShort: string;
  monthValue: number;
  yearLabel: string;
  yearValue: number;
  yearGoal: number;
  monthlyActivity: MonthBucket[];
  studios: Studio[];
  nextClass: UpcomingClass;
}
