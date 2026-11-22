/** Client-side helper for POST /api/capabilities/[name]. Throws with the server's message on failure. */
export async function invokeCapability<T>(name: string, input: unknown): Promise<{ output: T; traceId: string }> {
  const response = await fetch(`/api/capabilities/${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input)
  });
  const body = await response.json();
  if (!response.ok) {
    const problems = Array.isArray(body.problems) ? `: ${body.problems.join('; ')}` : '';
    throw new Error(`${body.error ?? `Request failed (${response.status})`}${problems}`);
  }
  return body;
}
