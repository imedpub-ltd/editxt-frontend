'use client';

import { use, useState } from 'react';
import { PhaseNav } from '../../../components/PhaseNav';
import { invokeCapability } from '../../../lib/capabilityClient';
import { anchors, blocks, gateInputs, MANUSCRIPT_TITLE, reviewFindings, type Segment } from '../../../lib/fixtures';

interface Message {
  id: number;
  sender: string;
  text: string;
  author: boolean;
}

interface GateStep {
  step: string;
  status: 'passed' | 'blocked' | 'informational' | 'skipped';
  detail: string;
}

interface GateResult {
  status: 'accepted' | 'blocked';
  blockedAt: string | null;
  steps: GateStep[];
  chainTraceId: string;
}

const SEVERITY_LABEL: Record<string, string> = { critical: 'Critical', major: 'Major', minor: 'Minor' };

export default function ArbitrationPage({ params }: { params: Promise<{ bundleId: string }> }) {
  const { bundleId } = use(params);
  const documentId = bundleId.replace(/^bundle-/, '');

  const [findings, setFindings] = useState(reviewFindings.map(f => ({ ...f, resolved: f.resolved })));
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      sender: 'MetaReviewer (simulated)',
      text: 'The EpistemicReviewer flagged a major issue in the fragment "forgetting is fully mitigated". It is not supported by the EvidenceTraceArtifact.',
      author: false
    }
  ]);
  const [draft, setDraft] = useState('');
  const [gates, setGates] = useState<{ status: 'idle' | 'running' } | { status: 'done'; result: GateResult; traceId: string } | { status: 'error'; message: string }>({ status: 'idle' });

  const blocking = findings.filter(f => f.severity === 'critical' && !f.resolved);

  const toggleResolved = (id: string) => {
    setFindings(prev => prev.map(f => (f.id === id ? { ...f, resolved: !f.resolved } : f)));
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const nextId = messages.length;
    setMessages(prev => [
      ...prev,
      { id: nextId, sender: 'Author (you)', text, author: true },
      {
        id: nextId + 1,
        sender: 'MetaReviewer (simulated)',
        text: 'Noted. A ChangeSet that rewrites the claim will let me re-check this finding. Replies are not generated yet.',
        author: false
      }
    ]);
    setDraft('');
  };

  const runGates = async () => {
    setGates({ status: 'running' });
    try {
      const { output, traceId } = await invokeCapability<GateResult>('publishing.run_gates', {
        manuscriptId: documentId,
        bundleId,
        citations: gateInputs.citations,
        literatureQueries: gateInputs.literatureQueries,
        humanReviewerId: gateInputs.humanReviewerId,
        agentModelVersion: gateInputs.agentModelVersion,
        venueName: gateInputs.venueName,
        reviewFindings: findings.map(({ id, severity, resolved }) => ({ id, severity, resolved })),
        anchors
      });
      setGates({ status: 'done', result: output, traceId });
    } catch (error) {
      setGates({ status: 'error', message: error instanceof Error ? error.message : 'Unexpected error' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PhaseNav documentId={documentId} />

      <div className="flex flex-1 flex-col lg:flex-row">
        <main aria-labelledby="manuscript-title" className="flex-1 px-4 py-8 md:px-8 lg:border-r lg:border-line">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <h1 id="manuscript-title" className="text-2xl font-semibold">{MANUSCRIPT_TITLE}</h1>
              <span className="rounded bg-warning-soft px-2 py-0.5 text-xs font-semibold text-warning">Under arbitration · read only</span>
            </div>

            <div className="mt-8 space-y-4 text-lg leading-relaxed">
              {blocks.map(block => {
                const blockFindings = findings.filter(f => f.targetBlockId === block.id && !f.resolved);
                return (
                  <section key={block.id} id={`block-${block.id}`} aria-label={`Block ${block.id}`} className="scroll-mt-6 rounded-lg border border-transparent p-3 target:border-accent target:bg-surface">
                    <p>{block.segments.map((s: Segment, i) => <span key={i}>{s.kind === 'text' ? s.text : s.display}</span>)}</p>
                    {blockFindings.length > 0 && (
                      <p className="mt-2 text-sm text-ink-muted">
                        {blockFindings.length} open finding(s) on this block
                      </p>
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        </main>

        <aside aria-label="Findings and arbitration" className="w-full space-y-8 px-4 py-8 md:px-6 lg:w-[28rem]">
          <section aria-labelledby="findings-heading">
            <h2 id="findings-heading" className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Findings</h2>
            <p role="status" className={`mt-2 text-sm font-medium ${blocking.length > 0 ? 'text-danger' : 'text-success'}`}>
              {blocking.length === 0 ? 'No blocking findings open.' : `${blocking.length} blocking finding(s) must be resolved before publication.`}
            </p>

            <ul className="mt-3 space-y-3">
              {findings.map(f => (
                <li key={f.id} id={`finding-${f.id}`} className="rounded-md border border-line bg-surface p-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${f.severity === 'critical' ? 'bg-danger-soft text-danger' : 'bg-warning-soft text-warning'}`}>
                      {SEVERITY_LABEL[f.severity]}{f.severity === 'critical' && !f.resolved ? ' · blocking' : ''}
                    </span>
                    <span className="text-ink-muted">{f.reviewerId}</span>
                  </div>
                  <p className="mt-2">{f.description}</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <a href={`#block-${f.targetBlockId}`} className="text-accent underline underline-offset-2">Go to paragraph</a>
                    <button type="button" onClick={() => toggleResolved(f.id)} aria-pressed={f.resolved} className="underline underline-offset-2">
                      {f.resolved ? 'Marked resolved (not saved)' : 'Mark resolved (not saved)'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="gates-heading">
            <h2 id="gates-heading" className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Publication gates</h2>
            <p className="mt-2 text-xs text-ink-muted">
              The citation gate checks the fixture citation against Crossref. Without network access it blocks, by design.
            </p>
            <button
              type="button"
              onClick={runGates}
              disabled={gates.status === 'running'}
              aria-busy={gates.status === 'running'}
              className="mt-3 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink disabled:opacity-50"
            >
              {gates.status === 'running' ? 'Running gates…' : 'Run publication gates'}
            </button>

            <div aria-live="polite" className="mt-3">
              {gates.status === 'done' && (
                <>
                  <p className={`text-sm font-semibold ${gates.result.status === 'accepted' ? 'text-success' : 'text-danger'}`}>
                    {gates.result.status === 'accepted' ? '✓ Accepted' : `✕ Blocked at ${gates.result.blockedAt}`}
                  </p>
                  <ol className="mt-2 space-y-1 text-sm">
                    {gates.result.steps.map(s => (
                      <li key={s.step}>
                        <span className="font-medium">{s.step}</span> · {s.status} · <span className="text-ink-muted">{s.detail}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-2 break-all font-mono text-xs text-ink-muted">chain trace {gates.result.chainTraceId.slice(0, 16)}…</p>
                </>
              )}
              {gates.status === 'error' && <p role="alert" className="text-sm text-danger">Gates unavailable: {gates.message}</p>}
            </div>
          </section>

          <section aria-labelledby="chat-heading">
            <h2 id="chat-heading" className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Arbitration chat</h2>
            <div aria-live="polite" className="mt-3 max-h-80 space-y-3 overflow-y-auto">
              {messages.map(m => (
                <div key={m.id} className={`rounded-md p-3 text-sm ${m.author ? 'ml-6 bg-accent text-accent-ink' : 'mr-6 border border-line bg-surface'}`}>
                  <p className="text-xs font-semibold opacity-80">{m.sender}</p>
                  <p className="mt-1">{m.text}</p>
                </div>
              ))}
            </div>
            <form
              className="mt-3 flex gap-2"
              onSubmit={e => {
                e.preventDefault();
                send();
              }}
            >
              <label htmlFor="chat-input" className="sr-only">Message to the MetaReviewer</label>
              <input
                id="chat-input"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="Reply to the MetaReviewer"
                className="min-w-0 flex-1 rounded-md border border-line bg-surface px-3 py-2 text-sm"
              />
              <button type="submit" disabled={!draft.trim()} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink disabled:opacity-50">
                Send
              </button>
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}
