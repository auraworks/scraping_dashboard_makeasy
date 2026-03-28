# 계정 관리 기능 구축 계획

## Requirements Summary

현재 정보원 관리(`/sources`) 페이지의 **테이블 검색 + 행 클릭 → 상세 페이지** 패턴을 그대로 차용하여, 시스템에 로그인할 수 있는 계정을 관리하는 `/accounts` 섹션을 신규 구축한다.

- Supabase Admin API (`service_role` key) 로 계정 CRUD
- 계정 목록 조회, 검색, 신규 생성(초대/등록), 상세 조회, 수정, 비활성화
- 회원가입 링크 공유: 신규 사용자가 직접 등록할 수 있는 초대 URL 생성

---

## Acceptance Criteria

- [ ] `/accounts` 목록 페이지: 이메일 검색, 전체 계정 테이블, 행 클릭 시 상세 이동
- [ ] `/accounts/new` 페이지: 이메일+비밀번호로 계정 직접 생성 가능
- [ ] `/accounts/[id]` 페이지: 계정 상세 조회 및 비밀번호 재설정, 메타데이터(이름) 수정
- [ ] 사이드바에 "계정 관리" 메뉴 항목 추가 (`/accounts`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 는 Next.js API Route (서버) 에서만 사용, 브라우저 노출 없음
- [ ] 기존 hooks 패턴(apis → keys → queries → mutations) 동일하게 적용
- [ ] 계정 생성 시 이메일 인증 없이 즉시 활성화 (`email_confirm: true`)
- [ ] 계정 목록에 생성일, 마지막 로그인, 이메일 확인 여부 표시

---

## Implementation Steps

### Step 1 — Admin Supabase Client (서버 전용)

**File:** `lib/supabase/admin.ts` (신규)

```typescript
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // 서버 전용, NEXT_PUBLIC 아님
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
```

---

### Step 2 — API Routes (Next.js Route Handlers)

Service role key 는 서버사이드에서만 사용. 브라우저 클라이언트는 이 API Routes 를 호출.

**`app/api/admin/users/route.ts`** (신규)
- `GET` → `supabase.auth.admin.listUsers()` → 이메일 검색, 페이지네이션
- `POST` → `supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name } })`

**`app/api/admin/users/[id]/route.ts`** (신규)
- `GET` → `supabase.auth.admin.getUserById(id)`
- `PUT` → `supabase.auth.admin.updateUserById(id, { password?, user_metadata? })`
- `DELETE` → `supabase.auth.admin.deleteUser(id)` (또는 ban 처리)

> **보안:** API Route 내부에서 현재 세션 유저가 인증된 사용자인지 확인 (서버 클라이언트로 세션 검증)

---

### Step 3 — Hooks

`components/hooks/accounts/` 디렉토리 (신규), 기존 sources hooks 패턴 동일 적용.

**`keys.ts`**
```typescript
export const accountQueryKeys = {
  all: ["accounts"],
  lists: () => [...accountQueryKeys.all, "list"],
  list: (filters) => [...accountQueryKeys.lists(), filters],
  details: () => [...accountQueryKeys.all, "detail"],
  detail: (id) => [...accountQueryKeys.details(), id],
};
```

**`apis.ts`**
- `getAccountList({ search, page, pageSize })` → `fetch("/api/admin/users?...")`
- `getAccountDetail(id)` → `fetch("/api/admin/users/{id}")`
- `createAccount(data)` → `fetch("/api/admin/users", { method: "POST", body })`
- `updateAccount(id, data)` → `fetch("/api/admin/users/{id}", { method: "PUT", body })`
- `deleteAccount(id)` → `fetch("/api/admin/users/{id}", { method: "DELETE" })`

**`queries.ts`** — `useAccountList(params)`, `useAccountDetail(id)`

**`mutations.ts`** — `useCreateAccount()`, `useUpdateAccount()`, `useDeleteAccount()`

**`index.ts`** — re-export

---

### Step 4 — 계정 목록 페이지

**`app/(dashboard)/accounts/page.tsx`** (신규)

정보원 목록 페이지(`app/(dashboard)/sources/page.tsx`) 구조 그대로 차용:
- 상단 검색바 (이메일 검색)
- 테이블 컬럼: No, 이메일, 이름, 이메일 확인, 마지막 로그인, 생성일, 상태
- 행 클릭 → `/accounts/{id}`
- 우상단 "새 계정 추가" 버튼 → `/accounts/new`
- 페이지네이션 (10개/페이지)
- 로딩/에러 상태 처리

---

### Step 5 — 계정 생성 페이지

**`app/(dashboard)/accounts/new/page.tsx`** (신규)
**`components/accounts/AccountForm.tsx`** (신규)

AccountForm 필드:
- 이메일 (required, email 형식)
- 이름 (optional)
- 비밀번호 (required, min 8자)
- 비밀번호 확인 (required)

Form validation: React Hook Form + Zod
생성 성공 시: `/accounts/{id}` 로 리다이렉트 또는 `/accounts` 목록으로 이동

---

### Step 6 — 계정 상세/수정 페이지

**`app/(dashboard)/accounts/[id]/page.tsx`** (신규)

- 헤더: "계정 상세 정보" + 계정 이메일
- `useAccountDetail(id)` 로 데이터 fetch
- AccountForm 을 수정 모드로 표시 (`isEdit={true}`)

수정 모드 AccountForm 필드:
- 이메일 (읽기전용, 변경 불가)
- 이름 (수정 가능)
- 새 비밀번호 (선택 — 입력 시 변경)
- 비밀번호 확인 (선택)
- 계정 상태: 활성 / 비활성(ban)

---

### Step 7 — 사이드바 업데이트

**`components/layout/Sidebar/Sidebar.tsx`** (수정)

menuItems 배열에 추가:
```typescript
{ id: "accounts", label: "계정 관리", href: "/accounts" },
```

위치: "시스템 설정" 위, "로그 관리" 아래

---

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Service role key 브라우저 노출 | NEXT_PUBLIC_ 접두사 없이 환경변수 설정, API Route 서버사이드에서만 사용 |
| 권한 없는 사용자의 admin API 접근 | API Route 내에서 세션 검증 (서버 Supabase client로 auth.getUser()) |
| 계정 삭제 시 데이터 무결성 | 삭제 대신 ban 처리를 기본값으로, 삭제는 명시적 확인 후 진행 |
| Supabase admin.listUsers() 페이지네이션 | API 응답의 nextPage 토큰 활용 또는 page/perPage 파라미터 사용 |

---

## Verification Steps

1. `npm run build` 통과 (TypeScript 오류 없음)
2. `/accounts` 목록 페이지 로드 및 검색 기능 동작 확인
3. `/accounts/new` 에서 신규 계정 생성 → Supabase Auth 대시보드에서 확인
4. `/accounts/{id}` 상세 페이지 로드 및 이름/비밀번호 수정 확인
5. 사이드바 "계정 관리" 링크 클릭 시 정상 이동
6. 브라우저 Network 탭에서 `SUPABASE_SERVICE_ROLE_KEY` 노출 없음 확인

---

## File Creation Checklist

- [ ] `lib/supabase/admin.ts`
- [ ] `app/api/admin/users/route.ts`
- [ ] `app/api/admin/users/[id]/route.ts`
- [ ] `components/hooks/accounts/keys.ts`
- [ ] `components/hooks/accounts/apis.ts`
- [ ] `components/hooks/accounts/queries.ts`
- [ ] `components/hooks/accounts/mutations.ts`
- [ ] `components/hooks/accounts/index.ts`
- [ ] `components/accounts/AccountForm.tsx`
- [ ] `app/(dashboard)/accounts/page.tsx`
- [ ] `app/(dashboard)/accounts/new/page.tsx`
- [ ] `app/(dashboard)/accounts/[id]/page.tsx`
- [ ] `components/layout/Sidebar/Sidebar.tsx` (수정)
