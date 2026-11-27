'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PreprintsPage() {
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedAbstract, setExpandedAbstract] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1c1917] font-sans antialiased flex flex-col justify-between">
      <div>
        <Navbar currentJournal="preprints" />

        {/* Preprint Hero */}
        <section className="bg-white border-b border-[#e7e5e4] py-10">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="bg-[#047857] text-white text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  Preprint Server
                </span>
                <span className="text-xs text-[#78716c] font-medium">
                  Permanent DataCite DOIs via Zenodo (CERN) · 0 € APC
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1917] mt-3">
                EdiTxt Preprints
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[#57534e]">
                An open preprint repository for computable scientific manuscripts. Submissions undergo instant automated screening (title hygiene, citation integrity, and reproducibility audit) and are archived with permanent DataCite DOIs before formal journal submission.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/submit"
                  className="rounded bg-[#047857] hover:bg-[#065f46] text-white px-5 py-2.5 text-xs font-semibold shadow-sm transition"
                >
                  Submit a Preprint Now →
                </Link>
                <a
                  href="https://zenodo.org/communities/imedpub"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded border border-[#d6d3d1] hover:bg-[#f5f5f4] text-[#44403c] px-4 py-2.5 text-xs font-medium transition"
                >
                  View Zenodo Community ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Filter and Search Bar */}
        <section className="border-b border-[#e7e5e4] bg-[#fafaf9] py-4">
          <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[#78716c]">Filter by Track:</span>
              <button
                onClick={() => setSelectedTrack('all')}
                className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
                  selectedTrack === 'all' ? 'bg-[#1c1917] text-white' : 'bg-white border border-[#d6d3d1] text-[#44403c] hover:bg-[#f5f5f4]'
                }`}
              >
                All Preprints (1)
              </button>
              <button
                onClick={() => setSelectedTrack('neurology')}
                className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
                  selectedTrack === 'neurology' ? 'bg-[#1c1917] text-white' : 'bg-white border border-[#d6d3d1] text-[#44403c] hover:bg-[#f5f5f4]'
                }`}
              >
                Precision Neurology & Genetics (1)
              </button>
              <button
                onClick={() => setSelectedTrack('medicine')}
                className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
                  selectedTrack === 'medicine' ? 'bg-[#1c1917] text-white' : 'bg-white border border-[#d6d3d1] text-[#44403c] hover:bg-[#f5f5f4]'
                }`}
              >
                Clinical Medicine (0)
              </button>
              <button
                onClick={() => setSelectedTrack('multidisciplinary')}
                className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
                  selectedTrack === 'multidisciplinary' ? 'bg-[#1c1917] text-white' : 'bg-white border border-[#d6d3d1] text-[#44403c] hover:bg-[#f5f5f4]'
                }`}
              >
                Multidisciplinary Science (0)
              </button>
            </div>

            <div className="w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search title, author, gene, DOI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 rounded border border-[#d6d3d1] bg-white px-3 py-1.5 text-xs text-[#1c1917] focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        </section>

        {/* Preprints Feed */}
        <main className="mx-auto max-w-6xl px-6 py-8">
          <div className="space-y-6">

            {/* First Lead Preprint: Alpöge Riemann Hypothesis (v1.4) */}
            <article className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm hover:border-[#d6d3d1] transition">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#78716c] mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold uppercase tracking-wider text-purple-800 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded">
                    Theoretical Metascience &amp; Automated Reasoning
                  </span>
                  <span>Posted: November 27, 2026</span>
                  <span>·</span>
                  <span className="font-mono text-[#44403c]">Version 1.4</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
                    <span>✓</span> Lean 4 Build + --fresh (26,898s) + lean4lean 100% (175,187/175,187)
                  </span>
                  <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-mono">
                    sha256:2a12...5a14
                  </span>
                </div>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1917] leading-snug">
                Independent Formal Verification, Epistemic Spine Cartography, and Comparative Auditing of Riemann Hypothesis Proof Claims
              </h2>

              <div className="mt-2 text-xs font-semibold text-[#1c1917]">
                Manuel Menéndez-González
              </div>
              <div className="text-[11px] text-[#78716c] italic mt-0.5">
                Certified on Apple M4 Max (16-core, 64 GB RAM, 98 GB build footprint) · Full build: 127,812s · Fresh replay: 26,898s · Full lean4lean: 175,187/175,187 modules (1,927,488 decls, 0 failures, 204,972.82s) · 28-line TCB
              </div>

              {/* Cognitive Opacity Tools Showcase */}
              <div className="mt-4 rounded border border-emerald-200 bg-emerald-50/50 p-4 text-xs text-emerald-950 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <span>🌐</span>
                  <span>Auditoría Cruzada Fase 1 ↔ Fase 2 y Autocontención Formal (v1.4):</span>
                </div>
                <p className="text-[#44403c] leading-relaxed">
                  Integra el cierre <code>175.187/175.187</code> de <em>lean4lean</em> (<code>204.972,82s</code>), la especificación Unicode de 28 líneas y las ecuaciones cerradas de <strong>Epistemia</strong> con una auditoría cruzada empírica de la reconstrucción comunitaria en prosa (<code>RH-Alpoge-Reconstruction@b50dae1</code>: <code>148</code> filas de ledger, <code>12/453</code> y <code>8/345</code> enlaces, <code>0</code> en <code>ReciprocityTheory</code>, <code>12/12</code> paquetes residuales y transición al refactor <code>lsernau/grh-lean</code>), junto al <strong>Explorador D3</strong> y la <strong>Escalera en 3 Niveles</strong>.
                </p>
              </div>

              {/* 4-Axis Epistemic Passport */}
              <div className="mt-4 grid gap-2 sm:grid-cols-4 text-[11px]">
                <div className="rounded border border-[#e7e5e4] bg-[#fafaf9] p-2.5">
                  <div className="text-[10px] font-bold uppercase text-[#78716c]">1. Provenance</div>
                  <div className="font-semibold text-[#1c1917] mt-0.5">Human Audit + AI Orch.</div>
                </div>
                <div className="rounded border border-emerald-200 bg-emerald-50/60 p-2.5">
                  <div className="text-[10px] font-bold uppercase text-emerald-800">2. Verification</div>
                  <div className="font-semibold text-emerald-950 mt-0.5">Build + --fresh + lean4lean 100%</div>
                </div>
                <div className="rounded border border-indigo-200 bg-indigo-50/50 p-2.5">
                  <div className="text-[10px] font-bold uppercase text-indigo-800">3. Statement TCB</div>
                  <div className="font-semibold text-indigo-950 font-mono mt-0.5">28 / 17.33M lines (1.62e-6)</div>
                </div>
                <div className="rounded border border-sky-200 bg-sky-50/60 p-2.5">
                  <div className="text-[10px] font-bold uppercase text-sky-800">4. Comprehension</div>
                  <div className="font-semibold text-sky-950 mt-0.5">Distilled (3-Level Primer)</div>
                </div>
              </div>

              {/* Summary CTAs */}
              <div className="mt-5 pt-4 border-t border-[#f5f5f4] flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://doi.org/10.5281/zenodo.24586394"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-emerald-800 hover:bg-emerald-100 transition"
                  >
                    DOI: 10.5281/zenodo.24586394 ↗
                  </a>
                  <span className="text-[#a8a29e]">·</span>
                  <span className="text-[#78716c]">Epistemia: 0.245 vs. 0.850</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="https://github.com/Fundacion-de-Neurociencias/riemann-hypothesis-audit-dossier"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-[#d6d3d1] bg-white text-[#44403c] hover:bg-[#f5f5f4] px-3 py-1.5 font-medium transition flex items-center gap-1"
                  >
                    <span>📁</span>
                    <span>Dossier Público ↗</span>
                  </a>
                  <a
                    href="/visualizations/epistemic_spine_explorer.html"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-indigo-300 bg-indigo-50 text-indigo-900 hover:bg-indigo-100 px-3 py-1.5 font-bold transition flex items-center gap-1"
                  >
                    <span>🌐</span>
                    <span>Epistemic Spine D3 Explorer ↗</span>
                  </a>
                  <Link
                    href="/editor/2026-11-alpoge-riemann-hypothesis"
                    className="rounded bg-[#1c1917] hover:bg-black text-white px-4 py-1.5 font-semibold transition"
                  >
                    Open in Living Computable Editor →
                  </Link>
                </div>
              </div>
            </article>

            {/* Second Preprint: Anthropic VP != VNP Comparative Audit */}
            <article className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm hover:border-[#d6d3d1] transition">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#78716c] mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded">
                    Algebraic Complexity &amp; TCB Auditing
                  </span>
                  <span>Posted: November 25, 2026</span>
                  <span>·</span>
                  <span className="font-mono text-[#44403c]">Version 1.0 (Audit)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
                    <span>✓</span> Build (404s) + --fresh (996s) + lean4lean (14s)
                  </span>
                  <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-mono">
                    324 files · 72,932 lines
                  </span>
                </div>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1917] leading-snug">
                Independent TCB, Statement-Fidelity, and Kernel Verification Audit of the Formalized VP ≠ VNP Proof Claim
              </h2>

              <div className="mt-2 text-xs font-semibold text-[#1c1917]">
                Manuel Menéndez-González (Independent Audit of Claude / Anthropic <code className="text-[11px]">hexagon:2611.00954v1</code>)
              </div>
              <div className="text-[11px] text-[#78716c] italic mt-0.5">
                Apple M4 Max · Lean v4.33.1 · build: 404s · --fresh: 996s · lean4lean: 14s (7 decls) · [propext, Classical.choice, Quot.sound] · 153-line TCB
              </div>

              {/* 4-Axis Epistemic Passport */}
              <div className="mt-4 grid gap-2 sm:grid-cols-4 text-[11px]">
                <div className="rounded border border-[#e7e5e4] bg-[#fafaf9] p-2.5">
                  <div className="text-[10px] font-bold uppercase text-[#78716c]">1. Provenance</div>
                  <div className="font-semibold text-[#1c1917] mt-0.5">AI-Autonomous + Human TCB</div>
                </div>
                <div className="rounded border border-emerald-200 bg-emerald-50/60 p-2.5">
                  <div className="text-[10px] font-bold uppercase text-emerald-800">2. Verification</div>
                  <div className="font-semibold text-emerald-950 mt-0.5">Build + --fresh + lean4lean</div>
                </div>
                <div className="rounded border border-indigo-200 bg-indigo-50/50 p-2.5">
                  <div className="text-[10px] font-bold uppercase text-indigo-800">3. Statement TCB</div>
                  <div className="font-semibold text-indigo-950 font-mono mt-0.5">153 / 72,932 lines (2.10e-3)</div>
                </div>
                <div className="rounded border border-amber-200 bg-amber-50/60 p-2.5">
                  <div className="text-[10px] font-bold uppercase text-amber-800">4. Comprehension</div>
                  <div className="font-semibold text-amber-950 mt-0.5">Partial (TCB Audited)</div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#f5f5f4] flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono bg-[#f5f5f4] border border-[#e7e5e4] px-2 py-0.5 rounded text-[#44403c]">
                    Target: anthropics/formal-math (vp-vnp)
                  </span>
                  <span className="text-[#a8a29e]">·</span>
                  <span className="text-[#78716c]">Balanced DAG (max fan-in 7)</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="https://github.com/anthropics/formal-math/tree/main/vp-vnp"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-[#d6d3d1] bg-white text-[#44403c] hover:bg-[#f5f5f4] px-3 py-1.5 font-medium transition flex items-center gap-1"
                  >
                    <span>📁</span>
                    <span>Source Repo ↗</span>
                  </a>
                  <Link
                    href="/editor/2026-11-anthropic-vp-vnp"
                    className="rounded bg-[#1c1917] hover:bg-black text-white px-4 py-1.5 font-semibold transition"
                  >
                    Open in Living Computable Editor →
                  </Link>
                </div>
              </div>
            </article>

            {/* Third Preprint: 5-Gene Dementia Paper */}
            <article className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm hover:border-[#d6d3d1] transition">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#78716c] mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold uppercase tracking-wider text-[#047857] bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 rounded">
                    Precision Neurology & Neuroscience
                  </span>
                  <span>Posted: November 22, 2026</span>
                  <span>·</span>
                  <span className="font-mono text-[#44403c]">Version 1.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
                    <span>✓</span> Automated Screening Passed
                  </span>
                  <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-mono">
                    sha256:8f4c...3e19
                  </span>
                </div>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1917] leading-snug">
                Systematic Landscape of Cryptic-Splice Pseudo-Loss-of-Function Variants, ACMG PVS1 Classification Liabilities, and Allele-Specific Antisense Windows Across Five Autosomal-Dominant Dementia Genes
              </h2>

              <div className="mt-2 text-xs font-semibold text-[#1c1917]">
                Manuel Menendez-Gonzalez <span className="text-[#047857] font-normal">(1,2,3)*</span>
              </div>
              <div className="text-[11px] text-[#78716c] italic mt-0.5">
                (1) Medicine Department, University of Oviedo, Spain; (2) Neurology Department, Hospital Universitario Central de Asturias (HUCA); (3) ISPA, Oviedo, Spain.
              </div>

              {/* Abstract */}
              <div className="mt-4">
                <button
                  onClick={() => setExpandedAbstract(!expandedAbstract)}
                  className="text-xs text-[#2563eb] hover:underline font-medium cursor-pointer"
                >
                  {expandedAbstract ? 'Hide Abstract ▲' : 'Read Abstract ▼'}
                </button>
                {expandedAbstract && (
                  <div className="mt-2 text-xs leading-relaxed text-[#44403c] bg-[#f5f5f4] p-4 rounded border border-[#e7e5e4] space-y-2">
                    <p>
                      <strong>Abstract:</strong> Whether dominant dementia mutations act through simple haploinsufficiency or toxic alteration of gene product directly governs clinical variant interpretation and antisense oligonucleotide therapeutics. Following population-genetic and splicing evidence that authentic <em>PSEN1</em> null alleles do not cause early-onset Alzheimer\'s disease (EOAD) whereas the nominal stop-gain <em>PSEN1</em> c.325A&gt;T (p.K109*) activates a cryptic donor to produce an in-frame deletion (p.K109_L113del), we constructed a systematic five-gene genomic resource comparing three Alzheimer-linked loci (<em>PSEN1</em>, <em>PSEN2</em>, <em>APP</em>), the tauopathy gene <em>MAPT</em>, and the true haploinsufficiency control <em>GRN</em>.
                    </p>
                    <p>
                      Across all 1,092 exhaustive GRCh38 MANE Select stop-gain single-nucleotide variants evaluated with AlphaGenome Variant Impact molecular predictions, predicted splicing-disruption attribution was significantly elevated among cryptic-donor and &le;2 bp exon-edge variants compared with interior stop codons (Mann-Whitney U = 42,821.0, p = 9.35 &times; 10<sup>-10</sup>). Beyond <em>PSEN1</em> p.K109*, the atlas prioritizes additional pseudo-LoF candidates including <em>PSEN1</em> p.R308*, <em>PSEN2</em> p.W47*, <em>PSEN2</em> p.K115*, <em>APP</em> p.Y321*, and <em>MAPT</em> p.G725*. Auditing gnomAD v4.1 and 3,368 ClinVar records exposed diagnostic PVS1 classification liabilities across all 11 pathogenic predicted loss-of-function entries in <em>PSEN1</em> and <em>PSEN2</em>. Cryo-EM contact analysis (PDB 6IYC) and ESM-2 scoring indicated that p.K109_L113del removes APP-C83 and nicastrin interface contacts within the 5th percentile of embedding perturbation. Finally, nearest-neighbor thermodynamic scanning identified allele-selective 22-mer steric-blocking antisense windows sparing canonical +1/+2 GU donors, led by <em>PSEN1</em> p.K109* (&Delta;&Delta;G&deg; = +3.63 kcal/mol, &Delta;Tm = +15.6 &deg;C).
                    </p>
                  </div>
                )}
              </div>

              {/* Verified Badges and Download CTAs */}
              <div className="mt-5 pt-4 border-t border-[#f5f5f4] flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono bg-[#f5f5f4] border border-[#e7e5e4] px-2 py-0.5 rounded text-[#44403c]">
                    Zenodo DOI: 10.5281/zenodo.draft-reservation
                  </span>
                  <a
                    href="https://github.com/imedpub-ltd/international-archives-of-neurology-neuroscience"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2563eb] hover:underline flex items-center gap-1"
                  >
                    <span>Code & Data (GitHub) ↗</span>
                  </a>
                  <span className="text-[#a8a29e]">·</span>
                  <span className="text-[#78716c]">24 Citations (100% Resolved)</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/submit?prefill=true"
                    className="rounded border border-[#d6d3d1] hover:bg-[#f5f5f4] text-[#44403c] px-3 py-1.5 font-medium transition"
                  >
                    Inspect Audit Receipt
                  </Link>
                  <a
                    href="https://github.com/imedpub-ltd/editxt-preprints/tree/main/manuscripts"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded bg-[#1c1917] hover:bg-black text-white px-4 py-1.5 font-semibold transition"
                  >
                    View Preprint Package ↗
                  </a>
                </div>
              </div>
            </article>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
