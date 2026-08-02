// Resolves Supabase config on the server. Accepts either the unprefixed names
// (SUPABASE_URL) or the VITE_-prefixed ones, so a deployment only has to define one
// set. import.meta.env is checked too because Vite inlines VITE_* at build time,
// while process.env is read at runtime.

function readEnv(...names: string[]): string | undefined {
  for (const name of names) {
    const fromProcess = typeof process !== "undefined" ? process.env[name] : undefined;
    if (fromProcess) return fromProcess;
    const fromImportMeta = (import.meta.env as Record<string, string | undefined>)[name];
    if (fromImportMeta) return fromImportMeta;
  }
  return undefined;
}

export function supabaseServerConfig(): { url: string; key: string } {
  const url = readEnv("SUPABASE_URL", "VITE_SUPABASE_URL");
  const key = readEnv("SUPABASE_PUBLISHABLE_KEY", "VITE_SUPABASE_PUBLISHABLE_KEY");

  if (!url || !key) {
    const missing = [
      ...(!url ? ["SUPABASE_URL"] : []),
      ...(!key ? ["SUPABASE_PUBLISHABLE_KEY"] : []),
    ];
    throw new Error(
      `Missing Supabase environment variable(s): ${missing.join(", ")}. ` +
        `Set them in your hosting provider's environment settings (see README).`,
    );
  }

  return { url, key };
}

// New Supabase API keys are opaque strings, not bearer JWTs, so the SDK's default
// `Authorization: Bearer <key>` header has to be dropped in favour of `apikey`.
export function supabaseFetch(key: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, name) => headers.set(name, value));
    }
    if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}
