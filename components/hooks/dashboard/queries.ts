// Dashboard Query Hooks
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { dashboardKeys, DashboardStats, HourlyTraffic, SourceDistribution } from "./keys";
import { getDashboardStats, getHourlyTraffic, getSourceDistribution } from "./apis";
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
