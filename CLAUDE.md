# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Universal Crawling Data Dashboard** - a Next.js application for managing data collection from multiple sources. It provides interfaces for source management, data collection monitoring, log tracking, and weekly issue curation.

**Tech Stack:**
- Next.js 15 (App Router)
- React 19
- Supabase (Auth & Database)
- Tailwind CSS + shadcn/ui
- Zustand (state management)
- Chart.js / react-chartjs-2
- Lucide icons

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Environment Setup

Create `.env.local` with these variables (see `.env.example`):
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

## Architecture

### Route Structure (App Router)

The app uses route groups for layout separation:
- `app/(auth)/auth/` - Authentication pages (login, register)
- `app/(dashboard)/` - Protected dashboard pages with sidebar layout

**Dashboard Routes:**
- `/dashboard` - Main dashboard with KPIs and charts
- `/sources` - Data source management (list, create, detail)
- `/data` - Collected data management
- `/logs` - System logs viewer
- `/weekly-issue-selection` - Curate weekly issues
- `/weekly-issues` - View weekly issues
- `/issue-archive` - Archived issues

### Supabase Client Pattern

Two client patterns based on context:
- **Browser Client:** `lib/supabase/client.ts` - `createClient()` for client components
- **Server Client:** `lib/supabase/server.ts` - `createClient()` async function for server components

### State Management

Global state uses Zustand (`components/store/authStore.ts`):
- `useAuthStore` - User authentication state, logout action

### UI Components

- **shadcn/ui** components in `components/ui/`
- **Custom components** in `components/` (auth, layout, sources, data)
- **Layout components:** `Sidebar`, `Topbar`, `MainLayout` in `components/layout/`

### Custom Hooks

Located in `components/hooks/`:
- `useToast` - Toast notifications
- `useModal` - Modal management

### Styling Conventions

- **Primary color:** Navy blue (`#1F2C5C`) defined in tailwind.config.ts
- **Font:** Pretendard (Korean-optimized)
- Use Tailwind CSS classes; custom colors via `primary-*`, `stone-*`
- Theme support via next-themes (dark/light mode)

## Key Patterns

### Client Components
Use `"use client"` directive for interactive components. Dashboard pages are client components using Chart.js.

### Path Aliases
Use `@/` prefix for imports (e.g., `import { Button } from "@/components/ui/button"`)

### Forms
React Hook Form + Zod validation pattern used in auth and data forms.
