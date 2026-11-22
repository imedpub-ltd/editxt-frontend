'use client';

import Link from 'next/link';
import { use, useState } from 'react';
import { PhaseNav } from '../../../components/PhaseNav';
import { invokeCapability } from '../../../lib/capabilityClient';
import { journal } from '../../../lib/fixtures';

interface ValidationResult {
  journal: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

type State =
  | { status: 'idle' }
  | { status: 'running' }
  | { status: 'done'; result: ValidationResult; traceId: string }
  | { status: 'error'; message: string };

export default function PackagingPage({ params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = use(params);
  const [state, setState] = useState<State>({ status: 'idle' });

  const validate = async () => {
    setState({ status: 'running' });
    try {
      const { output, traceId } = await invokeCapability<ValidationResult>('publishing.validate_template', {
        journal: journal.name,
        figureCount: journal.figureCount,
        referenceIds: journal.referenceIds
      });
      setState({ status: 'done', result: output, traceId });
    } catch (error) {
      setState({ status: 'error', message: error instanceof Error ? error.message : 'Unexpected error' });
    }
  };

  const passed = state.status === 'done' && state.result.isValid;

  return (
    <div className="flex min-h-screen flex-col">
      <PhaseNav documentId={documentId} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-8">
        <h1 className="text-2xl font-semibold">Packaging gate</h1>
        <p className="mt-1 text-sm text-ink-muted">Checks the manuscript against the journal template before arbitration.</p>

        <dl className="mt-6 grid gap-4 rounded-lg border border-line bg-surface p-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-ink-muted">Journal template</dt>
            <dd className="font-medium">{journal.name}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Figures</dt>
            <dd className="font-medium">{journal.figureCount}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">References</dt>
            <dd className="font-medium">{journal.referenceIds.length}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={validate}
            disabled={state.status === 'running'}
            aria-busy={state.status === 'running'}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink disabled:opacity-50"
          >
            {state.status === 'running' ? 'Validating…' : 'Validate against template'}
          </button>
          {passed && (
            <Link href={`/arbitration/bundle-${documentId}`} className="rounded-md border border-line px-4 py-2 text-sm font-medium hover:bg-surface">
              Continue to arbitration →
            </Link>
          )}
        </div>

        <div aria-live="polite" className="mt-6 space-y-3">
          {state.status === 'done' && state.result.isValid && (
            <p className="rounded-md bg-success-soft p-3 text-sm font-medium text-success">✓ Passes the {journal.name} template checks.</p>
          )}
          {state.status === 'done' && !state.result.isValid && (
            <div className="rounded-md bg-danger-soft p-3 text-sm text-danger">
              <p className="font-semibold">✕ {state.result.errors.length} blocking problem(s)</p>
              <ul className="mt-1 list-disc pl-5">
                {state.result.errors.map(e => <li key={e}>{e}</li>)}
              </ul>
            </div>
          )}
          {state.status === 'done' && state.result.warnings.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-warning">
              {state.result.warnings.map(w => <li key={w}>{w}</li>)}
            </ul>
          )}
          {state.status === 'error' && (
            <p role="alert" className="text-sm text-danger">Validation unavailable: {state.message}</p>
          )}
        </div>

        {state.status === 'done' && (
          <p className="mt-6 break-all font-mono text-xs text-ink-muted">trace {state.traceId}</p>
        )}
      </main>
    </div>
  );
}
