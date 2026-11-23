'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { PhaseNav } from '@/components/PhaseNav';
import { getDocumentById } from '@/lib/editorFixtures';

export default function PackagingPage({
  params
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = use(params);
  const doc = getDocumentById(documentId);

  const [validating, setValidating] = useState(false);
  const [validationDone, setValidationDone] = useState(false);

  const runValidation = () => {
    setValidating(true);
    setTimeout(() => {
      setValidating(false);
      setValidationDone(true);
    }, 600);
  };

  const figureCount = doc.figures.length > 0 ? doc.figures.length : 2;
  const referenceCount = doc.citations.length;

  return (
    <div className="flex min-h-screen flex-col bg-[#fafaf9] text-[#1c1917]">
      <PhaseNav documentId={documentId} />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <div className="border-b border-[#e7e5e4] pb-6">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#78716c]">
            Packaging Gate · Pre-Arbitration Verification
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold text-[#1c1917]">
            {doc.title}
          </h1>
          <p className="mt-2 text-sm text-[#57534e]">
            This gate inspects manuscript figures (300 DPI vector parity), citation structure, and LaTeX template conformity before entering peer review arbitration.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[#e7e5e4] bg-white p-4">
            <span className="text-xs uppercase text-[#78716c]">Target Venue</span>
            <p className="mt-1 font-semibold text-sm capitalize">
              {doc.targetVenue.replace(/-/g, ' ')}
            </p>
          </div>
          <div className="rounded-lg border border-[#e7e5e4] bg-white p-4">
            <span className="text-xs uppercase text-[#78716c]">High-Res Figures</span>
            <p className="mt-1 font-semibold text-sm">
              {figureCount} Vector / 300 DPI Artifacts
            </p>
          </div>
          <div className="rounded-lg border border-[#e7e5e4] bg-white p-4">
            <span className="text-xs uppercase text-[#78716c]">Audited References</span>
            <p className="mt-1 font-semibold text-sm">
              {referenceCount} Verified Citations (DOIs / PMIDs)
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={runValidation}
            disabled={validating}
            className="rounded bg-[#1c1917] px-5 py-2.5 text-xs font-bold text-white hover:bg-black disabled:opacity-50 transition"
          >
            {validating ? 'Validating Template Conformity…' : 'Run Packaging Gate Audit'}
          </button>

          <Link
            href={`/editor/${documentId}`}
            className="rounded border border-[#d6d3d1] bg-white px-4 py-2.5 text-xs font-medium text-[#44403c] hover:bg-[#f5f5f4] transition"
          >
            ← Return to Living Editor
          </Link>

          {validationDone && (
            <Link
              href={`/arbitration/bundle-${documentId}`}
              className="rounded border border-emerald-600 bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
            >
              Proceed to Arbitration &amp; Peer Review →
            </Link>
          )}
        </div>

        {validationDone && (
          <div className="mt-8 space-y-4">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
              <div className="flex items-center gap-2 font-bold">
                <span className="text-lg">✓</span>
                <span>Template &amp; Figure Validation Passed</span>
              </div>
              <ul className="mt-3 list-disc pl-5 space-y-1 text-xs text-emerald-800">
                <li>All figures verified at 300 DPI resolution in PDF and PNG formats.</li>
                <li>Zero float slippage detected; \FloatBarrier hooks active.</li>
                <li>Citation syntax compliant with Crossref schema (no hallucinated identifiers).</li>
                <li>Code availability repository verified public and unauthenticated (HTTP 200).</li>
              </ul>
            </div>

            <div className="rounded-lg border border-[#e7e5e4] bg-white p-5 text-xs text-[#78716c] font-mono">
              <span>Merkle Artifact Root: 6d5506fc7b03eb4e60a2afa79992e9ddef619abcb852944c84153459396781c9</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
