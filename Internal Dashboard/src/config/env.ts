type EnvConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        'Copy .env.example to .env and add your Supabase credentials.',
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
  return Boolean(
    process.env.EXPO_PUBLIC_SUPABASE_URL &&
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  );
}
