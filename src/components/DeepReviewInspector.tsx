'use client';

import React from 'react';

export type DeepReviewBadgeType =
  | 'LOGICAL_GAP'
  | 'DATA_DRIFT'
  | 'CITATION_WARNING'
  | 'DISTILLATION_OPPORTUNITY';

export interface InlineEpistemicFinding {
  findingId: string;
  blockId: string;
  badgeType: DeepReviewBadgeType;
  category: string;
  auditorAgent: string;
  targetSpan: string;
  explanation: string;
  replacementText?: string;
  falsificationChallenge?: string;
}

export interface DeepReviewInspectorProps {
  report: {
    findings: InlineEpistemicFinding[];
    summary: string;
  } | null;
  loading: boolean;
  selectedBlockId: string | null;
  resolvedFindingIds: Set<string>;
  onSelectBlock: (blockId: string) => void;
  onApplyRemediation: (finding: InlineEpistemicFinding) => void;
}

export function DeepReviewInspector({
  report,
  loading,
  selectedBlockId,
  resolvedFindingIds,
  onSelectBlock,
  onApplyRemediation
}: DeepReviewInspectorProps) {
  if (loading) {
    return (
      <aside className="w-80 border-l border-[#e7e5e4] bg-[#fafaf9] p-6 text-xs text-[#78716c]">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1c1917] border-t-transparent"></div>
          <span>Running Multi-Agent Deep Review...</span>
        </div>
      </aside>
    );
  }

  const findings = report?.findings ?? [];
  const activeFindings = findings.filter(f => !resolvedFindingIds.has(f.findingId));

  return (
    <aside className="w-88 border-l border-[#e7e5e4] bg-[#fafaf9] p-6 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#e7e5e4]">
          <h3 className="font-serif text-sm font-bold text-[#1c1917]">
            Deep Review Inspector
          </h3>
          <span className="font-mono text-[11px] bg-white border border-[#e7e5e4] px-2 py-0.5 rounded text-[#57534e]">
            {activeFindings.length} Active Findings
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {activeFindings.length === 0 ? (
            <div className="rounded border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800">
              ✓ All semantic blocks and citations verified. Zero unresolved logical gaps or data drifts.
            </div>
          ) : (
            activeFindings.map(finding => {
              const isSelected = selectedBlockId === finding.blockId;
              return (
                <div
                  key={finding.findingId}
                  className={`rounded border p-3 text-xs transition space-y-2 ${
                    isSelected ? 'border-[#1c1917] bg-white shadow-sm' : 'border-[#e7e5e4] bg-white/60 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      finding.badgeType === 'CITATION_WARNING' ? 'bg-amber-100 text-amber-900' :
                      finding.badgeType === 'LOGICAL_GAP' ? 'bg-rose-100 text-rose-900' :
                      finding.badgeType === 'DATA_DRIFT' ? 'bg-orange-100 text-orange-900' : 'bg-blue-100 text-blue-900'
                    }`}>
                      {finding.badgeType}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectBlock(finding.blockId)}
                      className="text-[11px] text-[#2563eb] hover:underline"
                    >
                      Locate in draft →
                    </button>
                  </div>

                  <p className="text-[#44403c] leading-relaxed">
                    {finding.explanation}
                  </p>

                  {finding.replacementText && (
                    <div className="mt-2 pt-2 border-t border-[#f5f5f4]">
                      <div className="text-[10px] text-[#78716c] font-bold uppercase mb-1">Proposed Resolution:</div>
                      <div className="bg-[#f5f5f4] p-2 rounded text-[11px] font-mono text-[#1c1917]">
                        {finding.replacementText}
                      </div>
                      <button
                        type="button"
                        onClick={() => onApplyRemediation(finding)}
                        className="mt-2 w-full rounded bg-[#1c1917] hover:bg-black text-white py-1 text-[11px] font-semibold transition"
                      >
                        Apply Resolution
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-[#e7e5e4] text-[11px] text-[#78716c]">
        EdiTXT Forensic Auditor Swarm · PubMed &amp; Crossref Live Gate
      </div>
    </aside>
  );
}

export function getBadgeUnderlineClass(badgeType?: DeepReviewBadgeType): string {
  switch (badgeType) {
    case 'LOGICAL_GAP':
      return 'border-b-2 border-rose-500 bg-rose-50/50';
    case 'DATA_DRIFT':
      return 'border-b-2 border-orange-500 bg-orange-50/50';
    case 'CITATION_WARNING':
      return 'border-b-2 border-amber-500 bg-amber-50/50';
    case 'DISTILLATION_OPPORTUNITY':
      return 'border-b-2 border-blue-500 bg-blue-50/50';
    default:
      return '';
  }
}

