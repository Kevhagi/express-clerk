import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check SUPABASE_URL and SUPABASE_ANON_KEY.');
}

// Create Supabase client for client-side operations (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create Supabase client for server-side operations (bypasses RLS)
// Falls back to anon key if service role key is not provided
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Extract project reference from Supabase URL
const getProjectRef = (url: string): string => {
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!match) {
    throw new Error('Invalid Supabase URL format. Expected: https://your-project-ref.supabase.co');
  }
  return match[1];
};

// Default: Use connection pooling (recommended for production and development)
export const getSupabaseConnectionString = () => {
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;
  const dbName = process.env.SUPABASE_DB_NAME || 'postgres';
  const dbUser = process.env.SUPABASE_DB_USER || 'postgres';
  const dbPort = process.env.SUPABASE_DB_PORT || '6543'; // Pooled connection uses port 6543
  
  // Use connection pooling hostname
  const projectRef = getProjectRef(supabaseUrl);
  const dbHost = process.env.SUPABASE_DB_HOST || `aws-0-${projectRef}.pooler.supabase.com`;

  if (!dbPassword) {
    throw new Error('Missing SUPABASE_DB_PASSWORD environment variable.');
  }

  return `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
};

// Alternative: Use direct database connection (for specific use cases)
export const getSupabaseDirectConnectionString = () => {
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;
  const dbName = process.env.SUPABASE_DB_NAME || 'postgres';
  const dbUser = process.env.SUPABASE_DB_USER || 'postgres';
  const dbPort = process.env.SUPABASE_DB_PORT || '5432';
  
  // Use direct database hostname
  const projectRef = getProjectRef(supabaseUrl);
  const dbHost = process.env.SUPABASE_DB_HOST || `db.${projectRef}.supabase.co`;

  if (!dbPassword) {
    throw new Error('Missing SUPABASE_DB_PASSWORD environment variable.');
  }

  return `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
};

export default supabase;