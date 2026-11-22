'use client';

import { useEffect, useRef, useState } from 'react';
import type { EvidenceGraphV1, EvidenceRequest } from '../../../src/core/integrations/coresearcher/contract';
import { toEvidenceTraceArtifact, traceFreshness } from '../../../src/core/integrations/coresearcher/evidenceTrace';
import { CoResearcherError, requestEvidence } from '../lib/coresearcherClient';
import { CoResearcherProblem, EvidenceGraphView } from './EvidenceGraphView';

type State =
  | { status: 'loading'; version: number }
  | { status: 'ready'; version: number; graph: EvidenceGraphV1; recordedHash: string; changedFrom: string | null }
  | { status: 'error'; version: number; httpStatus: number; message: string };

/** Asks CoResearcher for the evidence behind one manuscript claim and shows it, with a staleness check on refresh. */
export function ClaimEvidence({ claimId, request }: { claimId: string; request: EvidenceRequest | undefined }) {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<State>({ status: 'loading', version: 0 });
  // The digest recorded the first time, as an EvidenceTraceArtifact would keep it.
  const recorded = useRef<string | null>(null);

  useEffect(() => {
    if (!request) return;
    let cancelled = false;
    requestEvidence(request)
      .then(graph => {
        if (cancelled) return;
        const trace = toEvidenceTraceArtifact(graph, [claimId]);
        const previous = recorded.current;
        if (previous === null) recorded.current = trace.artifactHash;
        const changedFrom = previous !== null && traceFreshness({ artifactHash: previous }, graph) === 'changed' ? previous : null;
        setState({ status: 'ready', version, graph, recordedHash: previous ?? trace.artifactHash, changedFrom });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const httpStatus = error instanceof CoResearcherError ? error.status : 0;
        setState({ status: 'error', version, httpStatus, message: error instanceof Error ? error.message : 'Unexpected error' });
      });
    return () => {
      cancelled = true;
    };
  }, [claimId, request, version]);

  if (!request) {
    return (
      <div className="rounded-md border border-line p-3 text-sm">
        <p className="font-semibold">No CoResearcher evidence linked</p>
        <p className="text-ink-muted">Link {claimId} to a lifecycle project, research package, registered claim or formal case in the CoResearcher workspace.</p>
      </div>
    );
  }

  const current = state.version === version ? state : { status: 'loading' as const, version };

  return (
    <section aria-label={`CoResearcher evidence for ${claimId}`} className="space-y-2 rounded-md border border-line p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold">CoResearcher evidence</p>
        <button type="button" onClick={() => setVersion(v => v + 1)} className="rounded border border-line px-2 py-0.5 text-xs hover:bg-canvas">
          Refresh
        </button>
      </div>
      {current.status === 'loading' && <p className="text-sm text-ink-muted">Asking CoResearcher…</p>}
      {current.status === 'error' && <CoResearcherProblem status={current.httpStatus} message={current.message} />}
      {current.status === 'ready' && (
        <>
          {current.changedFrom && (
            <p role="alert" className="rounded-md border border-danger bg-danger-soft p-2 text-sm font-semibold text-danger">
              ⚠ The evidence behind {claimId} changed since it was recorded (digest {current.changedFrom.slice(0, 12)}… → {current.graph.provenance.digest.slice(0, 12)}…).
            </p>
          )}
          <EvidenceGraphView graph={current.graph} compact />
          <p className="text-xs text-ink-muted">
            Recorded as EvidenceTraceArtifact <span className="font-mono">{current.recordedHash.slice(0, 16)}…</span> for {claimId}.
          </p>
        </>
      )}
    </section>
  );
}
