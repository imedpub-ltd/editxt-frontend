'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function PhaseNav({ documentId }: { documentId: string }) {
  const pathname = usePathname();
  const phases = [
    { label: 'Living Editor', href: `/editor/${documentId}`, match: '/editor/' },
    { label: 'Submit to Journal / Preprint', href: `/submit?doc=${documentId}`, match: '/submit' },
    { label: 'Post-Acceptance Checkout', href: `/checkout/${documentId}`, match: '/checkout/' }
  ];

  return (
    <header className="border-b border-[#e7e5e4] bg-white px-6 py-3">
      <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Breadcrumb" className="text-xs text-[#78716c]">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:underline">Publishing Portal</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/preprints" className="hover:underline">Editor Workspace</Link></li>
            <li aria-hidden="true">/</li>
            <li className="font-mono text-[#1c1917] font-semibold">{documentId}</li>
          </ol>
        </nav>
        <nav aria-label="Publication phases">
          <ol className="flex flex-wrap gap-2 text-xs">
            {phases.map((phase, index) => {
              const active = pathname?.startsWith(phase.match) ?? false;
              return (
                <li key={phase.label}>
                  <Link
                    href={phase.href}
                    className={`inline-flex items-center gap-1.5 rounded px-3 py-1 font-medium transition ${
                      active
                        ? 'bg-[#1c1917] text-white'
                        : 'border border-[#d6d3d1] text-[#44403c] hover:bg-[#f5f5f4]'
                    }`}
                  >
                    <span className="font-bold opacity-60">{index + 1}.</span>
                    {phase.label}
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </header>
  );
}
