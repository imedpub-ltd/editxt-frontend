'use client';

import type {
  DeepReviewBadgeType,
  InlineEpistemicFinding,
  PreSubmissionDeepReviewOutput
} from '../../../src/core/review/PreSubmissionDeepReviewCapability';

export interface DeepReviewInspectorProps {
  report: PreSubmissionDeepReviewOutput | null;
  traceId: string | null;
  loading: boolean;
  error: string | null;
  selectedBlockId: string | null;
  resolvedFindingIds: Set<string>;
  onSelectBlock: (blockId: string) => void;
  onApplyRemediation: (finding: InlineEpistemicFinding) => void;
}

const BADGE_META: Record<
  DeepReviewBadgeType,
  { label: string; dotClass: string; chipClass: string; underlineClass: string }
> = {
  LOGICAL_GAP: {
    label: 'LOGICAL GAP / BARRIER',
    dotClass: 'bg-red-600',
    chipClass: 'border-red-600 text-red-700 dark:text-red-300',
    underlineClass: 'decoration-red-600 decoration-2 underline underline-offset-4'
  },
  DATA_DRIFT: {
    label: 'DATA DRIFT / EMPIRICAL',
    dotClass: 'bg-orange-500',
    chipClass: 'border-orange-500 text-orange-700 dark:text-orange-300',
    underlineClass: 'decoration-orange-500 decoration-2 underline underline-offset-4'
  },
  CITATION_WARNING: {
    label: 'CITATION INTEGRITY',
    dotClass: 'bg-amber-500',
    chipClass: 'border-amber-500 text-amber-700 dark:text-amber-300',
    underlineClass: 'decoration-amber-500 decoration-2 underline underline-offset-4'
  },
  DISTILLATION_OPPORTUNITY: {
    label: 'PROOF DISTILLATION',
    dotClass: 'bg-blue-600',
    chipClass: 'border-blue-600 text-blue-700 dark:text-blue-300',
    underlineClass: 'decoration-blue-600 decoration-2 underline underline-offset-4'
  }
};

export function getBadgeUnderlineClass(badgeType: DeepReviewBadgeType): string {
  return BADGE_META[badgeType].underlineClass;
}

export function DeepReviewInspector({
  report,
  traceId,
  loading,
  error,
  selectedBlockId,
  resolvedFindingIds,
  onSelectBlock,
  onApplyRemediation
}: DeepReviewInspectorProps) {
  if (loading) {
    return (
      <div className="rounded-md border border-line p-3 text-xs text-ink-muted">
        Running Dynamic Document Segmentation &amp; parallel forensic stress-testers…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-danger bg-danger-soft p-3 text-xs text-danger">
        Deep Review failed: {error}
      </div>
    );
  }

  if (!report) {
    return (
      <div className="rounded-md border border-line p-3 text-xs text-ink-muted">
        Click <strong>Run Deep Review Pre-Submission</strong> in the manuscript header to segment blocks and run parallel forensic auditors.
      </div>
    );
  }

  const activeFindings = report.findings.filter(f => !resolvedFindingIds.has(f.findingId));
  const gateStatus =
    activeFindings.some(f => f.severity === 'CRITICAL_BLOCKER')
      ? 'BLOCKED_CRITICAL_DEFECTS'
      : activeFindings.some(f => f.severity === 'MAJOR_CONCERN')
        ? 'REQUIRES_REVISION'
        : 'READY_FOR_SUBMISSION';

  return (
    <div className="space-y-4 text-xs" aria-label="Deep Review Pre-Submission Report">
      <div className="rounded-md border border-line p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold uppercase tracking-wide text-ink-muted">Readiness Gate</span>
          <span
            className={`rounded border px-1.5 py-0.5 font-mono text-[11px] font-semibold ${
              gateStatus === 'READY_FOR_SUBMISSION'
                ? 'border-success bg-success-soft text-success'
                : gateStatus === 'REQUIRES_REVISION'
                  ? 'border-warning bg-warning-soft text-warning'
                  : 'border-danger bg-danger-soft text-danger'
            }`}
          >
            {gateStatus}
          </span>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-2 font-mono">
          <div>
            <dt className="text-[10px] uppercase text-ink-muted">Segments (DDS)</dt>
            <dd className="text-sm font-semibold">{report.totalSegments}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase text-ink-muted">Compute Units</dt>
            <dd className="text-sm font-semibold">{report.totalComputeUnitsAllocated} CU</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase text-ink-muted">High-Compute Proof</dt>
            <dd>{report.highComputeProofBlocks} blocks</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase text-ink-muted">High-Compute Empirical</dt>
            <dd>{report.highComputeEmpiricalBlocks} blocks</dd>
          </div>
        </dl>

        <div className="mt-2 border-t border-line pt-2 font-mono text-[10px] text-ink-muted">
          <div>Merkle Receipt: {report.merkleReviewReceipt.slice(0, 27)}…</div>
          {traceId && <div>OnTrack Trace: {traceId.slice(0, 20)}…</div>}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold uppercase tracking-wide text-ink-muted">
            Forensic Findings ({activeFindings.length} open / {report.findings.length} total)
          </p>
        </div>

        {activeFindings.length === 0 && (
          <div className="rounded-md border border-success bg-success-soft p-3 text-success">
            All pre-submission forensic findings have been remediated. Manuscript is ready for capsule sealing.
          </div>
        )}

        {report.findings.map(finding => {
          const isResolved = resolvedFindingIds.has(finding.findingId);
          const meta = BADGE_META[finding.badgeType];
          const isSelected = selectedBlockId === finding.blockId;

          return (
            <article
              key={finding.findingId}
              className={`rounded-md border p-3 transition-colors ${
                isResolved
                  ? 'border-line opacity-55'
                  : isSelected
                    ? 'border-accent bg-canvas'
                    : 'border-line bg-surface'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${meta.chipClass}`}>
                  <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} aria-hidden="true" />
                  {meta.label}
                </span>
                <span className="font-mono text-[10px] text-ink-muted">{finding.severity}</span>
              </div>

              <button
                type="button"
                onClick={() => onSelectBlock(finding.blockId)}
                className="mt-2 block w-full text-left font-semibold text-ink hover:underline"
              >
                {finding.title}
              </button>

              <p className="mt-1 font-mono text-[10px] text-ink-muted">
                Block: {finding.blockId} · Auditor: {finding.auditorAgent} · Rule: {finding.falsificationRule}
              </p>

              <p className="mt-1.5 text-ink">{finding.forensicEvidence}</p>

              <div className="mt-2 rounded border border-line bg-canvas p-2">
                <p className="font-semibold text-ink-muted">Suggested Remediation:</p>
                <p className="mt-0.5 text-ink">{finding.suggestedRemediation}</p>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectBlock(finding.blockId)}
                  className="text-[11px] font-medium text-accent underline underline-offset-2"
                >
                  Jump to #{finding.blockId}
                </button>

                {!isResolved ? (
                  <button
                    type="button"
                    onClick={() => onApplyRemediation(finding)}
                    className="rounded border border-accent bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-ink hover:opacity-90"
                  >
                    Apply Suggested Remediation
                  </button>
                ) : (
                  <span className="font-mono text-[11px] font-semibold text-success">✓ Remediated</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
