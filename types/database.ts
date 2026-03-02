// Supabase Database Types
// These types should match your Supabase database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      sources: {
        Row: Source;
        Insert: Omit<Source, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Source, 'id' | 'created_at' | 'updated_at'>>;
      };
      datas: {
        Row: Data;
        Insert: Omit<Data, 'id' | 'created_at'>;
        Update: Partial<Omit<Data, 'id' | 'created_at'>>;
      };
    };
    Enums: {
      category: string;
      source_status: 'active' | 'inactive' | 'pending';
      collection_cycle: 'daily' | 'weekly' | 'monthly';
    };
  };
}

// Profile (User) Type
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'user' | null;
  created_at: string;
  updated_at: string;
}

// Source (Information Source) Type
export interface Source {
  id: number;
  country: string;
  name: string;
  url: string;
  type: string; // category enum
  cycle: string;
  status: 'active' | 'inactive' | 'pending';
  last_collected: string | null;
  created_at: string;
  updated_at: string;
}

// Data (Collected Data) Type
export interface Data {
  id: string; // Format: sourceId(5) + date(6) + sequence(5)
  source_id: number;
  country: string;
  title: string;
  content: string | null;
  url: string | null;
  type: string;
  collected_at: string;
  published_at: string | null;
  created_at: string;
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
