// Supabase Database Types
// These types should match your Supabase database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Country enum type
export type Country =
  | "러시아"
  | "벨라루스"
  | "아제르바이잔"
  | "우즈베키스탄"
  | "우크라이나"
  | "카자흐스탄"
  | "키르기스스탄"
  | "미국"
  | "캐나다"
  | "뉴질랜드"
  | "대만"
  | "라오스"
  | "말레이시아"
  | "몽골"
  | "미얀마"
  | "방글라데시"
  | "베트남"
  | "스리랑카"
  | "싱가포르"
  | "인도"
  | "인도네시아"
  | "일본"
  | "중국"
  | "캄보디아"
  | "태국"
  | "파키스탄"
  | "필리핀"
  | "호주"
  | "홍콩"
  | "가나"
  | "나이지리아"
  | "남아프리카공화국"
  | "수단"
  | "에티오피아"
  | "우간다"
  | "짐바브웨"
  | "케냐"
  | "코트디부아르"
  | "탄자니아"
  | "그리스"
  | "네덜란드"
  | "독일"
  | "루마니아"
  | "리투아니아"
  | "벨기에"
  | "불가리아"
  | "세르비아"
  | "스웨덴"
  | "스위스"
  | "스페인"
  | "슬로바키아"
  | "아르메니아"
  | "영국"
  | "오스트리아"
  | "이탈리아"
  | "체코"
  | "크로아티아"
  | "폴란드"
  | "프랑스"
  | "핀란드"
  | "헝가리"
  | "과테말라"
  | "도미니카공화국"
  | "멕시코"
  | "베네수엘라"
  | "브라질"
  | "아르헨티나"
  | "에콰도르"
  | "칠레"
  | "코스타리카"
  | "콜롬비아"
  | "쿠바"
  | "파나마"
  | "파라과이"
  | "페루"
  | "모로코"
  | "사우디아라비아"
  | "아랍에미리트"
  | "알제리"
  | "오만"
  | "요르단"
  | "이라크"
  | "이란"
  | "이스라엘"
  | "이집트"
  | "카타르"
  | "쿠웨이트"
  | "튀니지"
  | "튀르키예"
  | "대한민국";

// Role enum type
export type Role = "admin" | "client";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "id" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "updated_at">>;
      };
      logs: {
        Row: Log;
        Insert: Omit<Log, "id" | "created_at">;
        Update: Partial<Omit<Log, "id" | "created_at">>;
      };
      sources: {
        Row: Source;
        Insert: Omit<Source, "id" | "created_at">;
        Update: Partial<Omit<Source, "id" | "created_at">>;
      };
      datas: {
        Row: Data;
        Insert: Omit<Data, "id" | "created_at">;
        Update: Partial<Omit<Data, "id" | "created_at">>;
      };
      categories: {
        Row: CategoryRow;
        Insert: Omit<CategoryRow, "id" | "created_at">;
        Update: Partial<Omit<CategoryRow, "id" | "created_at">>;
      };
    };
    Enums: {
      country: Country;
      role: Role;
    };
  };
}

// Profile (User) Type
export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  role: Role | null;
  updated_at: string;
}

// Log (Collection Log) Type
export interface Log {
  id: number;
  created_at: string;
  level: string | null;
  source_id: number | null;
  url: string | null;
  message: string | null;
  details: Json | null;
  sources?: {
    name: string | null;
  } | null;
}

// Source (Information Source) Type
export interface Source {
  id: number;
  country: Country | null;
  name: string | null;
  url: string | null;
  category: string[] | null; // JSONB array of category names
  frequency: number | null;
  actions: Json | null;
  prompt: string | null;
  source_id: string | null;
  article_class: string | null;
  content_class: Json | null;
  memo: string | null;
  is_live: boolean | null;
  is_deleted?: boolean | null;
  "1depth": boolean | null;
  created_at: string;
}

// Data (Collected Data) Type
export interface Data {
  id: number;
  source_id: number | null;
  title: string | null;
  content: string | null;
  source_url: string | null;
  published_date: string | null;
  collected_at: string | null;
  extra_data: Json | null;
  category: string | null;
  data_id: string | null;
  "1depth": boolean | null;
  created_at: string;
}

// Data with Source info (for joined queries)
export interface DataWithSource extends Data {
  sources?: {
    id: number;
    country: Country | null;
    name: string | null;
    category: string | null;
  } | null;
}

// Category Table Type
export interface CategoryRow {
  id: string;
  name: string;
  description: string | null;
  created_at: string | null;
  category_type: number;
  sort_order: number | null;
}

// Category Type (PostgreSQL Enum)
export type Category = string;

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Json;
}
