import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

// --- Supabase Client ---
const supabaseUrl = process.env.SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_KEY || '';
const anonKey = process.env.SUPABASE_KEY || '';
const isValidServiceKey = serviceKey && !serviceKey.startsWith('PASTE_');
const supabaseKey = isValidServiceKey ? serviceKey : anonKey;
const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

// --- Seed Script (Admin Only) ---
async function seed() {
  console.log('🌱 Seeding Admin User...\n');

  const adminUser = {
    id: 'admin',
    fullName: 'System Admin',
    email: 'admin@gmail.com',
    password: 'admin@123',
    role: 'admin',
    createdAt: new Date().toISOString()
  };

  await supabase.from('users').upsert([adminUser], { onConflict: 'id' });
  console.log('✅ Admin created (ID: admin | Password: admin@123)');

  console.log('\n✅ Seed complete! Only admin user seeded.');
}

seed().catch(console.error);
