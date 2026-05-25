const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

function looksLikePlaceholder(value: string): boolean {
  const v = value.trim();
  if (!v || v.includes('...') || v.includes('xxxxx') || v.includes('YOUR_PROJECT')) return true;
  if (v === 'your_anon_key_here') return true;
  return false;
}

/** Legacy JWT anon keys and newer Supabase publishable keys (`sb_publishable_…`). */
function looksLikeValidAnonKey(key: string): boolean {
  const k = key.trim();
  if (looksLikePlaceholder(k)) return false;
  if (k.startsWith('eyJ') && k.length >= 100) return true;
  if (k.startsWith('sb_publishable_') && k.length >= 20) return true;
  return k.length >= 32;
}

function getConfigBlockReason(): string | null {
  if (!supabaseUrl.length) return 'EXPO_PUBLIC_SUPABASE_URL is empty';
  if (!supabaseAnonKey.length) return 'EXPO_PUBLIC_SUPABASE_ANON_KEY is empty';
  if (looksLikePlaceholder(supabaseUrl)) return 'SUPABASE_URL looks like a placeholder';
  if (looksLikePlaceholder(supabaseAnonKey)) return 'SUPABASE_ANON_KEY looks like a placeholder';
  if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    return 'SUPABASE_URL must be https://<project>.supabase.co';
  }
  if (!looksLikeValidAnonKey(supabaseAnonKey)) {
    return 'SUPABASE_ANON_KEY format not recognized (use anon or publishable key from Dashboard → API)';
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  return getConfigBlockReason() === null;
}

export function getSupabaseConfig() {
  return { supabaseUrl, supabaseAnonKey };
}

/** Shown when sign-in / cloud backup is unavailable. */
export function getCloudSetupMessage(): string {
  return (
    'Cloud backup is not set up. Copy .env.example to .env, add your Supabase URL and anon key, run supabase/schema.sql in your project, then restart with: npx expo start -c'
  );
}

function maskSecret(value: string): string {
  if (!value) return '(empty)';
  if (value.length <= 10) return `*** (len=${value.length})`;
  return `${value.slice(0, 8)}…${value.slice(-4)} (len=${value.length})`;
}

function urlHost(url: string): string | null {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

/** Temporary diagnostics — logs once in __DEV__ without printing full secrets. */
export function logSupabaseEnvDiagnostics(): void {
  if (!__DEV__) return;

  const blockReason = getConfigBlockReason();
  const configured = blockReason === null;

  console.log('[etoile/env] Supabase env diagnostics', {
    urlVar: 'EXPO_PUBLIC_SUPABASE_URL',
    keyVar: 'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    urlLoaded: supabaseUrl.length > 0,
    keyLoaded: supabaseAnonKey.length > 0,
    urlHost: urlHost(supabaseUrl),
    urlPreview: supabaseUrl ? maskSecret(supabaseUrl) : '(empty)',
    keyPreview: maskSecret(supabaseAnonKey),
    keyFormat: supabaseAnonKey.startsWith('sb_publishable_')
      ? 'publishable'
      : supabaseAnonKey.startsWith('eyJ')
        ? 'jwt'
        : 'other',
    cloudBackupEnabled: configured,
    blockReason: blockReason ?? 'none',
  });
}
