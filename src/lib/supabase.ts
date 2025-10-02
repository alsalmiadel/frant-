import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// التحقق من وجود متغيرات البيئة
if (!supabaseUrl || supabaseUrl === 'https://demo.supabase.co') {
  console.warn('⚠️ Supabase URL غير محدد. يرجى إضافة VITE_SUPABASE_URL في ملف .env');
}

if (!supabaseAnonKey || supabaseAnonKey === 'demo-key') {
  console.warn('⚠️ Supabase Anon Key غير محدد. يرجى إضافة VITE_SUPABASE_ANON_KEY في ملف .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  city?: string;
  subscription_type: 'free' | 'growth' | 'enterprise';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: string;
  city: string;
  goal: string;
  status: 'analyzing' | 'completed' | 'saved';
  data: any;
  created_at: string;
  updated_at: string;
}

export interface Analysis {
  id: string;
  project_id: string;
  user_id: string;
  feasibility: any;
  marketing: any;
  financial: any;
  code?: string;
  esg: any;
  created_at: string;
}