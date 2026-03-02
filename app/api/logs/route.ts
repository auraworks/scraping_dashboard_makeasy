import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const safePageSize = Number.isNaN(pageSize) || pageSize < 1 ? 10 : pageSize;
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  const supabase = await createClient();

  let query = supabase
    .from("logs")
    .select(
      `
        *,
        sources (
          name
        )
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`message.ilike.%${search}%,url.ilike.%${search}%`);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    return NextResponse.json(
      {
        data: [],
        total: 0,
        page: safePage,
        pageSize: safePageSize,
        totalPages: 0,
      },
      { status: 400 },
    );
  }

  const total = count || 0;

  return NextResponse.json({
    data: data || [],
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.ceil(total / safePageSize),
  });
}
