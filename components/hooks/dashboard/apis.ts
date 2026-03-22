// Dashboard API Functions
import { createClient } from "@/lib/supabase/client";
import type { ApiError } from "@/types/database";
import type { DashboardStats, HourlyTraffic, SourceDistribution, DailyTrend } from "./keys";

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
  // DB에 KST 시간이 UTC로 저장되어 있으므로, 로컬 날짜를 그대로 DB 기준 자정으로 사용
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const todayISO = `${todayStr}T00:00:00.000Z`;

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
  // DB에 KST 시간이 UTC로 저장되어 있으므로, 로컬 날짜를 그대로 DB 기준 자정으로 사용
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const todayISO = `${todayStr}T00:00:00.000Z`;

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
      // DB에 KST 시간이 UTC로 잘못 저장되어 있는 경우를 대비하여 9시간을 뺍니다.
      const date = new Date(
        new Date(item.collected_at).getTime() - 9 * 60 * 60 * 1000,
      );
      const hour = date.getHours();
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
  const { data, error } = await supabase.from("datas").select(`
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

// Get last collection date from history table
export async function getLastCollectionDate(): Promise<string | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("history")
    .select("collected_at")
    .eq("event_type", "collection")
    .order("collected_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // No rows
    throw {
      message: error.message,
      code: error.code,
      details: error.details,
    } as ApiError;
  }

  return data?.collected_at ?? null;
}

// Get daily collection counts for the past 7 days
export async function getDailyTrend(): Promise<DailyTrend[]> {
  const supabase = createClient();

  // 7일 전 00:00 (KST)부터 조회
  // DB에 KST 시간이 UTC로 저장되어 있으므로, 로컬 날짜를 그대로 DB 기준 자정으로 사용
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 6);
  const startStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
  const startISO = `${startStr}T00:00:00.000Z`;

  const { data, error } = await supabase
    .from("datas")
    .select("collected_at")
    .gte("collected_at", startISO)
    .not("collected_at", "is", null);

  if (error) {
    throw {
      message: error.message,
      code: error.code,
      details: error.details,
    } as ApiError;
  }

  // KST 기준으로 일별 그룹핑
  const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];
  const counts: Record<string, number> = {};

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    counts[key] = 0;
  }

  data?.forEach((item) => {
    if (item.collected_at) {
      const date = new Date(new Date(item.collected_at).getTime() - 9 * 60 * 60 * 1000);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      if (key in counts) {
        counts[key]++;
      }
    }
  });

  return Object.entries(counts).map(([dateKey, count]) => {
    const [y, m, d] = dateKey.split("-").map(Number);
    const dayOfWeek = new Date(y, m - 1, d).getDay();
    return {
      date: `${String(m).padStart(2, "0")}/${String(d).padStart(2, "0")}`,
      label: dayLabels[dayOfWeek],
      count,
    };
  });
}
