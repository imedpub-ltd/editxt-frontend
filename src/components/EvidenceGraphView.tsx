'use client';

import type { EvidenceGraphV1, EvidenceNode } from '../../../src/core/integrations/coresearcher/contract';
import { gapsByKind } from '../../../src/core/integrations/coresearcher/evidenceTrace';

const KIND_LABEL: Record<string, string> = {
  verification: 'Verifier result',
  review: 'Review',
  artifact: 'Artifact',
  measure: 'Measure',
  gate: 'Gate passed',
  release: 'Release',
  criterion: 'Pre-registered criterion',
  assumption: 'Assumption',
  rival: 'Rival hypothesis',
  consequence: 'Consequence',
  script: 'Script or test',
  claim: 'Manuscript claim',
  AGENT_PREPRINT: 'Agent preprint bundle',
  PREPRINT_AUDIT_FINDING: 'Preprint audit finding',
  DEFEATED_HYPOTHESIS: 'Defeated hypothesis (Graveyard)',
  NEGATIVE_RESULT_WITNESS: 'Negative result witness'
};

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  const text = JSON.stringify(value);
  return text.length > 240 ? `${text.slice(0, 240)}…` : text;
}

const ORIGIN_LABEL: Record<string, string> = {
  SUPPLIED: 'supplied in the input',
  LITERATURE: 'from the literature',
  PERSON: 'stated by a person',
  SYSTEM: 'proposed by the system',
  UNDECLARED: 'origin not declared'
};

/** Where a premise came from, and whether data tested it. Provenance only: it never changes a verdict. */
function PremiseOrigin({ attributes }: { attributes: Record<string, unknown> }) {
  if (typeof attributes.origin !== 'string') return null;
  const tested = attributes.tested_against_data === true;
  return (
    <p className="mt-1 flex flex-wrap gap-1 text-xs">
      <span className="rounded bg-canvas px-1.5 py-0.5 text-ink-muted">Premise {ORIGIN_LABEL[attributes.origin] ?? attributes.origin}</span>
      <span className={`rounded px-1.5 py-0.5 ${tested ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'}`}>
        {tested ? 'tested against data' : 'not tested against data'}
      </span>
    </p>
  );
}

function NodeCard({ node }: { node: EvidenceNode }) {
  const entries = Object.entries(node.attributes);
  return (
    <div className="rounded-md border border-line p-2">
      <p className="text-xs uppercase tracking-wide text-ink-muted">{KIND_LABEL[node.kind] ?? node.kind.replace(/_/g, ' ')}</p>
      <p className="break-words font-medium">{node.label}</p>
      {node.kind === 'assumption' && <PremiseOrigin attributes={node.attributes} />}
      {entries.length > 0 && (
        <details className="mt-1">
          <summary className="cursor-pointer text-xs text-accent">Details ({entries.length})</summary>
          <dl className="mt-1 space-y-0.5 text-xs">
            {entries.map(([key, value]) => (
              <div key={key} className="break-words">
                <dt className="inline text-ink-muted">{key}: </dt>
                <dd className="inline font-mono">{formatValue(value)}</dd>
              </div>
            ))}
          </dl>
        </details>
      )}
    </div>
  );
}

/**
 * Shows a CoResearcher EvidenceGraph as CoResearcher returned it. Gaps come first and are never collapsed: the
 * editor reports evidence and its gaps, it does not grade the claim (AI_RULES §2).
 */
export function EvidenceGraphView({ graph, compact = false }: { graph: EvidenceGraphV1; compact?: boolean }) {
  const byId = new Map(graph.nodes.map(n => [n.id, n]));
  const focus = byId.get(graph.focus);
  const fromFocus = graph.edges.filter(e => e.source === graph.focus || e.target === graph.focus);
  const others = graph.nodes.filter(n => n.id !== graph.focus && !fromFocus.some(e => e.source === n.id || e.target === n.id));
  const gaps = gapsByKind(graph);
  const agentPreprintNode = graph.nodes.find(n => n.kind === 'AGENT_PREPRINT');
  const defeatedHypothesisNode = graph.nodes.find(n => n.kind === 'DEFEATED_HYPOTHESIS');

  return (
    <div className="space-y-3 text-sm">
      {focus && (
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-muted">Evidence for</p>
          <p className="font-semibold">{focus.label}</p>
        </div>
      )}

      {agentPreprintNode && (
        <section
          aria-label="Dual Anchor Preprint Verification"
          className="rounded-md border border-line bg-canvas p-3 text-xs space-y-1.5"
        >
          <p className="font-semibold uppercase tracking-wide text-ink-muted">
            Dual-Anchor Verification (ADR-DISCOVERY-115)
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded border border-line px-2 py-0.5 font-mono">
              Zenodo Cold DOI:{' '}
              {typeof agentPreprintNode.attributes.zenodo_doi === 'string'
                ? agentPreprintNode.attributes.zenodo_doi
                : 'pending'}
            </span>
            <span className="rounded border border-line px-2 py-0.5 font-mono">
              Agent Preprint Receipt: {agentPreprintNode.label} ·{' '}
              {typeof agentPreprintNode.attributes.verdict === 'string'
                ? agentPreprintNode.attributes.verdict
                : 'UNVERIFIED'}{' '}
              (
              {typeof agentPreprintNode.attributes.gates_passed === 'number'
                ? agentPreprintNode.attributes.gates_passed
                : 0}
              /
              {typeof agentPreprintNode.attributes.gates_total === 'number'
                ? agentPreprintNode.attributes.gates_total
                : 5}{' '}
              gates)
            </span>
          </div>
          {typeof agentPreprintNode.attributes.receipt_sha256 === 'string' && (
            <p className="font-mono text-ink-muted">
              Receipt SHA-256: {agentPreprintNode.attributes.receipt_sha256.slice(0, 16)}…
            </p>
          )}
        </section>
      )}

      {defeatedHypothesisNode && (
        <section
          aria-label="Ego-Free Hypothesis Graveyard Notice"
          className="rounded-md border border-warning bg-warning-soft p-3 text-xs text-warning space-y-1"
        >
          <p className="font-semibold uppercase tracking-wide">
            Ego-Free Retraction &amp; Hypothesis Graveyard (ADR-DISCOVERY-116)
          </p>
          <p>
            <span className="font-mono">{defeatedHypothesisNode.label}</span>
            {typeof defeatedHypothesisNode.attributes.graveyard_record_id === 'string' && (
              <> · Graveyard ID: <span className="font-mono">{defeatedHypothesisNode.attributes.graveyard_record_id}</span></>
            )}
          </p>
          {typeof defeatedHypothesisNode.attributes.duhem_quine_autopsy_verdict === 'string' && (
            <p>Autopsy: {defeatedHypothesisNode.attributes.duhem_quine_autopsy_verdict}</p>
          )}
          {typeof defeatedHypothesisNode.attributes.successor_hypothesis_id === 'string' && (
            <p>
              Successor Pivot:{' '}
              <span className="font-mono">{defeatedHypothesisNode.attributes.successor_hypothesis_id}</span>
            </p>
          )}
        </section>
      )}

      <section aria-label="Gaps" className={gaps.length ? 'rounded-md border border-warning bg-warning-soft p-3 text-warning' : 'rounded-md border border-success bg-success-soft p-3 text-success'}>
        <p className="font-semibold">{gaps.length ? `⚠ ${graph.gaps.length} gap${graph.gaps.length === 1 ? '' : 's'} reported by CoResearcher` : '✓ CoResearcher reports no gaps'}</p>
        {gaps.length > 0 && (
          <ul className="mt-2 space-y-2">
            {gaps.map(group => (
              <li key={group.kind}>
                <p className="font-mono text-xs">{group.kind}</p>
                <ul className="ml-4 list-disc">
                  {group.descriptions.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      {fromFocus.length > 0 && (
        <section aria-label="Linked evidence" className="space-y-2">
          <p className="font-semibold">Linked evidence</p>
          {fromFocus.map((edge, i) => {
            const otherId = edge.source === graph.focus ? edge.target : edge.source;
            const other = byId.get(otherId);
            return (
              <div key={i} className="space-y-1">
                <p className="text-xs text-ink-muted">
                  <span className="font-mono">{edge.source === graph.focus ? edge.relation : `← ${edge.relation}`}</span>
                  {edge.justification && <> · {edge.justification}</>}
                </p>
                {other && <NodeCard node={other} />}
              </div>
            );
          })}
        </section>
      )}

      {!compact && others.length > 0 && (
        <details>
          <summary className="cursor-pointer font-semibold">Further nodes ({others.length})</summary>
          <div className="mt-2 space-y-2">
            {others.map(node => <NodeCard key={node.id} node={node} />)}
          </div>
        </details>
      )}

      <div className="border-t border-line pt-2 text-xs text-ink-muted">
        <p>
          Graph <span className="font-mono">{graph.graph_id}</span> · digest <span className="font-mono">{graph.provenance.digest.slice(0, 12)}…</span> ·{' '}
          {new Date(graph.provenance.generated_at).toLocaleString()}
        </p>
        <p>Sources: {graph.provenance.sources.join(', ') || '—'}</p>
        <p className="mt-1">{graph.provenance.boundary}</p>
      </div>
    </div>
  );
}

/** Explains why CoResearcher could not answer, with what to do about it. */
export function CoResearcherProblem({ status, message }: { status: number; message: string }) {
  const notConfigured = status === 503 && /not configured|CORESEARCHER_/.test(message);
  return (
    <div role="status" className="rounded-md border border-line bg-canvas p-3 text-sm">
      <p className="font-semibold">{notConfigured ? 'CoResearcher is not connected' : status === 503 ? 'CoResearcher is unavailable' : 'CoResearcher could not answer'}</p>
      <p className="mt-1 text-ink-muted">{message}</p>
      {notConfigured && (
        <p className="mt-1 text-xs text-ink-muted">
          Set <span className="font-mono">CORESEARCHER_URL</span> and <span className="font-mono">CORESEARCHER_API_KEY</span> in the root <span className="font-mono">.env</span> (see docs/CONFIGURATION.md).
        </p>
      )}
    </div>
  );
}
