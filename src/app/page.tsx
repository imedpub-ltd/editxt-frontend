import Link from 'next/link';
import { DOCUMENT_ID, MANUSCRIPT_TITLE } from '../lib/fixtures';

export default function DocumentsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8">
      <h1 className="text-2xl font-semibold">Documents</h1>
      <p className="mt-1 text-sm text-ink-muted">Prototype data. Nothing here is saved yet.</p>

      <ul className="mt-6 divide-y divide-line rounded-lg border border-line bg-surface">
        <li className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-medium">{MANUSCRIPT_TITLE}</h2>
            <span className="rounded bg-warning-soft px-2 py-0.5 text-xs font-semibold text-warning">Draft</span>
          </div>
          <p className="mt-1 font-mono text-xs text-ink-muted">{DOCUMENT_ID}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link className="rounded-md border border-line px-3 py-1.5 hover:bg-canvas" href={`/editor/${DOCUMENT_ID}`}>Open editor</Link>
            <Link className="rounded-md border border-line px-3 py-1.5 hover:bg-canvas" href={`/packaging/${DOCUMENT_ID}`}>Packaging</Link>
            <Link className="rounded-md border border-line px-3 py-1.5 hover:bg-canvas" href={`/arbitration/bundle-${DOCUMENT_ID}`}>Arbitration</Link>
          </div>
        </li>
      </ul>

      <section className="mt-8 rounded-lg border border-line bg-surface p-4">
        <h2 className="font-medium">CoResearcher</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Evidence for claims, research projects and their gates, published research packages, formal hypothesis tools and every CoResearcher capability.
        </p>
        <Link className="mt-3 inline-block rounded-md border border-line px-3 py-1.5 text-sm hover:bg-canvas" href="/coresearcher">Open CoResearcher workspace</Link>
      </section>
    </main>
  );
}
