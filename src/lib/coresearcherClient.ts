import {
  evidenceGraphProblems,
  type EvidenceGraphV1,
  type EvidenceRequest
} from '../../../src/core/integrations/coresearcher/contract';

/** Browser helper for /api/coresearcher/*. Errors carry the server's explanation (not configured, unreachable, ...). */
export class CoResearcherError extends Error {
  constructor(public readonly status: number, message: string, public readonly detail: unknown = null) {
    super(message);
    this.name = 'CoResearcherError';
  }

  /** 503 from EdiTXT's proxy means CoResearcher is not configured, not reachable, or rejected the key. */
  get unavailable(): boolean {
    return this.status === 503;
  }
}

function explain(body: unknown, status: number): { message: string; detail: unknown } {
  if (typeof body === 'object' && body !== null) {
    const record = body as Record<string, unknown>;
    const inner = record.detail;
    const innerText =
      typeof inner === 'string' ? inner : typeof inner === 'object' && inner !== null && typeof (inner as Record<string, unknown>).detail === 'string'
        ? String((inner as Record<string, unknown>).detail)
        : null;
    const message = typeof record.error === 'string' ? record.error : innerText ?? `CoResearcher request failed (${status})`;
    return { message: innerText && message !== innerText ? `${message} ${innerText}` : message, detail: inner ?? null };
  }
  return { message: `CoResearcher request failed (${status})`, detail: null };
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/coresearcher/${path}`, { cache: 'no-store', ...init });
  } catch (error) {
    throw new CoResearcherError(0, `EdiTXT's server did not answer: ${error instanceof Error ? error.message : String(error)}`);
  }
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  if (!response.ok) {
    const { message, detail } = explain(body, response.status);
    throw new CoResearcherError(response.status, message, detail);
  }
  return body as T;
}

export const getCoResearcher = <T,>(path: string) => call<T>(path);

export const postCoResearcher = <T,>(path: string, body: unknown) =>
  call<T>(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

/** Sends an EvidenceRequest and checks the answer is a well-formed v1 graph before anything displays it. */
export async function requestEvidence(request: EvidenceRequest): Promise<EvidenceGraphV1> {
  const graph = await postCoResearcher<unknown>('evidence/requests', { requested_by: 'editxt', ...request });
  const problems = evidenceGraphProblems(graph);
  if (problems.length > 0) {
    throw new CoResearcherError(502, `CoResearcher returned a graph EdiTXT cannot read: ${problems.join('; ')}`);
  }
  return graph as EvidenceGraphV1;
}

/** Link for downloading a published research package through EdiTXT's proxy. */
export const packageDownloadHref = (name: string) => `/api/coresearcher/lifecycle/packages/${encodeURIComponent(name)}`;
