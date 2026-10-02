export type PostResult = { ok: true } | { ok: false; error: string; fieldErrors: Record<string, string> };

/** POSTs JSON to one of the site's API routes and normalises the response for forms. */
export async function postForm(url: string, body: unknown): Promise<PostResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => ({}))) as { error?: string; fieldErrors?: Record<string, string> };
    return { ok: false, error: data.error ?? "Something went wrong. Please try again.", fieldErrors: data.fieldErrors ?? {} };
  } catch {
    return { ok: false, error: "We couldn't reach the server. Check your connection and try again.", fieldErrors: {} };
  }
}
