# 🌐 Universal Scraping Dashboard (Makeasy)

이 프로젝트는 다양한 소스로부터 대량의 데이터를 크롤링하고, 이를 체계적으로 관리, 분석 및 시각화하기 위한 통합 데이터 관리 대시보드입니다.

![Universal Scraping Dashboard](https://images.unsplash.com/photo-1551288049-bbbda5366a71?q=80&w=2070&auto=format&fit=crop)

## 🚀 주요 기능

- **📊 실시간 대시보드**: 전체 크롤링 현황, 성공/실패율, 최신 수집 데이터 통계 제공
- **📁 데이터 관리**: 수집된 데이터의 브라우징, 필터링, 상세 보기 및 관리 기능
- **🔗 소스/링크 관리**: 크롤링 대상 사이트(Sources) 및 개별 링크 관리 및 설정
- **📅 주간 이슈 관리**: 수집된 데이터 중 주요 이슈를 선별하여 주간 리포트 형태로 관리
- **📜 로그 모니터링**: 실시간 크롤링 수행 로그 확인 및 오류 추적
- **🔐 보안 인증**: Supabase 기반의 강력한 사용자 인증 및 권한 관리 (RBAC)

## 🛠 기술 스택

### Frontend
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (based on Radix UI)
- **Charts**: [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

### Backend & Infrastructure
- **BaaS**: [Supabase](https://supabase.com/) (Auth, Database, Storage)
- **Auth**: Supabase SSR (Auth Helper)
- **Deployment**: Vercel (Recommended)

## 📂 프로젝트 구조

```text
src/
├── app/                  # Next.js App Router (Pages & Layouts)
│   ├── (auth)/           # 로그인, 회원가입 등 인증 관련 페이지
│   └── (dashboard)/      # 대시보드 메인 및 하위 기능 페이지
│       ├── dashboard/    # 대시보드 홈
│       ├── data/         # 데이터 관리
│       ├── sources/      # 수집 소스 관리
│       ├── logs/         # 크롤링 로그
│       └── weekly-.../   # 주간 이슈 관련
├── components/           # 재사용 가능한 UI 컴포넌트
│   ├── layout/           # 사이드바, 헤더 등 레이아웃 컴포넌트
│   ├── ui/               # Shadcn UI 기본 컴포넌트
│   └── [domain]/         # 각 도메인별 전용 컴포넌트
├── hooks/                # 커스텀 훅 (Domain-driven)
├── lib/                  # 유틸리티 및 Supabase 클라이언트 설정
├── store/                # Zustand 상태 저장소
└── types/                # TypeScript 타입 정의
```

## 🏁 시작하기

### 1. 프로젝트 클론
```bash
git clone https://github.com/auraworks/scraping_dashboard_makeasy.git
cd scraping_dashboard_makeasy
```

### 2. 환경 변수 설정
`.env.example` 파일을 `.env.local`로 복사하고 Supabase 정보를 입력합니다.
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 의존성 설치 및 실행
```bash
npm install
npm run dev
```
이제 [http://localhost:3000](http://localhost:3000)에서 대시보드를 확인할 수 있습니다.

## 📝 주요 화면 안내

- **Dashboard**: 전반적인 크롤링 상태 요약 정보를 카드와 차트로 제공합니다.
- **Data Management**: 수집된 모든 로우 데이터를 리스트 형태로 보여주며, 다양한 검색 필터를 제공합니다.
- **Source Config**: 크롤링 주기, 타겟 URL, 파싱 룰 등을 관리합니다.
- **Issue Selection**: 주간 단위로 공유하거나 리포팅해야 할 데이터를 선별합니다.

## 📄 라이선스
This project is private and owned by Auraworks.
