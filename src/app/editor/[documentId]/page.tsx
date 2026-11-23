'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { PhaseNav } from '@/components/PhaseNav';
import {
  DeepReviewInspector,
  getBadgeUnderlineClass
} from '@/components/DeepReviewInspector';
import {
  getDocumentById,
  type Block,
  type Segment,
  type DataAssertionAnchor,
  type ManifestDelta,
  type InlineEpistemicFinding
} from '@/lib/editorFixtures';

function blockToPlainText(block: Block): string {
  return block.segments.map(s => (s.kind === 'text' ? s.text : s.display)).join('');
}

export default function LivingEditorPage({
  params
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = use(params);
  const docData = getDocumentById(documentId);

  const [title, setTitle] = useState(docData.title);
  const [editorBlocks, setEditorBlocks] = useState<Block[]>(docData.blocks);
  const [editorAnchors, setEditorAnchors] = useState<DataAssertionAnchor[]>(docData.anchors);
  const [manifestDeltas, setManifestDeltas] = useState<ManifestDelta[]>(docData.manifestDeltas);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Deep Review State
  const [deepReviewReport, setDeepReviewReport] = useState<{
    findings: InlineEpistemicFinding[];
    summary: string;
  } | null>({
    findings: docData.findings,
    summary: `${docData.findings.length} findings ready for verification.`
  });
  const [deepReviewTraceId, setDeepReviewTraceId] = useState<string | null>('trace-init-6d5506fc');
  const [deepReviewLoading, setDeepReviewLoading] = useState(false);
  const [resolvedFindingIds, setResolvedFindingIds] = useState<Set<string>>(new Set());

  // Stale Anchors
  const staleValues = new Set(
    manifestDeltas
      .filter(d => {
        const anchor = editorAnchors.find(a => a.variablePath === d.variablePath);
        return anchor && String(anchor.expectedValue) !== String(d.newValue);
      })
      .map(d => d.variablePath)
  );

  const selectedBlock = editorBlocks.find(b => b.id === selectedBlockId) ?? null;

  const runDeepReview = async () => {
    setDeepReviewLoading(true);
    setDrawerOpen(true);
    try {
      const response = await fetch('/api/review/pre-submission', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          manuscriptId: documentId,
          title,
          blocks: editorBlocks.map(b => ({
            id: b.id,
            text: blockToPlainText(b),
            kind: b.kind,
            semanticType: b.semanticType,
            claimId: b.claimId
          })),
          anchors: editorAnchors,
          manifestDeltas,
          citations: docData.citations
        })
      });
      const data = await response.json();
      if (response.ok) {
        setDeepReviewReport(data.output);
        setDeepReviewTraceId(data.traceId);
        setResolvedFindingIds(new Set());
      }
    } catch {
      // Fallback to local evaluation
    } finally {
      setDeepReviewLoading(false);
    }
  };

  const inspect = (id: string) => {
    setSelectedBlockId(id);
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
              const delta = manifestDeltas.find(d => d.variablePath === seg.variablePath);
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
          const delta = manifestDeltas.find(d => d.variablePath === anchor.variablePath);
          return delta ? { ...anchor, expectedValue: delta.newValue } : anchor;
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

  return (
    <div className="flex min-h-screen flex-col bg-[#fafaf9] text-[#1c1917]">
      <PhaseNav documentId={documentId} />

      {/* Editor Sub-Header */}
      <div className="border-b border-[#e7e5e4] bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#78716c]">
                Document: {documentId}
              </span>
              <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-800">
                ✓ Computable Manuscript Capsule
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-[#57534e]">
              <span>Sample Switcher:</span>
              <Link
                href="/editor/2026-11-pseudo-lof-dementia"
                className={`font-semibold hover:underline ${
                  documentId === '2026-11-pseudo-lof-dementia'
                    ? 'text-[#2563eb] underline'
                    : 'text-[#78716c]'
                }`}
              >
                5-Gene Dementia Study
              </Link>
              <span>·</span>
              <Link
                href="/editor/MANUSCRIPT-ALZHEIMER-TAU-2026"
                className={`font-semibold hover:underline ${
                  documentId === 'MANUSCRIPT-ALZHEIMER-TAU-2026'
                    ? 'text-[#2563eb] underline'
                    : 'text-[#78716c]'
                }`}
              >
                Alzheimer pTau217 Study
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={runDeepReview}
              disabled={deepReviewLoading}
              className="inline-flex items-center gap-2 rounded border border-[#1c1917] bg-[#1c1917] px-4 py-2 text-xs font-bold text-white hover:bg-black disabled:opacity-50 transition"
            >
              {deepReviewLoading ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Auditing Claims…
                </>
              ) : (
                <>⚡ Run Pre-Submission Deep Review</>
              )}
            </button>

            <Link
              href={`/packaging/${documentId}`}
              className="rounded border border-[#d6d3d1] bg-white px-3 py-2 text-xs font-medium text-[#44403c] hover:bg-[#f5f5f4] transition"
            >
              📦 Packaging Gate
            </Link>

            <Link
              href={`/submit?doc=${documentId}&prefill=true`}
              className="rounded border border-emerald-600 bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
            >
              🚀 Submit Manuscript →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col md:flex-row">
        {/* Manuscript Column */}
        <main className="flex-1 px-6 py-8 md:px-12">
          <div className="mx-auto max-w-3xl">
            <div className="border-b border-[#e7e5e4] pb-6">
              <h1 className="font-serif text-3xl font-bold leading-tight text-[#1c1917]">
                {title}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#57534e]">
                {docData.authors.map(a => (
                  <span key={a.name} className="font-medium">
                    {a.name} ({a.affiliation})
                    {a.orcid && (
                      <span className="ml-1 text-[#2563eb] font-mono">
                        [{a.orcid}]
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Blocks list */}
            <div className="mt-8 space-y-6">
              {editorBlocks.map(block => {
                const blockFindings =
                  deepReviewReport?.findings.filter(
                    f =>
                      f.blockId === block.id &&
                      !resolvedFindingIds.has(f.findingId)
                  ) ?? [];

                const isSelected = selectedBlockId === block.id;

                return (
                  <section
                    key={block.id}
                    id={`block-${block.id}`}
                    className={`rounded-lg border p-5 transition ${
                      isSelected
                        ? 'border-[#1c1917] bg-white shadow-md ring-1 ring-[#1c1917]'
                        : 'border-[#e7e5e4] bg-white hover:border-[#a8a29e]'
                    }`}
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#f5f5f4] px-2 py-0.5 font-mono text-[10px] font-bold text-[#78716c]">
                          #{block.id}
                        </span>
                        <span className="rounded border border-[#e7e5e4] px-2 py-0.5 text-[11px] font-medium text-[#44403c]">
                          {block.semanticType || block.kind}
                        </span>
                        {block.claimId && (
                          <span className="rounded bg-indigo-50 px-2 py-0.5 font-mono text-[11px] font-bold text-indigo-700">
                            Claim {block.claimId}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => inspect(block.id)}
                        className="text-xs text-[#2563eb] hover:underline"
                      >
                        Inspect block data →
                      </button>
                    </div>

                    <p className="font-serif text-base leading-relaxed text-[#292524]">
                      {block.segments.map((seg, idx) => {
                        if (seg.kind === 'text') {
                          const primaryFinding = blockFindings[0];
                          const underlineClass = primaryFinding
                            ? getBadgeUnderlineClass(primaryFinding.badgeType)
                            : '';
                          return (
                            <span key={idx} className={underlineClass}>
                              {seg.text}
                            </span>
                          );
                        }

                        // Anchor
                        const isStale = staleValues.has(seg.variablePath);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => inspect(block.id)}
                            className={`mx-1 inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-xs font-bold transition ${
                              isStale
                                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                : 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                            }`}
                          >
                            <span>{seg.display}</span>
                            <span>{isStale ? '⚠ STALE' : '✓'}</span>
                          </button>
                        );
                      })}
                    </p>

                    {/* In-draft finding badges */}
                    {blockFindings.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-[#f5f5f4]">
                        {blockFindings.map(f => (
                          <button
                            key={f.findingId}
                            type="button"
                            onClick={() => inspect(block.id)}
                            className="inline-flex items-center gap-1.5 rounded border border-[#e7e5e4] bg-[#fafaf9] px-2.5 py-1 text-xs text-[#1c1917] hover:border-[#1c1917] transition"
                          >
                            <span>
                              {f.badgeType === 'LOGICAL_GAP' && '🔴'}
                              {f.badgeType === 'DATA_DRIFT' && '🟠'}
                              {f.badgeType === 'CITATION_WARNING' && '🟡'}
                              {f.badgeType === 'DISTILLATION_OPPORTUNITY' && '🔵'}
                            </span>
                            <span className="font-bold">{f.badgeType}</span>
                            <span className="text-[11px] text-[#78716c]">
                              ({f.auditorAgent})
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            {/* Figures Gallery */}
            {docData.figures.length > 0 && (
              <div className="mt-12 rounded-lg border border-[#e7e5e4] bg-white p-6">
                <h3 className="font-serif text-lg font-bold text-[#1c1917]">
                  Vector Figures &amp; 300 DPI Camera-Ready Artifacts ({docData.figures.length})
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {docData.figures.map(fig => (
                    <div
                      key={fig.id}
                      className="rounded border border-[#e7e5e4] bg-[#fafaf9] p-3 text-xs"
                    >
                      <p className="font-semibold text-[#1c1917]">{fig.title}</p>
                      <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-[#78716c]">
                        <span>{fig.file}</span>
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-800">
                          {fig.dpi} DPI
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right Inspector Column */}
        <div className="w-full md:w-96 md:border-l md:border-[#e7e5e4] bg-[#fafaf9]">
          <DeepReviewInspector
            report={deepReviewReport}
            loading={deepReviewLoading}
            selectedBlockId={selectedBlockId}
            resolvedFindingIds={resolvedFindingIds}
            onSelectBlock={inspect}
            onApplyRemediation={applyRemediation}
          />

          {/* Block Provenance & Anchor Details */}
          <div className="p-6 border-t border-[#e7e5e4] text-xs">
            <h4 className="font-bold uppercase tracking-wider text-[#78716c] mb-3">
              Selected Block Provenance
            </h4>

            {!selectedBlock ? (
              <p className="text-[#a8a29e]">
                Select any manuscript block or finding card to inspect underlying data assertion anchors and computational traces.
              </p>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-[#78716c]">Block ID:</span>{' '}
                  <span className="font-mono font-bold">{selectedBlock.id}</span>
                </div>

                {/* Anchors for this block */}
                {editorAnchors
                  .filter(a => a.nodeId === selectedBlock.id)
                  .map(anchor => {
                    const isStale = staleValues.has(anchor.variablePath);
                    const delta = manifestDeltas.find(
                      d => d.variablePath === anchor.variablePath
                    );
                    return (
                      <div
                        key={anchor.variablePath}
                        className="rounded border border-[#e7e5e4] bg-white p-3 space-y-1"
                      >
                        <div className="font-mono font-bold text-[11px] text-[#1c1917]">
                          {anchor.variablePath}
                        </div>
                        <div className="text-[#57534e]">
                          Manuscript Value:{' '}
                          <span className="font-bold">{String(anchor.expectedValue)}</span>
                        </div>
                        {delta && (
                          <div className="text-[#57534e]">
                            Physical Run Value:{' '}
                            <span className="font-bold text-rose-700">
                              {String(delta.newValue)}
                            </span>
                          </div>
                        )}
                        <div
                          className={`mt-1 font-semibold ${
                            isStale ? 'text-rose-700' : 'text-emerald-700'
                          }`}
                        >
                          {isStale
                            ? '⚠ STALE: manuscript value out of sync'
                            : '✓ Certified match with data manifest'}
                        </div>
                      </div>
                    );
                  })}

                {selectedBlock.provenance && (
                  <div className="rounded border border-[#e7e5e4] bg-white p-3 space-y-1">
                    <p className="font-bold text-[#1c1917]">Forensic Agent Provenance</p>
                    <p className="text-[#57534e]">Model: {selectedBlock.provenance.model}</p>
                    <p className="text-[#57534e]">Confidence: {selectedBlock.provenance.confidence}</p>
                    <p className="font-mono text-[10px] text-[#78716c]">
                      Context Hash: {selectedBlock.provenance.contextHash}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
