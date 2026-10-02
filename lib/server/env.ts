import "server-only";

/** Reads a required server env var, failing with a clear message instead of a cryptic crash. */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}. See .env.example.`);
  return value;
}
