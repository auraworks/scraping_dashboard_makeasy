# 유형 관리 2뎁스 UI 재구성 계획

## Requirements Summary

- 유형을 **유형1(상위) / 유형2(하위)** 2단계 계층으로 관리
- `/categories` 페이지를 **두 카드가 가로로 나란히** 배치된 UI로 전면 재설계
  - 왼쪽 카드: 유형1 목록 + 추가/삭제
  - 오른쪽 카드: 선택된 유형1의 유형2 목록 + 추가/삭제
- 기존 `/categories/new`, `/categories/[id]` 라우트는 더 이상 사용하지 않음 (페이지 내 인라인 처리)

---

## Acceptance Criteria

- [ ] `categories` 테이블에 `parent_id uuid REFERENCES categories(id)` 컬럼 추가 (Supabase migration)
- [ ] 유형1: `parent_id IS NULL` 인 행
- [ ] 유형2: `parent_id = <유형1.id>` 인 행
- [ ] 왼쪽 카드에서 유형1 목록 표시, 클릭 시 선택(하이라이트)
- [ ] 선택된 유형1에 속한 유형2가 오른쪽 카드에 표시
- [ ] 각 카드 하단 인라인 입력 + 추가 버튼으로 항목 추가
- [ ] 각 항목 우측 휴지통 아이콘 클릭 시 삭제 (하위 항목이 있으면 경고)
- [ ] 유형1 삭제 시 해당 유형2도 cascade 삭제 (DB 레벨 또는 앱 레벨)
- [ ] 유형1 미선택 시 오른쪽 카드는 "유형1을 먼저 선택하세요" 안내
- [ ] `npm run build` TypeScript 오류 0개

---

## Implementation Steps

### Step 1 — Supabase DB 마이그레이션

**Supabase MCP `apply_migration` 또는 SQL 실행:**

```sql
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES categories(id) ON DELETE CASCADE;
```

- `ON DELETE CASCADE`: 유형1 삭제 시 연결된 유형2 자동 삭제
- 기존 데이터(parent_id = NULL) → 유형1로 자동 처리

---

### Step 2 — 타입 업데이트

**`types/database.ts`** (수정)

`CategoryRow` 인터페이스에 `parent_id` 추가:
```typescript
interface CategoryRow {
  id: string;
  name: string;
  description: string | null;
  created_at: string | null;
  parent_id: string | null;  // 추가
}
```

---

### Step 3 — Hooks 업데이트

**`components/hooks/categories/apis.ts`** (수정)

- `getCategories(parentId?: string | null)`: `parent_id` 기준 필터링 추가
  - `parentId === null` → 유형1 (`parent_id IS NULL`)
  - `parentId === string` → 해당 유형1의 유형2
- `insertCategory(name: string, parentId?: string | null)`: `parent_id` 포함하여 insert

**`components/hooks/categories/keys.ts`** (수정)

```typescript
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (parentId?: string | null) => [...categoryKeys.lists(), { parentId }] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};
```

**`components/hooks/categories/queries.ts`** (수정)

- `useCategories(parentId?: string | null)`: parentId 파라미터 추가

**`components/hooks/categories/mutations.ts`** (수정)

- `useAddCategory()`: parentId 받도록 업데이트
- 삭제 시 관련 캐시 무효화 (유형1 삭제 → 유형2 목록 캐시도 무효화)

---

### Step 4 — 카테고리 페이지 UI 전면 재설계

**`app/(dashboard)/categories/page.tsx`** (전면 재작성)

**레이아웃:**
```
┌─────────────────────────────────────────────────┐
│ 유형 관리                          헤더           │
├───────────────────┬─────────────────────────────┤
│    유형1 카드      │       유형2 카드             │
│  ─────────────    │  ─────────────────────────  │
│  • 뉴스          →│  • 정치                     │
│  • 스포츠 (선택)  │  • 경제                     │
│  • 경제           │  • 사회                     │
│  ─────────────    │  ─────────────────────────  │
│  [+ 추가 입력]    │  [+ 추가 입력]              │
└───────────────────┴─────────────────────────────┘
```

**상태:**
- `selectedCategory1Id: string | null` — 선택된 유형1 ID
- 유형1 목록: `useCategories(null)`
- 유형2 목록: `useCategories(selectedCategory1Id)` (selectedCategory1Id가 있을 때만)

**유형1 카드 UI:**
- 각 항목: 이름 텍스트 + 우측 휴지통 아이콘
- 선택된 항목: `bg-primary-50 border-l-4 border-primary-500` 하이라이트
- 하단 인라인 입력 폼: Input + "추가" 버튼
- 삭제 시 toast 확인 or 인라인 confirm

**유형2 카드 UI:**
- 유형1 미선택: 중앙에 "← 왼쪽에서 유형1을 선택해주세요" 안내문
- 유형1 선택됨: 동일한 항목 구조 (이름 + 휴지통)
- 하단 인라인 입력 폼

---

### Step 5 — 기존 라우트 정리 (선택)

- `/categories/new/page.tsx` — 더 이상 사용 안 하지만 유지 (삭제 시 참조 오류 위험)
- `/categories/[id]/page.tsx` — 유지 (수정 기능을 추후 인라인으로 옮길 수 있음)

---

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| 기존 categories 데이터가 sources의 category 컬럼에서 참조됨 | parent_id만 추가, 기존 id/name 불변 → 영향 없음 |
| 유형1 삭제 시 유형2 고아 데이터 | `ON DELETE CASCADE` 로 DB 레벨 처리 |
| useCategories 기존 호출부 (SourceForm 등) 영향 | `getCategories()` 인자 없이 호출 시 기존처럼 전체 반환하도록 오버로드 유지 |

---

## Verification Steps

1. `npm run build` — TypeScript 오류 0개
2. `/categories` 페이지: 두 카드 나란히 렌더링 확인
3. 유형1 클릭 → 유형2 카드 업데이트 확인
4. 유형1 추가 → 목록에 반영 확인
5. 유형2 추가 (유형1 선택 상태) → 오른쪽 카드에 반영 확인
6. 유형1 삭제 → 해당 유형2도 Supabase에서 삭제됨 확인
7. SourceForm의 카테고리 select → 여전히 정상 동작 확인

---

## File Change Checklist

- [ ] Supabase: `categories` 테이블 `parent_id` 컬럼 추가 (migration)
- [ ] `types/database.ts` — `CategoryRow.parent_id` 추가
- [ ] `components/hooks/categories/keys.ts` — parentId 파라미터 지원
- [ ] `components/hooks/categories/apis.ts` — parentId 필터링 + insert
- [ ] `components/hooks/categories/queries.ts` — parentId 파라미터
- [ ] `components/hooks/categories/mutations.ts` — parentId 포함 add
- [ ] `app/(dashboard)/categories/page.tsx` — 전면 재작성 (2카드 UI)
