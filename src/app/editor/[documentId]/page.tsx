'use client';

import { use, useEffect, useState } from 'react';
import { ClaimEvidence } from '../../../components/ClaimEvidence';
import { DeepReviewInspector, getBadgeUnderlineClass } from '../../../components/DeepReviewInspector';
import { PhaseNav } from '../../../components/PhaseNav';
import { invokeCapability } from '../../../lib/capabilityClient';
import {
  anchors as initialAnchors,
  blocks as initialBlocks,
  evidenceBindings,
  gateInputs,
  latestManifestDeltas,
  MANUSCRIPT_TITLE,
  type Block,
  type Segment
} from '../../../lib/fixtures';
import type {
  InlineEpistemicFinding,
  PreSubmissionDeepReviewOutput
} from '../../../../../src/core/review/PreSubmissionDeepReviewCapability';

interface ImpactResult {
  isSafe: boolean;
  brokenAnchors: { nodeId: string; variablePath: string; expectedValue: unknown; newValue: unknown; claimId: string | null }[];
}

type Check =
  | { status: 'loading' }
  | { status: 'ready'; traceId: string; result: ImpactResult }
  | { status: 'error'; message: string };

function blockToPlainText(block: Block): string {
  return block.segments.map(s => (s.kind === 'text' ? s.text : s.display)).join('');
}

export default function EditorPage({ params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = use(params);
  const [editorBlocks, setEditorBlocks] = useState<Block[]>(initialBlocks);
  const [editorAnchors, setEditorAnchors] = useState(initialAnchors);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [check, setCheck] = useState<Check>({ status: 'loading' });

  const [deepReviewReport, setDeepReviewReport] = useState<PreSubmissionDeepReviewOutput | null>(null);
  const [deepReviewTraceId, setDeepReviewTraceId] = useState<string | null>(null);
  const [deepReviewLoading, setDeepReviewLoading] = useState(false);
  const [deepReviewError, setDeepReviewError] = useState<string | null>(null);
  const [resolvedFindingIds, setResolvedFindingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    invokeCapability<ImpactResult>('review.check_manuscript_impact', {
      anchors: editorAnchors,
      manifestDeltas: latestManifestDeltas
    })
      .then(({ output, traceId }) => {
        if (!cancelled) setCheck({ status: 'ready', traceId, result: output });
      })
      .catch((error: unknown) => {
        if (!cancelled) setCheck({ status: 'error', message: error instanceof Error ? error.message : 'Unexpected error' });
      });
    return () => {
      cancelled = true;
    };
  }, [editorAnchors]);

  const runDeepReview = async () => {
    setDeepReviewLoading(true);
    setDeepReviewError(null);
    setDrawerOpen(true);
    try {
      const response = await fetch('/api/review/pre-submission', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          manuscriptId: documentId,
          title: MANUSCRIPT_TITLE,
          blocks: editorBlocks.map(b => ({
            id: b.id,
            text: blockToPlainText(b),
            kind: b.kind,
            semanticType: b.semanticType,
            claimId: b.claimId
          })),
          anchors: editorAnchors,
          manifestDeltas: latestManifestDeltas,
          citations: gateInputs.citations
        })
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error ?? `Request failed (${response.status})`);
      }
      setDeepReviewReport(body.output as PreSubmissionDeepReviewOutput);
      setDeepReviewTraceId(body.traceId as string);
      setResolvedFindingIds(new Set());
    } catch (err) {
      setDeepReviewError(err instanceof Error ? err.message : 'Unexpected Deep Review error');
    } finally {
      setDeepReviewLoading(false);
    }
  };

  const inspect = (id: string) => {
    setSelectedId(id);
    setDrawerOpen(true);
    if (typeof document !== 'undefined') {
      const el = document.getElementById(`block-${id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const applyRemediation = (finding: InlineEpistemicFinding) => {
    setEditorBlocks(prev =>
      prev.map(block => {
        if (block.id !== finding.blockId) return block;

        if (finding.category === 'EMPIRICAL_DATA_DISCREPANCY') {
          const updatedSegments: Segment[] = block.segments.map(seg => {
            if (seg.kind === 'anchor' && seg.display === finding.targetSpan) {
              const delta = latestManifestDeltas.find(d => d.variablePath === seg.variablePath);
              return delta ? { ...seg, display: String(delta.newValue) } : seg;
            }
            return seg;
          });
          return { ...block, segments: updatedSegments };
        }

        if (finding.replacementText) {
          return {
            ...block,
            segments: [{ kind: 'text', text: finding.replacementText }]
          };
        }

        return block;
      })
    );

    if (finding.category === 'EMPIRICAL_DATA_DISCREPANCY') {
      setEditorAnchors(prev =>
        prev.map(anchor => {
          if (anchor.nodeId !== finding.blockId) return anchor;
          const delta = latestManifestDeltas.find(d => d.variablePath === anchor.variablePath);
          return delta ? { ...anchor, expectedValue: Number(delta.newValue) } : anchor;
        })
      );
    }

    setResolvedFindingIds(prev => {
      const next = new Set(prev);
      next.add(finding.findingId);
      return next;
    });
    inspect(finding.blockId);
  };

  const staleValues = check.status === 'ready' ? new Set(check.result.brokenAnchors.map(b => b.variablePath)) : null;
  const selected = editorBlocks.find(b => b.id === selectedId) ?? null;

  return (
    <div className="flex min-h-screen flex-col">
      <PhaseNav documentId={documentId} />

      <div className="flex flex-1 flex-col md:flex-row">
        <main aria-labelledby="manuscript-title" className="flex-1 px-4 py-8 md:px-12">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 id="manuscript-title" className="text-3xl font-semibold leading-tight">{MANUSCRIPT_TITLE}</h1>
                <p className="mt-2 text-sm text-ink-muted">
                  Living Computable Manuscript · Pre-Submission Deep Review Harness enabled.
                </p>
              </div>
              <button
                type="button"
                onClick={runDeepReview}
                disabled={deepReviewLoading}
                className="rounded-md border border-accent bg-accent px-4 py-2 text-sm font-semibold text-accent-ink hover:opacity-90 disabled:opacity-50"
              >
                {deepReviewLoading ? 'Running Deep Review…' : 'Run Deep Review Pre-Submission'}
              </button>
            </div>

            <div className="mt-8 space-y-4 text-lg leading-relaxed">
              {editorBlocks.map(block => {
                const blockFindings =
                  deepReviewReport?.findings.filter(
                    f => f.blockId === block.id && !resolvedFindingIds.has(f.findingId)
                  ) ?? [];
                const allocation = deepReviewReport?.segmentAllocations.find(a => a.blockId === block.id);

                return (
                  <section
                    key={block.id}
                    id={`block-${block.id}`}
                    aria-label={`Block ${block.id}`}
                    className={`rounded-lg border p-4 ${
                      selectedId === block.id ? 'border-accent bg-surface' : 'border-line bg-surface/40'
                    }`}
                  >
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                      <BlockLabel block={block} />
                      {allocation && (
                        <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
                          {allocation.segmentType} · {allocation.computeTier} ({allocation.computeUnits} CU)
                        </span>
                      )}
                    </div>

                    <p>{renderSegments(block, staleValues, blockFindings, inspect)}</p>

                    {blockFindings.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {blockFindings.map(f => (
                          <button
                            key={f.findingId}
                            type="button"
                            onClick={() => inspect(block.id)}
                            className="inline-flex items-center gap-1 rounded border border-line bg-canvas px-2 py-0.5 font-mono text-xs text-ink hover:border-accent"
                          >
                            <span>
                              {f.badgeType === 'LOGICAL_GAP' && '🔴'}
                              {f.badgeType === 'DATA_DRIFT' && '🟠'}
                              {f.badgeType === 'CITATION_WARNING' && '🟡'}
                              {f.badgeType === 'DISTILLATION_OPPORTUNITY' && '🔵'}
                            </span>
                            <span>{f.badgeType}</span>
                            <span className="text-ink-muted">({f.auditorAgent})</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => inspect(block.id)}
                      aria-pressed={selectedId === block.id}
                      className="mt-2 text-sm text-accent underline underline-offset-2"
                    >
                      Inspect block
                    </button>
                  </section>
                );
              })}
            </div>
          </div>
        </main>

        <aside
          aria-label="Epistemic inspector"
          className={
            drawerOpen
              ? 'fixed inset-0 z-40 overflow-y-auto bg-surface p-5 md:static md:z-auto md:w-[26rem] md:border-l md:border-line'
              : 'hidden md:block md:w-[26rem] md:border-l md:border-line md:bg-surface md:p-5'
          }
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Epistemic &amp; Deep Review Inspector
            </h2>
            <button type="button" onClick={() => setDrawerOpen(false)} className="rounded px-2 py-1 text-sm underline md:hidden">
              Close
            </button>
          </div>

          <DeepReviewInspector
            report={deepReviewReport}
            traceId={deepReviewTraceId}
            loading={deepReviewLoading}
            error={deepReviewError}
            selectedBlockId={selectedId}
            resolvedFindingIds={resolvedFindingIds}
            onSelectBlock={inspect}
            onApplyRemediation={applyRemediation}
          />

          <div className="mt-6 border-t border-line pt-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Selected Block Provenance
            </h3>

            {!selected && (
              <p className="text-xs text-ink-muted">Select a block or finding card to inspect its provenance and data bindings.</p>
            )}

            {selected && (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink-muted">Block</p>
                  <p className="font-mono">{selected.id}</p>
                </div>

                {selected.kind === 'claim' && selected.claimId && (
                  <>
                    <div className="rounded-md border border-warning bg-warning-soft p-3 text-warning">
                      <p className="font-semibold">⚠ No DataAILab execution for {selected.claimId}</p>
                      <p>The p-value is not bound to a DataAILab run yet.</p>
                    </div>
                    <ClaimEvidence key={selected.claimId} claimId={selected.claimId} request={evidenceBindings[selected.claimId]} />
                  </>
                )}

                {selected.provenance && (
                  <div className="rounded-md border border-line p-3">
                    <p className="font-semibold">Provenance (AI-generated)</p>
                    <dl className="mt-2 space-y-1">
                      <div><dt className="inline text-ink-muted">Model: </dt><dd className="inline">{selected.provenance.model}</dd></div>
                      <div><dt className="inline text-ink-muted">Confidence: </dt><dd className="inline">{selected.provenance.confidence}</dd></div>
                      <div><dt className="inline text-ink-muted">Context hash: </dt><dd className="inline font-mono">{selected.provenance.contextHash}</dd></div>
                      <div><dt className="inline text-ink-muted">Inference: </dt><dd className="inline">{selected.provenance.inference}</dd></div>
                    </dl>
                    <p className="mt-2 text-ink-muted">Evidence: {selected.provenance.evidence.join(', ')}</p>
                    <p className="mt-1 text-xs text-ink-muted">Not linked to CoResearcher evidence. Link it from the CoResearcher workspace.</p>
                  </div>
                )}

                <BindingList blockId={selected.id} anchors={editorAnchors} staleValues={staleValues} />
              </div>
            )}
          </div>

          <ImpactFooter check={check} />
        </aside>
      </div>
    </div>
  );
}

function BlockLabel({ block }: { block: Block }) {
  if (block.kind === 'claim') {
    return <p className="text-xs font-semibold uppercase tracking-wide text-accent">Claim {block.claimId}</p>;
  }
  if (block.kind === 'generated') {
    return <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">AI-generated fragment</p>;
  }
  if (block.semanticType === 'ProofBlock') {
    return <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Formal Proof / Deduction Block</p>;
  }
  return <span className="text-xs font-mono text-ink-muted">#{block.id}</span>;
}

function renderSegments(
  block: Block,
  staleValues: Set<string> | null,
  blockFindings: InlineEpistemicFinding[],
  inspect: (id: string) => void
) {
  const primaryFinding = blockFindings[0];
  const underlineClass = primaryFinding ? getBadgeUnderlineClass(primaryFinding.badgeType) : '';

  return block.segments.map((segment: Segment, index) => {
    if (segment.kind === 'text') {
      return (
        <span key={index} className={underlineClass}>
          {segment.text}
        </span>
      );
    }

    const pending = staleValues === null;
    const stale = staleValues?.has(segment.variablePath) ?? false;
    const label = pending ? 'checking' : stale ? 'STALE' : 'consistent';
    const tone = pending ? 'bg-canvas text-ink-muted' : stale ? 'bg-danger-soft text-danger' : 'bg-success-soft text-success';

    return (
      <button
        key={index}
        type="button"
        onClick={() => inspect(block.id)}
        aria-label={`${segment.variablePath} = ${segment.display}, ${label}`}
        className={`mx-0.5 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-base ${tone} ${underlineClass}`}
      >
        <span>{segment.display}</span>
        <span className="text-xs font-semibold">{stale ? '⚠ STALE' : pending ? '…' : '✓'}</span>
      </button>
    );
  });
}

function BindingList({
  blockId,
  anchors,
  staleValues
}: {
  blockId: string;
  anchors: typeof initialAnchors;
  staleValues: Set<string> | null;
}) {
  const bound = anchors.filter(a => a.nodeId === blockId);
  if (bound.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="font-semibold">Data bindings</p>
      {bound.map(anchor => {
        const stale = staleValues?.has(anchor.variablePath) ?? false;
        const latest = latestManifestDeltas.find(d => d.variablePath === anchor.variablePath);
        return (
          <div key={anchor.variablePath} className="rounded-md border border-line p-3">
            <p className="font-mono text-xs">{anchor.variablePath}</p>
            <p className="mt-1">Manuscript value: <strong>{String(anchor.expectedValue)}</strong></p>
            {latest && <p>Latest DataAILab value: <strong>{String(latest.newValue)}</strong></p>}
            <p className={stale ? 'mt-1 font-semibold text-danger' : 'mt-1 text-success'}>
              {staleValues === null ? 'Checking…' : stale ? '⚠ STALE: manuscript no longer matches the code' : '✓ Consistent with the latest manifest'}
            </p>
            {anchor.claimId && <p className="mt-1 text-ink-muted">Claim {anchor.claimId}</p>}
            {anchor.somArtifactId && <p className="text-ink-muted">SOM artifact <span className="font-mono">{anchor.somArtifactId}</span></p>}
          </div>
        );
      })}
    </div>
  );
}

function ImpactFooter({ check }: { check: Check }) {
  return (
    <p aria-live="polite" className="mt-6 border-t border-line pt-3 text-xs text-ink-muted">
      {check.status === 'loading' && 'Checking manuscript against the DataAILab manifest…'}
      {check.status === 'ready' && (
        <>Impact check {check.result.isSafe ? 'passed' : 'found broken assertions'} · trace <span className="font-mono">{check.traceId.slice(0, 16)}…</span></>
      )}
      {check.status === 'error' && <span className="text-danger">Impact check unavailable: {check.message}</span>}
    </p>
  );
}
