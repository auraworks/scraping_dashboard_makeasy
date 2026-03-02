// Dashboard API Functions
import { createClient } from "@/lib/supabase/client";
import type { ApiError } from "@/types/database";
import type { DashboardStats, HourlyTraffic, SourceDistribution } from "./keys";

// Get total data count and today's count
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();

  // Get total count
  const { count: totalCount, error: totalError } = await supabase
    .from("datas")
    .select("*", { count: "exact", head: true });

  if (totalError) {
    throw {
      message: totalError.message,
      code: totalError.code,
      details: totalError.details,
    } as ApiError;
  }

  // Get today's count (using collected_at field)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const { count: todayCount, error: todayError } = await supabase
    .from("datas")
    .select("*", { count: "exact", head: true })
    .gte("collected_at", todayISO);

  if (todayError) {
    throw {
      message: todayError.message,
      code: todayError.code,
      details: todayError.details,
    } as ApiError;
  }

  return {
    totalCount: totalCount || 0,
    todayCount: todayCount || 0,
  };
}

// Get hourly collection data for today
export async function getHourlyTraffic(): Promise<HourlyTraffic[]> {
  const supabase = createClient();

  // Get today's data with collected_at
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const { data, error } = await supabase
    .from("datas")
    .select("collected_at")
    .gte("collected_at", todayISO)
    .not("collected_at", "is", null);

  if (error) {
    throw {
      message: error.message,
      code: error.code,
      details: error.details,
    } as ApiError;
  }

  // Group by hour
  const hourCounts: Record<number, number> = {};
  for (let i = 0; i < 24; i++) {
    hourCounts[i] = 0;
  }

  data?.forEach((item) => {
    if (item.collected_at) {
      const hour = new Date(item.collected_at).getHours();
      hourCounts[hour]++;
    }
  });

  // Return in chart format (every 4 hours for 7 data points)
  const result: HourlyTraffic[] = [];
  const labels = ["00시", "04시", "08시", "12시", "16시", "20시", "24시"];
  for (let i = 0; i < 7; i++) {
    const hourStart = i * 4;
    let sum = 0;
    for (let h = hourStart; h < hourStart + 4 && h < 24; h++) {
      sum += hourCounts[h] || 0;
    }
    result.push({
      hour: labels[i],
      count: sum,
    });
  }

  return result;
}

// Get source distribution
export async function getSourceDistribution(): Promise<SourceDistribution[]> {
  const supabase = createClient();

  // Get all data with source names
  const { data, error } = await supabase
    .from("datas")
    .select(`
      id,
      sources (
        name
      )
    `);

  if (error) {
    throw {
      message: error.message,
      code: error.code,
      details: error.details,
    } as ApiError;
  }

  // Count by source name
  const sourceCounts: Record<string, number> = {};

  data?.forEach((item) => {
    const sources = item.sources as unknown as { name: string | null } | null;
    const sourceName = sources?.name || "기타";
    sourceCounts[sourceName] = (sourceCounts[sourceName] || 0) + 1;
  });

  // Convert to array and sort by count
  const result = Object.entries(sourceCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  return result;
}
