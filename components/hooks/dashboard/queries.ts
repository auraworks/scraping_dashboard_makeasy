// Dashboard Query Hooks
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { dashboardKeys, DashboardStats, HourlyTraffic, SourceDistribution, DailyTrend, DashboardSummary } from "./keys";
import { getDashboardStats, getHourlyTraffic, getSourceDistribution, getLastCollectionDate, getDailyTrend, getDashboardSummary } from "./apis";
import type { ApiError } from "@/types/database";

// Use Dashboard Stats
export function useDashboardStats(
  options?: Omit<
    UseQueryOptions<DashboardStats, ApiError, DashboardStats, ReturnType<typeof dashboardKeys.stats>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
    ...options,
  });
}

// Use Hourly Traffic
export function useHourlyTraffic(
  options?: Omit<
    UseQueryOptions<HourlyTraffic[], ApiError, HourlyTraffic[], ReturnType<typeof dashboardKeys.hourlyTraffic>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: dashboardKeys.hourlyTraffic(),
    queryFn: getHourlyTraffic,
    ...options,
  });
}

// Use Source Distribution
export function useSourceDistribution(
  options?: Omit<
    UseQueryOptions<SourceDistribution[], ApiError, SourceDistribution[], ReturnType<typeof dashboardKeys.sourceDistribution>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: dashboardKeys.sourceDistribution(),
    queryFn: getSourceDistribution,
    ...options,
  });
}

// Use Last Collection Date
export function useLastCollectionDate(
  options?: Omit<
    UseQueryOptions<string | null, ApiError, string | null, ReturnType<typeof dashboardKeys.lastCollection>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: dashboardKeys.lastCollection(),
    queryFn: getLastCollectionDate,
    ...options,
  });
}

// Use Daily Trend (past 7 days)
export function useDailyTrend(
  options?: Omit<
    UseQueryOptions<DailyTrend[], ApiError, DailyTrend[], ReturnType<typeof dashboardKeys.dailyTrend>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: dashboardKeys.dailyTrend(),
    queryFn: getDailyTrend,
    ...options,
  });
}

// Use Dashboard Summary (combined stats + trend)
export function useDashboardSummary(
  options?: Omit<
    UseQueryOptions<DashboardSummary, ApiError, DashboardSummary, ReturnType<typeof dashboardKeys.summary>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: getDashboardSummary,
    ...options,
  });
}
