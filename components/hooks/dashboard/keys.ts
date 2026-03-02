// React Query Keys for Dashboard
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  hourlyTraffic: () => [...dashboardKeys.all, "hourlyTraffic"] as const,
  sourceDistribution: () => [...dashboardKeys.all, "sourceDistribution"] as const,
};

// Dashboard Stats Type
export interface DashboardStats {
  totalCount: number;
  todayCount: number;
}

// Hourly Traffic Type
export interface HourlyTraffic {
  hour: string;
  count: number;
}

// Source Distribution Type
export interface SourceDistribution {
  source: string;
  count: number;
}
