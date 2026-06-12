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

function requireEnv(name: string): string {
  const raw = process.env[name];
  if (!raw) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        'Copy .env.example to .env and add your Supabase credentials.',
    );
  }

  const value = normalizeEnvValue(raw);
  if (!value) {
    throw new Error(
      `Environment variable ${name} is empty. Check for extra spaces or quotes in .env.`,
    );
  }

  return value;
}

export function getEnvConfig(): EnvConfig {
  return {
    supabaseUrl: requireEnv('EXPO_PUBLIC_SUPABASE_URL'),
    supabaseAnonKey: requireEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
  };
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && normalizeEnvValue(url) && normalizeEnvValue(key));
}
