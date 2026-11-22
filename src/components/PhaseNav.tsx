'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function PhaseNav({ documentId }: { documentId: string }) {
  const pathname = usePathname();
  const phases = [
    { label: 'Editor', href: `/editor/${documentId}`, match: '/editor/' },
    { label: 'Packaging', href: `/packaging/${documentId}`, match: '/packaging/' },
    { label: 'Arbitration', href: `/arbitration/bundle-${documentId}`, match: '/arbitration/' }
  ];

  return (
    <header className="border-b border-line bg-surface px-4 py-3 md:px-8">
      <nav aria-label="Breadcrumb" className="mb-2 text-xs text-ink-muted">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="underline-offset-2 hover:underline">Documents</Link></li>
          <li aria-hidden="true">/</li>
          <li className="font-mono">{documentId}</li>
        </ol>
      </nav>
      <nav aria-label="Publication phases">
        <ol className="flex flex-wrap gap-2">
          {phases.map((phase, index) => {
            const active = pathname?.startsWith(phase.match) ?? false;
            return (
              <li key={phase.label}>
                <Link
                  href={phase.href}
                  aria-current={active ? 'step' : undefined}
                  className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium ${
                    active ? 'border-accent bg-accent text-accent-ink' : 'border-line text-ink hover:bg-canvas'
                  }`}
                >
                  <span aria-hidden="true" className="text-xs">{index + 1}</span>
                  {phase.label}
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
}
