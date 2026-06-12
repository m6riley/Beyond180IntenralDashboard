type EnvConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

function normalizeEnvValue(value: string): string {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

export function getEnvConfig(): EnvConfig {
  const rawSupabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const rawSupabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawSupabaseUrl) {
    throw new Error(
      "Missing required environment variable: EXPO_PUBLIC_SUPABASE_URL. " +
        "Add it to your Cloudflare Build environment variables.",
    );
  }

  if (!rawSupabaseAnonKey) {
    throw new Error(
      "Missing required environment variable: EXPO_PUBLIC_SUPABASE_ANON_KEY. " +
        "Add it to your Cloudflare Build environment variables.",
    );
  }

  const supabaseUrl = normalizeEnvValue(rawSupabaseUrl);
  const supabaseAnonKey = normalizeEnvValue(rawSupabaseAnonKey);

  if (!supabaseUrl) {
    throw new Error("EXPO_PUBLIC_SUPABASE_URL is empty.");
  }

  if (!supabaseAnonKey) {
    throw new Error("EXPO_PUBLIC_SUPABASE_ANON_KEY is empty.");
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}

export function isSupabaseConfigured(): boolean {
  const rawSupabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const rawSupabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawSupabaseUrl || !rawSupabaseAnonKey) {
    return false;
  }

  return Boolean(
    normalizeEnvValue(rawSupabaseUrl) &&
      normalizeEnvValue(rawSupabaseAnonKey),
  );
}