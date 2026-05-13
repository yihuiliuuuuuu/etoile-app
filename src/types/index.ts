export interface UserProfile {
  firstName: string;
  initials: string;
  avatarUri?: string;
}

export interface DailyPractice {
  date: string;
  minutes: number;
}

export interface TodayPractice {
  minutes: number;
  goalMinutes: number;
  focusLabel: string;
  detail: string;
}

export interface WeekSummary {
  /** 7 entries, Monday → Sunday. */
  days: DailyPractice[];
  /** Length of the current consecutive-day practice streak. */
  streak: number;
}

export interface HomeSnapshot {
  user: UserProfile;
  today: TodayPractice;
  week: WeekSummary;
  goalMinutesPerDay: number;
}
