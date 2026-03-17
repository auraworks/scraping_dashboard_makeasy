import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("logs")
    .select(
      `
        *,
        sources (
          name
        )
      `
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: "로그를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
