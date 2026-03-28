// Dashboard API Functions
import { createClient } from "@/lib/supabase/client";
import type { ApiError } from "@/types/database";
import type {
  DashboardStats,
  HourlyTraffic,
  SourceDistribution,
  DailyTrend,
  DashboardSummary,
  TrendItem,
} from "./keys";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// Date 객체를 KST 기준으로 변환한 Date를 반환 (로케일 무관)
function toKST(date: Date): Date {
  // UTC 기준 밀리초 + KST 오프셋
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  return new Date(utcMs + KST_OFFSET_MS);
}

// KST 기준 날짜를 "YYYY-MM-DD"로 반환
function getKSTDateString(date: Date = new Date()): string {
  const kst = toKST(date);
  const y = kst.getFullYear();
  const m = String(kst.getMonth() + 1).padStart(2, "0");
  const d = String(kst.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// KST 기준 오늘 자정을 UTC ISO 문자열로 반환
function getKSTMidnightISO(date: Date = new Date()): string {
  const kst = toKST(date);
  const y = kst.getFullYear();
  const m = kst.getMonth();
  const d = kst.getDate();
  // KST 자정 = UTC 기준 9시간 전
  const kstMidnight = new Date(Date.UTC(y, m, d, 0, 0, 0) - KST_OFFSET_MS);
  return kstMidnight.toISOString();
}

// UTC 타임스탬프를 KST 기준 시간으로 반환
function getKSTHour(utcDate: Date): number {
  return toKST(utcDate).getHours();
}

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

  // KST 기준 오늘 자정(UTC)부터 카운트
  const todayISO = getKSTMidnightISO();

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

// Get hourly collection data for today (KST)
export async function getHourlyTraffic(): Promise<HourlyTraffic[]> {
  const supabase = createClient();

  // KST 기준 오늘 자정(UTC)부터 조회
  const todayISO = getKSTMidnightISO();

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

  // KST 기준으로 시간대별 그룹핑
  const hourCounts: Record<number, number> = {};
  for (let i = 0; i < 24; i++) {
    hourCounts[i] = 0;
  }

  data?.forEach((item) => {
    if (item.collected_at) {
      hourCounts[getKSTHour(new Date(item.collected_at))]++;
    }
  });

  // 4시간 단위 7개 구간으로 집계
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

// 대시보드 요약: total, today, yesterday, daily trend
// RPC를 사용해 Supabase 기본 1000행 제한 우회
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const supabase = createClient();

  // 전체 건수
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

  // 최근 7일 범위 계산 (KST 기준)
  const now = new Date();
  const trendStartDate = new Date(now);
  trendStartDate.setDate(trendStartDate.getDate() - 6);

  // trendStart의 KST 자정(UTC)부터 지금까지
  const startISO = getKSTMidnightISO(trendStartDate);

  // 내일 KST 자정(UTC)을 end로 설정해 오늘 전체 포함
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const endISO = getKSTMidnightISO(tomorrowDate);

  // RPC로 일별 집계 (행 수 제한 없이 정확한 COUNT)
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "get_daily_collection_counts",
    { start_date: startISO, end_date: endISO },
  );

  if (rpcError) {
    throw {
      message: rpcError.message,
      code: rpcError.code,
      details: rpcError.details,
    } as ApiError;
  }

  // RPC 결과를 날짜 키 맵으로 변환
  const counts: Record<string, number> = {};
  (rpcData as { kst_date: string; cnt: number }[] | null)?.forEach((row) => {
    counts[row.kst_date] = Number(row.cnt);
  });

  // 최근 7일 트렌드 빌드
  const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];
  const dailyTrend: DailyTrend[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(trendStartDate);
    d.setDate(d.getDate() + i);
    const dateKey = getKSTDateString(d);
    const [y, m, dd] = dateKey.split("-").map(Number);
    const dayOfWeek = new Date(y, m - 1, dd).getDay();
    dailyTrend.push({
      date: `${String(m).padStart(2, "0")}/${String(dd).padStart(2, "0")}`,
      label: dayLabels[dayOfWeek],
      count: counts[dateKey] || 0,
    });
  }

  const todayCount = dailyTrend[dailyTrend.length - 1]?.count || 0;
  const yesterdayCount =
    dailyTrend.length >= 2 ? dailyTrend[dailyTrend.length - 2].count : 0;

  return {
    totalCount: totalCount || 0,
    todayCount,
    yesterdayCount,
    dailyTrend,
  };
}

// Get daily collection counts for the past 7 days (KST)
export async function getDailyTrend(): Promise<DailyTrend[]> {
  const summary = await getDashboardSummary();
  return summary.dailyTrend;
}

// Get weekly collection counts (last 4 weeks)
export async function getWeeklyTrend(): Promise<TrendItem[]> {
  const supabase = createClient();
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 27);

  const startISO = getKSTMidnightISO(startDate);
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const endISO = getKSTMidnightISO(tomorrowDate);

  const { data: rpcData, error } = await supabase.rpc("get_daily_collection_counts", {
    start_date: startISO,
    end_date: endISO,
  });

  if (error) throw { message: error.message, code: error.code, details: error.details } as ApiError;

  const counts: Record<string, number> = {};
  (rpcData as { kst_date: string; cnt: number }[] | null)?.forEach((row) => {
    counts[row.kst_date] = Number(row.cnt);
  });

  const weeks: TrendItem[] = [];
  for (let w = 3; w >= 0; w--) {
    let weekCount = 0;
    const weekEndDate = new Date(now);
    weekEndDate.setDate(weekEndDate.getDate() - w * 7);
    const weekStartDate = new Date(weekEndDate);
    weekStartDate.setDate(weekStartDate.getDate() - 6);

    for (let d = 0; d < 7; d++) {
      const day = new Date(weekStartDate);
      day.setDate(day.getDate() + d);
      weekCount += counts[getKSTDateString(day)] || 0;
    }

    const m = String(weekEndDate.getMonth() + 1).padStart(2, "0");
    const dd = String(weekEndDate.getDate()).padStart(2, "0");
    weeks.push({ label: `~${m}/${dd}`, count: weekCount });
  }

  return weeks;
}

// 정보원 국가별 분포
export async function getSourceCountByCountry(): Promise<SourceDistribution[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("sources").select("country");
  if (error) throw { message: error.message, code: error.code, details: error.details } as ApiError;

  const counts: Record<string, number> = {};
  data?.forEach((row) => {
    const key = (row.country as string) || "미분류";
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
}

// 정보원 유형1별 분포
export async function getSourceCountByCat1(): Promise<SourceDistribution[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("sources").select("category");
  if (error) throw { message: error.message, code: error.code, details: error.details } as ApiError;

  const counts: Record<string, number> = {};
  data?.forEach((row) => {
    const cat = Array.isArray(row.category) ? (row.category[0] as string) : null;
    const key = cat || "미분류";
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
}

// 정보원 유형2별 분포
export async function getSourceCountByCat2(): Promise<SourceDistribution[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("sources").select("category");
  if (error) throw { message: error.message, code: error.code, details: error.details } as ApiError;

  const counts: Record<string, number> = {};
  data?.forEach((row) => {
    const cat = Array.isArray(row.category) ? (row.category[1] as string) : null;
    const key = cat || "미분류";
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
}

// Get monthly collection counts (last 12 months)
export async function getMonthlyTrend(): Promise<TrendItem[]> {
  const supabase = createClient();
  const now = new Date();
  const kstNow = toKST(now);

  const startDate = new Date(now);
  startDate.setMonth(startDate.getMonth() - 11);
  startDate.setDate(1);

  const startISO = getKSTMidnightISO(startDate);
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const endISO = getKSTMidnightISO(tomorrowDate);

  const { data: rpcData, error } = await supabase.rpc("get_daily_collection_counts", {
    start_date: startISO,
    end_date: endISO,
  });

  if (error) throw { message: error.message, code: error.code, details: error.details } as ApiError;

  const monthCounts: Record<string, number> = {};
  (rpcData as { kst_date: string; cnt: number }[] | null)?.forEach((row) => {
    const monthKey = row.kst_date.substring(0, 7);
    monthCounts[monthKey] = (monthCounts[monthKey] || 0) + Number(row.cnt);
  });

  const months: TrendItem[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(kstNow.getFullYear(), kstNow.getMonth() - i, 1);
    const m = d.getMonth() + 1;
    const key = `${d.getFullYear()}-${String(m).padStart(2, "0")}`;
    months.push({ label: `${String(m).padStart(2, "0")}월`, count: monthCounts[key] || 0 });
  }

  return months;
}
