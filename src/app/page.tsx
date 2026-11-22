'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { JOURNALS } from '@/lib/journalsData';

export default function JournalHomePage() {
  const journalsList = Object.values(JOURNALS);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1c1917] font-sans antialiased flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Hero Banner (OJS Multi-Journal Publishing System Portal) */}
        <section className="border-b border-[#e7e5e4] bg-white py-14">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-3xl">
              <span className="inline-block rounded bg-[#f5f5f4] px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#57534e]">
                Open Scientific Publishing Portal
              </span>
              <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1c1917]">
                International Archives Series
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[#57534e]">
                A Diamond Open Access publishing ecosystem published by <strong>iMedPub Limited</strong>.
                Operating with <strong>0 € author fees (0 € APC)</strong>, transparent hybrid peer review (autonomous agentic screening + independent human expert evaluation), and permanent indexing across <strong>Crossref (Prefix 10.3823)</strong> and <strong>Zenodo (CERN / DataCite)</strong>.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/submit"
                  className="rounded bg-[#047857] px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#065f46] transition"
                >
                  Submit a Manuscript →
                </Link>
                <Link
                  href="/preprints"
                  className="rounded border border-[#d6d3d1] bg-white px-5 py-2.5 text-sm font-medium text-[#44403c] hover:bg-[#f5f5f4] transition"
                >
                  Browse EdiTxt Preprints
                </Link>
                <a
                  href="https://zenodo.org/communities/imedpub"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded border border-[#d6d3d1] bg-white px-5 py-2.5 text-sm font-medium text-[#44403c] hover:bg-[#f5f5f4] transition"
                >
                  Zenodo Community ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* The 3 Core Journals (OJS Portfolio Navigation) */}
        <section id="journals" className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#e7e5e4]">
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-[#1c1917]">
                The Journal Portfolio
              </h2>
              <p className="mt-1 text-xs text-[#78716c]">
                Formal peer-reviewed journals published under Crossref Member ID 2155 (DOI prefix <code>10.3823</code>).
              </p>
            </div>
            <span className="text-xs font-semibold text-[#047857] bg-[#ecfdf5] px-2.5 py-1 rounded mt-2 sm:mt-0">
              Diamond Open Access (0€ APC)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {journalsList.map((j) => (
              <div key={j.slug} className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm flex flex-col justify-between hover:border-[#d6d3d1] transition">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#78716c] mb-2">
                    <span className="font-bold text-[#1c1917] bg-[#f5f5f4] px-2 py-0.5 rounded">{j.acronym}</span>
                    <span className="font-mono">ISSN: {j.issnOnline}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1c1917] leading-snug">
                    {j.name}
                  </h3>
                  <p className="mt-2 text-xs text-[#57534e] line-clamp-3 leading-relaxed">
                    {j.aimsAndScope}
                  </p>
                  <div className="mt-4 pt-3 border-t border-[#f5f5f4] space-y-1 text-xs text-[#78716c]">
                    <div><strong>Editor-in-Chief:</strong> {j.editorInChief.name}</div>
                    <div><strong>DOI Prefix:</strong> {j.crossrefPrefix}</div>
                    <div><strong>Current Issue:</strong> Vol. {j.currentIssue.volume}, No. {j.currentIssue.issue} ({j.currentIssue.year})</div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#e7e5e4] flex items-center justify-between">
                  <Link
                    href={`/journals/${j.slug}`}
                    className="text-xs font-semibold text-[#1c1917] hover:underline"
                  >
                    View Journal & Issues →
                  </Link>
                  <Link
                    href={`/submit?journal=${j.slug}`}
                    className="rounded bg-[#047857] hover:bg-[#065f46] text-white px-3 py-1 text-xs font-semibold transition"
                  >
                    Submit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Preprint Server Section */}
        <section id="preprints" className="bg-white border-y border-[#e7e5e4] py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-4 border-b border-[#e7e5e4]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#047857]">
                  Instant Scientific Certification
                </span>
                <h2 className="font-serif text-2xl font-bold tracking-tight text-[#1c1917] mt-1">
                  EdiTxt Preprints Server
                </h2>
                <p className="mt-1 text-xs text-[#78716c]">
                  Preprints with automated reproducibility checks and immutable DataCite DOIs.
                </p>
              </div>
              <Link
                href="/preprints"
                className="text-xs font-semibold text-[#2563eb] hover:underline mt-2 sm:mt-0"
              >
                Browse All Preprints →
              </Link>
            </div>

            {/* Featured Preprint Card */}
            <div className="rounded-lg border border-[#e7e5e4] bg-[#fafaf9] p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#78716c] mb-2">
                <span className="font-semibold uppercase tracking-wider text-[#047857]">
                  Featured Preprint · Precision Neurology
                </span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#e7e5e4]">
                  Zenodo DataCite DOI (Draft)
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1c1917]">
                Systematic Landscape of Cryptic-Splice Pseudo-Loss-of-Function Variants, ACMG PVS1 Classification Liabilities, and Allele-Specific Antisense Windows Across Five Autosomal-Dominant Dementia Genes
              </h3>
              <div className="mt-2 text-xs font-medium text-[#44403c]">
                Manuel Menendez-Gonzalez (University of Oviedo / HUCA / ISPA, Spain)
              </div>
              <p className="mt-2 text-xs text-[#57534e] line-clamp-2 leading-relaxed">
                Whether dominant dementia mutations act through simple haploinsufficiency or toxic alteration of gene product directly governs clinical variant interpretation and antisense oligonucleotide therapeutics. Pan-locus saturation across 1,092 MANE Select stop-gain variants reveals cryptic splice rescue and allele-selective steric ASO therapeutic windows.
              </p>
              <div className="mt-4 pt-3 border-t border-[#e7e5e4] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">
                    ✓ 12/12 Automated Checks Passed
                  </span>
                  <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-mono">
                    Merkle Root Verified
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/preprints"
                    className="rounded bg-[#1c1917] hover:bg-black text-white px-3 py-1 font-semibold text-xs transition"
                  >
                    View Preprint Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hybrid Peer Review Model Deep-Dive */}
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="rounded-lg border border-[#e7e5e4] bg-white p-8 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#047857]">
              Next-Generation Peer Review
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#1c1917] mt-1">
              How Hybrid Peer Review Works on GitHub
            </h2>
            <p className="mt-2 text-xs text-[#57534e] leading-relaxed max-w-3xl">
              Traditional publishing platforms hide peer review inside proprietary databases. Our journals utilize GitHub Issues, Discussions, and Actions to manage a rigorous, tamper-proof hybrid workflow combining <strong>instant automated screening agents</strong> with <strong>independent human expert review</strong>.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
              <div className="rounded border border-[#e7e5e4] p-4 bg-[#fafaf9]">
                <div className="w-6 h-6 rounded-full bg-[#1c1917] text-white flex items-center justify-center font-bold text-[11px] mb-2">1</div>
                <h4 className="font-bold text-[#1c1917] font-serif text-sm">Automated Triage</h4>
                <p className="text-[#57534e] mt-1">Autonomous bioinformatic agents verify title hygiene, check all DOIs against Crossref/PubMed, and confirm unauthenticated public access to code & data.</p>
              </div>

              <div className="rounded border border-[#e7e5e4] p-4 bg-[#fafaf9]">
                <div className="w-6 h-6 rounded-full bg-[#1c1917] text-white flex items-center justify-center font-bold text-[11px] mb-2">2</div>
                <h4 className="font-bold text-[#1c1917] font-serif text-sm">Desk & Dispatch</h4>
                <p className="text-[#57534e] mt-1">Handling Editor reviews the automated audit report. Once cleared, two independent domain experts are assigned via secure review forms.</p>
              </div>

              <div className="rounded border border-[#e7e5e4] p-4 bg-[#fafaf9]">
                <div className="w-6 h-6 rounded-full bg-[#1c1917] text-white flex items-center justify-center font-bold text-[11px] mb-2">3</div>
                <h4 className="font-bold text-[#1c1917] font-serif text-sm">Human Expertise</h4>
                <p className="text-[#57534e] mt-1">Specialists evaluate hypothesis originality, clinical/scientific validity, methodology, and ethical compliance with structured scorecards.</p>
              </div>

              <div className="rounded border border-[#e7e5e4] p-4 bg-[#fafaf9]">
                <div className="w-6 h-6 rounded-full bg-[#1c1917] text-white flex items-center justify-center font-bold text-[11px] mb-2">4</div>
                <h4 className="font-bold text-[#1c1917] font-serif text-sm">DOI Certification</h4>
                <p className="text-[#57534e] mt-1">Upon editorial consensus and revision approval, production PDF/HTML is released and an official Crossref DOI (prefix 10.3823) is minted.</p>
              </div>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}
