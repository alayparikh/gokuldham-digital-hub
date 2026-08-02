// Client-side error reporting hook. Prod React does not rethrow errors caught by an
// error boundary to window.onerror, so boundaries forward them here instead.
// Swap the body for a real reporter (Sentry, etc.) when one is wired up.

export function reportClientError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // Loaders and server fns commonly throw a raw Response; String(it) is the
  // opaque "[object Response]", so pull out the status and URL instead.
  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error("[client error]", {
    message,
    ...(stack !== undefined && { stack }),
    route: window.location.pathname,
    ...context,
  });
}
