export enum RepoActions {
  PR_OPEN = "PR Open",
  PR_MERGED = "PR Merged",
  COMMITS = "Commits",
  PR_REVIEWED = "PR Reviewed",
  PR_COMMENTS = "PR Comments",
  INCIDENT_ALERTS = "Incident Alerts",
  INCIDENT_RESOLVED = "Incidents Resolved"
}

export interface Activity {
  label: RepoActions;
  fillColor: string;
}

interface ActiveDays {
  days: number;
  insight: string[];
  isBurnOut: boolean;
}

export interface TotalActivity {
  name: RepoActions;
  value: string;
}

export interface Items {
  count: string;
  fillColor: string;
  label: RepoActions;
}

export interface DayWiseActivity {
  date: Date;
  items: { children: Items[]}
}

export interface Row {
  name: string;
  totalActivity: TotalActivity[];
  activeDays: ActiveDays;
  dayWiseActivity: DayWiseActivity[];
}