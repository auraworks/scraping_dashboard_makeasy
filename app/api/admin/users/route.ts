import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// Verify the requesting user is authenticated
async function verifyAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

// GET /api/admin/users — list users with optional search and pagination
export async function GET(request: NextRequest) {
  const authUser = await verifyAuth();
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.listUsers({
    page,
    perPage: 1000, // fetch all to apply search filter client-side
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let users = data.users;

  if (search) {
    const lower = search.toLowerCase();
    users = users.filter(
      (u) =>
        u.email?.toLowerCase().includes(lower) ||
        (u.user_metadata?.name as string | undefined)
          ?.toLowerCase()
          .includes(lower)
    );
  }

  const total = users.length;
  const totalPages = Math.ceil(total / pageSize);
  const from = (page - 1) * pageSize;
  const paged = users.slice(from, from + pageSize);

  return NextResponse.json({ data: paged, total, page, pageSize, totalPages });
}

// POST /api/admin/users — create a new user
export async function POST(request: NextRequest) {
  const authUser = await verifyAuth();
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { email, password, name } = body as {
    email: string;
    password: string;
    name?: string;
  };

  if (!email || !password) {
    return NextResponse.json(
      { error: "이메일과 비밀번호는 필수입니다." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: name ? { name } : {},
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data: data.user }, { status: 201 });
}
