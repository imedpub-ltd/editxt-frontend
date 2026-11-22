'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type {
  CoResearcherCapability,
  EvidenceGraphV1,
  EvidenceRequest,
  EvidenceTargets,
  FormalCaseId
} from '../../../../src/core/integrations/coresearcher/contract';
import { READ_ONLY_POSTS } from '../../../../src/core/integrations/coresearcher/proxyPolicy';
import { CoResearcherProblem, EvidenceGraphView } from '../../components/EvidenceGraphView';
import { CoResearcherError, getCoResearcher, packageDownloadHref, postCoResearcher, requestEvidence } from '../../lib/coresearcherClient';

type Load<T> = { status: 'loading' } | { status: 'ready'; data: T } | { status: 'error'; httpStatus: number; message: string };

const failure = (error: unknown): Load<never> => ({
  status: 'error',
  httpStatus: error instanceof CoResearcherError ? error.status : 0,
  message: error instanceof Error ? error.message : 'Unexpected error'
});

/** GETs a CoResearcher resource through EdiTXT's proxy; `version` reloads it. */
function useCoResearcher<T>(path: string, version = 0): Load<T> {
  const [state, setState] = useState<{ key: string; load: Load<T> }>({ key: '', load: { status: 'loading' } });
  const key = `${path}#${version}`;
  useEffect(() => {
    let cancelled = false;
    getCoResearcher<T>(path)
      .then(data => !cancelled && setState({ key, load: { status: 'ready', data } }))
      .catch(error => !cancelled && setState({ key, load: failure(error) }));
    return () => {
      cancelled = true;
    };
  }, [path, key]);
  return state.key === key ? state.load : { status: 'loading' };
}

function Panel({ id, title, intro, children }: { id: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="rounded-lg border border-line bg-surface p-4 md:p-5">
      <h2 id={`${id}-title`} className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-ink-muted">{intro}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Loading<T>({ load, children }: { load: Load<T>; children: (data: T) => React.ReactNode }) {
  if (load.status === 'loading') return <p className="text-sm text-ink-muted">Loading…</p>;
  if (load.status === 'error') return <CoResearcherProblem status={load.httpStatus} message={load.message} />;
  return <>{children(load.data)}</>;
}

const MATURITY_TONE: Record<string, string> = {
  Integrated: 'bg-success-soft text-success',
  Tested: 'bg-success-soft text-success',
  Exercised: 'bg-warning-soft text-warning',
  Prototype: 'bg-danger-soft text-danger'
};

function Badge({ text, tone = 'bg-canvas text-ink-muted' }: { text: string; tone?: string }) {
  return <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-semibold ${tone}`}>{text}</span>;
}

// --------------------------------------------------------------------------- connection

function Connection() {
  const health = useCoResearcher<{ status: string; service: string; architecture_status?: string }>('health');
  return (
    <Loading load={health}>
      {data => (
        <p className="text-sm">
          <Badge text={data.status === 'healthy' ? '✓ connected' : data.status} tone="bg-success-soft text-success" /> {data.service}
        </p>
      )}
    </Loading>
  );
}

// --------------------------------------------------------------------------- evidence explorer

type TargetType = 'FORMAL_CASE' | 'LIFECYCLE_PROJECT' | 'RESEARCH_PACKAGE' | 'REGISTERED_CLAIM' | 'FORMAL_HYPOTHESIS' | 'QUESTION';

const EXAMPLE_HYPOTHESIS = JSON.stringify(
  {
    hypothesis_id: 'HYP-EXAMPLE',
    variables: [
      { name: 'ptau217', domain: ['low', 'intermediate', 'high'] },
      { name: 'decline', domain: ['fast', 'slow'] }
    ],
    assumptions: [],
    claims: ["ptau217 != 'high' or decline == 'fast'"]
  },
  null,
  2
);

interface EvidenceRun {
  sent: EvidenceRequest | null;
  result: Load<EvidenceGraphV1> | null;
  send: (request: EvidenceRequest) => Promise<void>;
}

function EvidenceExplorer({ run }: { run: EvidenceRun }) {
  const targets = useCoResearcher<EvidenceTargets>('evidence/targets');
  const [type, setType] = useState<TargetType>('FORMAL_CASE');
  const [id, setId] = useState('ptau217_two_cutoff');
  const [text, setText] = useState('');
  const [hypothesis, setHypothesis] = useState(EXAMPLE_HYPOTHESIS);
  const [consequences, setConsequences] = useState('');
  const { sent, result, send } = run;

  const build = (): EvidenceRequest | string => {
    if (type === 'QUESTION') return text.trim() ? { target: { type, text: text.trim() } } : 'Write a question first.';
    if (type === 'FORMAL_HYPOTHESIS') {
      try {
        const parsed = JSON.parse(hypothesis) as Record<string, unknown>;
        const list = consequences.split('\n').map(c => c.trim()).filter(Boolean);
        return { target: { type, hypothesis: parsed }, ...(list.length ? { scope: { consequences: list } } : {}) };
      } catch {
        return 'The hypothesis is not valid JSON.';
      }
    }
    if (!id) return 'Choose a target first.';
    if (type === 'FORMAL_CASE') return { target: { type, id: id as FormalCaseId } };
    return { target: { type, id } };
  };
  const built = build();

  const options = (data: EvidenceTargets): { id: string; label: string }[] => {
    switch (type) {
      case 'FORMAL_CASE':
        return data.FORMAL_CASE.map(c => ({ id: c.id, label: c.title }));
      case 'LIFECYCLE_PROJECT':
        return data.LIFECYCLE_PROJECT.map(p => ({ id: p.id, label: `${p.id} · ${p.title} (${p.stage})` }));
      case 'RESEARCH_PACKAGE':
        return data.RESEARCH_PACKAGE.map(p => ({ id: p.id, label: p.id }));
      case 'REGISTERED_CLAIM':
        return data.REGISTERED_CLAIM.map(r => ({ id: r.id, label: `Row ${r.id} · ${r.status} · ${r.claim}` }));
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Target type">
        {(['FORMAL_CASE', 'LIFECYCLE_PROJECT', 'RESEARCH_PACKAGE', 'REGISTERED_CLAIM', 'FORMAL_HYPOTHESIS', 'QUESTION'] as TargetType[]).map(t => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={type === t}
            onClick={() => {
              setType(t);
              setId('');
            }}
            className={`rounded-md border px-2.5 py-1 text-xs font-medium ${type === t ? 'border-accent bg-accent text-accent-ink' : 'border-line hover:bg-canvas'}`}
          >
            {t.replace(/_/g, ' ').toLowerCase()}
          </button>
        ))}
      </div>

      {type === 'QUESTION' && (
        <label className="block text-sm">
          Question
          <textarea value={text} onChange={e => setText(e.target.value)} rows={2} maxLength={1000} className="mt-1 w-full rounded-md border border-line bg-canvas p-2" />
          <span className="text-xs text-ink-muted">CoResearcher answers free text honestly: it reports that no evidence is linked and how to link some.</span>
        </label>
      )}
      {type === 'FORMAL_HYPOTHESIS' && (
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm">
            Formal hypothesis (JSON)
            <textarea value={hypothesis} onChange={e => setHypothesis(e.target.value)} rows={12} className="mt-1 w-full rounded-md border border-line bg-canvas p-2 font-mono text-xs" />
          </label>
          <label className="block text-sm">
            Consequences to check, one per line (optional, up to 10)
            <textarea value={consequences} onChange={e => setConsequences(e.target.value)} rows={12} className="mt-1 w-full rounded-md border border-line bg-canvas p-2 font-mono text-xs" />
          </label>
        </div>
      )}
      {type !== 'QUESTION' && type !== 'FORMAL_HYPOTHESIS' && (
        <Loading load={targets}>
          {data => {
            const list = options(data);
            return list.length === 0 ? (
              <p className="text-sm text-ink-muted">CoResearcher holds no targets of this type yet.</p>
            ) : (
              <label className="block text-sm">
                Target
                <select value={id} onChange={e => setId(e.target.value)} className="mt-1 w-full rounded-md border border-line bg-canvas p-2">
                  <option value="">Choose…</option>
                  {list.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
              </label>
            );
          }}
        </Loading>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={typeof built === 'string' || result?.status === 'loading'}
          onClick={() => typeof built !== 'string' && void send(built)}
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink disabled:opacity-50"
        >
          Request evidence
        </button>
        {typeof built === 'string' && <span className="text-xs text-ink-muted">{built}</span>}
        {result?.status === 'loading' && <span className="text-xs text-ink-muted">Asking CoResearcher… formal cases can take up to 20 seconds the first time.</span>}
      </div>

      {result?.status === 'error' && <CoResearcherProblem status={result.httpStatus} message={result.message} />}
      {result?.status === 'ready' && (
        <div className="rounded-md border border-line p-3">
          <EvidenceGraphView graph={result.data} />
          {sent && (
            <details className="mt-2 text-xs">
              <summary className="cursor-pointer text-accent">Request EdiTXT sent</summary>
              <pre className="mt-1 overflow-x-auto rounded bg-canvas p-2">{JSON.stringify(sent, null, 2).slice(0, 4000)}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------- lifecycle and packages

interface ProjectSummary {
  project_id: string;
  title: string;
  template: string;
  stage: string;
  version: number;
  releases?: unknown[];
}
interface GateEvaluation {
  decision: string;
  checks: { check: { check_id: string; description: string; kind: string; required: boolean }; status: string; reason: string }[];
}
interface Finding {
  project_id: string;
  kind: string;
  detail: string;
}

function GateDetail({ projectId }: { projectId: string }) {
  const gate = useCoResearcher<GateEvaluation>(`lifecycle/projects/${encodeURIComponent(projectId)}/gate`);
  return (
    <Loading load={gate}>
      {data => (
        <div className="mt-2 space-y-1 text-xs">
          <p>
            Current gate: <Badge text={data.decision} tone={data.decision === 'PASS' ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'} />
          </p>
          <ul className="space-y-0.5">
            {data.checks.map(c => (
              <li key={c.check.check_id}>
                <span className="font-mono">{c.check.check_id}</span> · {c.check.kind} · {c.status.toLowerCase()}
                {c.check.required ? '' : ' (optional)'} — <span className="text-ink-muted">{c.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Loading>
  );
}

function Lifecycle({ onEvidence }: { onEvidence: (request: EvidenceRequest) => void }) {
  const projects = useCoResearcher<{ projects: ProjectSummary[] }>('lifecycle/projects');
  const watch = useCoResearcher<{ findings: Finding[] }>('lifecycle/watch');
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      <Loading load={projects}>
        {data =>
          data.projects.length === 0 ? (
            <p className="text-sm text-ink-muted">No research projects on this CoResearcher server. Published packages below carry finished ones.</p>
          ) : (
            <ul className="divide-y divide-line rounded-md border border-line">
              {data.projects.map(p => (
                <li key={p.project_id} className="p-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{p.title}</span>
                    <Badge text={p.stage} />
                    <Badge text={`template ${p.template}`} />
                    <span className="font-mono text-xs text-ink-muted">v{p.version}</span>
                  </div>
                  <div className="mt-2 flex gap-2 text-xs">
                    <button type="button" className="underline" onClick={() => setOpen(open === p.project_id ? null : p.project_id)}>
                      {open === p.project_id ? 'Hide gate' : 'Show gate'}
                    </button>
                    <button type="button" className="underline" onClick={() => onEvidence({ target: { type: 'LIFECYCLE_PROJECT', id: p.project_id } })}>
                      Evidence graph
                    </button>
                  </div>
                  {open === p.project_id && <GateDetail projectId={p.project_id} />}
                </li>
              ))}
            </ul>
          )
        }
      </Loading>
      <Loading load={watch}>
        {data =>
          data.findings.length > 0 && (
            <div className="rounded-md border border-warning bg-warning-soft p-3 text-sm text-warning">
              <p className="font-semibold">Watcher findings</p>
              <ul className="ml-4 list-disc">
                {data.findings.map((f, i) => <li key={i}><span className="font-mono">{f.project_id}</span> · {f.kind}: {f.detail}</li>)}
              </ul>
            </div>
          )
        }
      </Loading>
    </div>
  );
}

interface PublishedPackage {
  name: string;
  bytes: number;
  sha256: string;
  lifecycle_digest: string | null;
  manifest_sha256: string | null;
  listed_in_index: boolean;
}

function Packages({ onEvidence }: { onEvidence: (request: EvidenceRequest) => void }) {
  const packages = useCoResearcher<{ packages: PublishedPackage[] }>('lifecycle/packages');
  return (
    <Loading load={packages}>
      {data =>
        data.packages.length === 0 ? (
          <p className="text-sm text-ink-muted">No published packages.</p>
        ) : (
          <ul className="divide-y divide-line rounded-md border border-line">
            {data.packages.map(p => (
              <li key={p.name} className="p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono">{p.name}</span>
                  <Badge text={p.listed_in_index ? '✓ digest published' : '⚠ not in package index'} tone={p.listed_in_index ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'} />
                  <span className="text-xs text-ink-muted">{(p.bytes / 1024).toFixed(1)} KiB</span>
                </div>
                <p className="mt-1 break-all font-mono text-xs text-ink-muted">sha256 {p.sha256}</p>
                <div className="mt-2 flex gap-3 text-xs">
                  <a className="underline" href={packageDownloadHref(p.name)} download>Download .crpkg</a>
                  <button type="button" className="underline" onClick={() => onEvidence({ target: { type: 'RESEARCH_PACKAGE', id: p.name } })}>
                    Verify and show evidence
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )
      }
    </Loading>
  );
}

// --------------------------------------------------------------------------- formal tools

interface ScenarioReport {
  status: string;
  rivals: { hypothesis_id: string; statement: string; not_formalized: string[] | string }[];
  evaluations: Record<string, { content_verdict: string; excluded_fraction_of_applicable: number }>;
  comparisons: { hypothesis_a: string; hypothesis_b: string; relation: string; forbidden_only_by_a: number; forbidden_only_by_b: number }[];
}

function FormalTools() {
  const [hypothesis, setHypothesis] = useState(EXAMPLE_HYPOTHESIS);
  const [evaluation, setEvaluation] = useState<Load<Record<string, unknown>> | null>(null);
  const [showScenario, setShowScenario] = useState(false);

  const evaluate = async () => {
    setEvaluation({ status: 'loading' });
    try {
      const parsed = JSON.parse(hypothesis) as unknown;
      setEvaluation({ status: 'ready', data: await postCoResearcher<Record<string, unknown>>('hypotheses/evaluate', { hypothesis: parsed }) });
    } catch (error) {
      setEvaluation(error instanceof SyntaxError ? { status: 'error', httpStatus: 400, message: 'The hypothesis is not valid JSON.' } : failure(error));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm">
          Evaluate a formal hypothesis: is it vacuous, unfalsifiable, self-contradictory? Which states would refute it?
          <textarea value={hypothesis} onChange={e => setHypothesis(e.target.value)} rows={10} className="mt-1 w-full rounded-md border border-line bg-canvas p-2 font-mono text-xs" />
        </label>
        <button type="button" onClick={() => void evaluate()} className="mt-2 rounded-md border border-line px-3 py-1.5 text-sm hover:bg-canvas">
          Evaluate
        </button>
        {evaluation?.status === 'loading' && <p className="mt-2 text-sm text-ink-muted">Evaluating…</p>}
        {evaluation?.status === 'error' && <div className="mt-2"><CoResearcherProblem status={evaluation.httpStatus} message={evaluation.message} /></div>}
        {evaluation?.status === 'ready' && (
          <div className="mt-2 rounded-md border border-line p-3 text-sm">
            <p>
              Content verdict: <Badge text={String(evaluation.data.content_verdict)} tone={evaluation.data.content_verdict === 'FALSIFIABLE' ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'} />{' '}
              <span className="text-xs text-ink-muted">decided by {String(evaluation.data.backend)}</span>
            </p>
            <pre className="mt-2 overflow-x-auto rounded bg-canvas p-2 text-xs">{JSON.stringify(evaluation.data, null, 2).slice(0, 4000)}</pre>
          </div>
        )}
      </div>
      <div>
        <button type="button" onClick={() => setShowScenario(!showScenario)} className="text-sm underline">
          {showScenario ? 'Hide' : 'Show'} the formal Alzheimer rival hypotheses
        </button>
        {showScenario && <Scenario />}
      </div>
    </div>
  );
}

function Scenario() {
  const report = useCoResearcher<ScenarioReport>('hypotheses/scenarios/alzheimer');
  return (
    <Loading load={report}>
      {data => (
        <div className="mt-2 space-y-2 text-sm">
          <p className="text-xs text-ink-muted">{data.status}</p>
          <ul className="space-y-1">
            {data.rivals.map(r => (
              <li key={r.hypothesis_id}>
                <span className="font-mono text-xs">{r.hypothesis_id}</span> <Badge text={data.evaluations[r.hypothesis_id]?.content_verdict ?? '?'} /> {r.statement}
              </li>
            ))}
          </ul>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-ink-muted"><th className="py-1 pr-2">A</th><th className="pr-2">B</th><th className="pr-2">Relation</th><th>States separating them</th></tr>
              </thead>
              <tbody>
                {data.comparisons.map((c, i) => (
                  <tr key={i} className="border-t border-line">
                    <td className="py-1 pr-2 font-mono">{c.hypothesis_a}</td>
                    <td className="pr-2 font-mono">{c.hypothesis_b}</td>
                    <td className="pr-2">{c.relation}</td>
                    <td>{c.forbidden_only_by_a} only by A · {c.forbidden_only_by_b} only by B</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Loading>
  );
}

// --------------------------------------------------------------------------- capability catalogue

function Capabilities() {
  const catalogue = useCoResearcher<{ version: string; capabilities: CoResearcherCapability[] }>('capabilities');
  const [filter, setFilter] = useState('');
  const [group, setGroup] = useState('');
  return (
    <Loading load={catalogue}>
      {data => {
        const groups = [...new Set(data.capabilities.map(c => c.group.split('/')[0] ?? c.group))].sort();
        const shown = data.capabilities.filter(
          c => (!group || c.group.startsWith(group)) && (!filter || `${c.method} ${c.path} ${c.description ?? ''}`.toLowerCase().includes(filter.toLowerCase()))
        );
        const levels = new Map<string, number>();
        for (const c of data.capabilities) for (const m of c.modules) levels.set(m.maturity, (levels.get(m.maturity) ?? 0) + 1);
        return (
          <div className="space-y-3">
            <p className="text-sm">
              {data.capabilities.length} endpoints (API {data.version}). Module references by maturity:{' '}
              {[...levels.entries()].map(([level, n]) => <Badge key={level} text={`${level} ${n}`} tone={MATURITY_TONE[level]} />)}
            </p>
            <div className="flex flex-wrap gap-2">
              <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter" aria-label="Filter capabilities" className="rounded-md border border-line bg-canvas px-2 py-1 text-sm" />
              <select value={group} onChange={e => setGroup(e.target.value)} aria-label="Group" className="rounded-md border border-line bg-canvas px-2 py-1 text-sm">
                <option value="">All groups</option>
                {groups.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <details open={Boolean(filter || group)}>
              <summary className="cursor-pointer text-sm text-accent">
                {filter || group ? `${shown.length} matching endpoints` : `Show all ${shown.length} endpoints`}
              </summary>
            <ul className="mt-2 divide-y divide-line rounded-md border border-line">
              {shown.map(c => {
                const forwarded = c.method === 'GET' || READ_ONLY_POSTS.includes(c.path);
                return (
                  <li key={`${c.method} ${c.path}`} className="p-2 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono font-semibold">{c.method}</span>
                      <span className="break-all font-mono">{c.path}</span>
                      <Badge text={c.operationClass === 'READ_ONLY' ? 'read-only' : 'changes state'} />
                      {c.determinism === 'DETERMINISTIC' && <Badge text="deterministic" />}
                      {c.requiresApiKey && <Badge text="key" />}
                      <Badge text={forwarded ? 'usable from EdiTXT' : 'writes off in EdiTXT'} tone={forwarded ? 'bg-success-soft text-success' : 'bg-canvas text-ink-muted'} />
                      {c.modules.map(m => <Badge key={m.module} text={`${m.module} · ${m.maturity}`} tone={MATURITY_TONE[m.maturity]} />)}
                    </div>
                    {c.description && <p className="mt-1 text-ink-muted">{c.description}</p>}
                  </li>
                );
              })}
            </ul>
            </details>
          </div>
        );
      }}
    </Loading>
  );
}

// --------------------------------------------------------------------------- page

export default function CoResearcherWorkspace() {
  const [sent, setSent] = useState<EvidenceRequest | null>(null);
  const [result, setResult] = useState<Load<EvidenceGraphV1> | null>(null);
  const send = async (request: EvidenceRequest) => {
    setSent(request);
    setResult({ status: 'loading' });
    try {
      setResult({ status: 'ready', data: await requestEvidence(request) });
    } catch (error) {
      setResult(failure(error));
    }
  };
  const sections = useMemo(
    () => [
      ['evidence', 'Evidence'],
      ['lifecycle', 'Research projects'],
      ['packages', 'Packages'],
      ['formal', 'Formal tools'],
      ['capabilities', 'Capabilities']
    ],
    []
  );
  const showEvidence = (request: EvidenceRequest) => {
    document.getElementById('evidence')?.scrollIntoView({ behavior: 'smooth' });
    void send(request);
  };

  return (
    <main className="mx-auto w-full max-w-5xl space-y-5 px-4 py-8 md:px-8">
      <nav aria-label="Breadcrumb" className="text-xs text-ink-muted">
        <Link href="/" className="hover:underline">Documents</Link> / CoResearcher
      </nav>
      <header>
        <h1 className="text-2xl font-semibold">CoResearcher workspace</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Everything CoResearcher holds, through EdiTXT: evidence for claims, research projects and their gates, published research packages,
          formal hypothesis tools and the full capability catalogue. CoResearcher reports evidence and gaps; it does not grade manuscripts.
        </p>
        <div className="mt-2"><Connection /></div>
        <nav aria-label="Sections" className="mt-3 flex flex-wrap gap-2 text-sm">
          {sections.map(([id, label]) => <a key={id} href={`#${id}`} className="rounded-md border border-line px-2.5 py-1 hover:bg-canvas">{label}</a>)}
        </nav>
      </header>

      <Panel id="evidence" title="Evidence" intro="Send an EvidenceRequest and see the EvidenceGraph: what supports the target, which tool decided each result, and every gap.">
        <EvidenceExplorer run={{ sent, result, send }} />
      </Panel>
      <Panel id="lifecycle" title="Research projects" intro="Projects pass stage gates from question to report. An agent cannot certify its own work; releases list every criterion not met.">
        <Lifecycle onEvidence={showEvidence} />
      </Panel>
      <Panel id="packages" title="Published research packages" intro="Each .crpkg carries a project's full history and artifacts, verified on import. Its digests are published in CoResearcher's package index.">
        <Packages onEvidence={showEvidence} />
      </Panel>
      <Panel id="formal" title="Formal tools" intro="Exact evaluation of formal hypotheses over their declared states, and the formal Alzheimer rivals with the states that separate them.">
        <FormalTools />
      </Panel>
      <Panel id="capabilities" title="Capabilities" intro="Every CoResearcher endpoint with its maturity. Nothing is hidden: prototypes are listed and marked as such.">
        <Capabilities />
      </Panel>
    </main>
  );
}
