import { createClient } from '@supabase/supabase-js';
import { ENV } from '../config/env';

const supabaseUrl = ENV.SUPABASE.URL || '';

// Use service key if it's a real key; otherwise fall back to anon key
const serviceKey = ENV.SUPABASE.SERVICE_KEY || '';
const anonKey = ENV.SUPABASE.KEY || '';
const isValidServiceKey = serviceKey && !serviceKey.startsWith('PASTE_');
const supabaseKey = isValidServiceKey ? serviceKey : anonKey;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing SUPABASE_URL or SUPABASE_KEY in .env file.');
}

if (!isValidServiceKey) {
  console.warn('⚠️  No SUPABASE_SERVICE_KEY set — using anon key. RLS policies must allow access.');
}

// Backend Supabase client with full DB access (bypasses Row Level Security)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});
