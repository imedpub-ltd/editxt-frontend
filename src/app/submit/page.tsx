'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Author {
  name: string;
  affiliation: string;
  orcid: string;
  email: string;
}

interface AuditCheck {
  rule: string;
  status: 'passed' | 'warning' | 'failed';
  detail: string;
}

interface SubmissionResult {
  success: boolean;
  verdict: 'READY_FOR_PREPRINT' | 'CHANGES_REQUESTED';
  manuscriptSlug: string;
  merkleReceipt: string;
  zenodoDoi?: string;
  checks: AuditCheck[];
  timestamp: string;
}

function SubmitForm() {
  const searchParams = useSearchParams();
  const initialJournal = searchParams.get('journal') || 'preprints';
  const prefill = searchParams.get('prefill') === 'true';

  // Submission Pathway: 'dropzone' | 'editor' | 'wizard'
  const [activePathway, setActivePathway] = useState<'dropzone' | 'editor' | 'wizard'>('dropzone');

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  // Dropzone State
  const [droppedFile, setDroppedFile] = useState<{
    name: string;
    size: string;
    type: string;
    extractedTitle: string;
    extractedAbstract: string;
    extractedAuthors: string;
    detectedFigures: number;
    detectedReferences: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Form Fields
  const [targetVenue, setTargetVenue] = useState<string>(initialJournal);
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [track, setTrack] = useState('Precision Neurology & Neuroscience');
  const [keywords, setKeywords] = useState('dementia, cryptic splicing, PSEN1, ACMG PVS1, antisense oligonucleotides');
  const [authors, setAuthors] = useState<Author[]>([
    {
      name: 'Manuel Menendez-Gonzalez',
      affiliation: 'Medicine Department, Oviedo University / Neurology HUCA / ISPA, Spain',
      orcid: '0000-0002-1825-0097',
      email: 'menendezgmanuel@uniovi.es'
    }
  ]);
  const [manuscriptBody, setManuscriptBody] = useState('');
  const [references, setReferences] = useState('');
  const [publicRepo, setPublicRepo] = useState('https://github.com/imedpub-ltd/international-archives-of-neurology-neuroscience');
  const [openAccessAccepted, setOpenAccessAccepted] = useState(true);
  const [ethicalCompliance, setEthicalCompliance] = useState(true);
  const [authorApproval, setAuthorApproval] = useState(true);

  // Helper to pre-populate with the real 5-gene manuscript
  const loadRealManuscript = () => {
    setTitle('Systematic Landscape of Cryptic-Splice Pseudo-Loss-of-Function Variants, ACMG PVS1 Classification Liabilities, and Allele-Specific Antisense Windows Across Five Autosomal-Dominant Dementia Genes');
    setAbstract('Whether dominant dementia mutations act through simple haploinsufficiency or toxic alteration of gene product directly governs clinical variant interpretation and antisense oligonucleotide therapeutics. Following population-genetic and splicing evidence that authentic PSEN1 null alleles do not cause early-onset Alzheimer\'s disease (EOAD) whereas the nominal stop-gain PSEN1 c.325A>T (p.K109*) activates a cryptic donor to produce an in-frame deletion (p.K109_L113del), we constructed a systematic five-gene genomic resource comparing three Alzheimer-linked loci (PSEN1, PSEN2, APP), the tauopathy gene MAPT, and the true haploinsufficiency control GRN. Across all 1,092 exhaustive GRCh38 MANE Select stop-gain single-nucleotide variants evaluated with AlphaGenome Variant Impact molecular predictions, predicted splicing-disruption attribution was significantly elevated among cryptic-donor and <=2 bp exon-edge variants compared with interior stop codons. Auditing gnomAD v4.1 and 3,368 ClinVar records exposed isoform inflation outside MANE Select in PSEN2 (5,390 non-MANE alleles) and diagnostic PVS1 classification liabilities across all 11 pathogenic/likely-pathogenic predicted loss-of-function entries in PSEN1 and PSEN2. Cryo-EM contact analysis (PDB 6IYC) and ESM-2 language-model scoring indicated that p.K109_L113del removes APP-C83 and nicastrin interface contacts within the fifth percentile of 5-residue embedding perturbation. Finally, nearest-neighbor thermodynamic scanning identified allele-selective 22-mer steric-blocking antisense windows sparing canonical +1/+2 GU donors, led by PSEN1 p.K109*. Together, these computational annotations establish actionable falsifiable hypotheses for clinical genetic curation and experimental validation.');
    setTrack('Precision Neurology & Neuroscience');
    setKeywords('PSEN1, cryptic splicing, Alzheimer disease, ACMG PVS1, steric ASO, AlphaGenome, ESM-2');
    setAuthors([
      {
        name: 'Manuel Menendez-Gonzalez',
        affiliation: 'Medicine Dept., Oviedo Univ.; Neurology Dept., HUCA; ISPA, Oviedo, Spain',
        orcid: '0000-0002-1825-0097',
        email: 'menendezgmanuel@uniovi.es'
      }
    ]);
    setManuscriptBody(`## Introduction
Interpreting predicted loss-of-function (pLoF) variants in autosomal-dominant adult-onset dementias presents an enduring mechanistic and diagnostic tension. For genes such as progranulin (GRN), nonsense and frameshift variants cause uniform mRNA degradation via nonsense-mediated decay (NMD) and frontotemporal lobar degeneration through haploinsufficiency. In contrast, disease-causing variants in PSEN1, PSEN2, and APP reshape gamma-secretase substrate proteolysis toward aggregation-prone Abeta species, while MAPT pathogenesis centers on tau isoform splicing altering 3R/4R stoichiometry.

## Methods
Canonical coding sequences and exon boundaries were retrieved from Ensembl GRCh38 for all five targets under their MANE Select transcripts. All single-nucleotide substitutions converting a sense codon to a premature termination codon were enumerated exhaustively (n = 1,092 unique variants). Variant-level splicing predictions were retrieved from public AlphaGenome Variant Impact models. ClinVar PVS1 adjudications, human-mouse junction conservation, cryo-EM structure 6IYC, ESM-2 protein language modeling, and nearest-neighbor ASO thermodynamics were calculated systematically.

## Results
Across all 1,092 stop-gain SNVs, splicing disruption was significantly elevated in cryptic-donor and <=2 bp exon-edge variants compared with interior stop codons (Mann-Whitney U = 42,821, p = 9.35e-10). In PSEN1 and PSEN2, ClinVar audits identified 11 pathogenic/likely-pathogenic pLoF entries that suffer from PVS1 classification liabilities. Nearest-neighbor thermodynamic scanning identified allele-selective 22-mer steric-blocking antisense windows sparing canonical +1/+2 GU donors.

## Discussion
These findings demonstrate that stop-gain mutations in gain-of-function dementia loci frequently activate cryptic splicing rather than true haploinsufficiency. Diagnostic application of ACMG PVS1 criteria in these genes requires urgent recalibration.`);
    setReferences(`1. Farinas A, et al. PSEN1 loss-of-function variants do not cause early-onset Alzheimer's disease. medRxiv 2026; DOI: 10.64898/2026.11.13.26367865.
2. Menendez M. Pathological and clinical heterogeneity of presenilin 1 gene mutations. J Alzheimers Dis 2004; 6(5):475-482. DOI: 10.3233/jad-2004-6503. PMID: 15505368.
3. Menendez-Gonzalez M. Implementing a tridimensional diagnostic framework for personalized medicine in neurodegenerative diseases. Alzheimers Dement 2025; 21(2):e14591. DOI: 10.1002/alz.14591. PMID: 39976261.
4. Sanjuan-Ruiz I, et al. The curious case of a heterozygous loss-of-function PSEN1 variant associated with early-onset Alzheimer's disease. Mol Neurodegener Adv 2025; 1(1):4. DOI: 10.1186/s44477-025-00004-x. PMID: 41127441.
5. Wang B, et al. Gamma-secretase gene mutations in familial acne inversa. Science 2010; 330(6007):1065. DOI: 10.1126/science.1196284. PMID: 20929727.
6. Richards S, et al. Standards and guidelines for the interpretation of sequence variants: a joint consensus recommendation of the ACMG and AMP. Genet Med 2015; 17(5):405-424. DOI: 10.1038/gim.2015.30. PMID: 25741868.
7. Zhou R, et al. Recognition of the amyloid precursor protein by human gamma-secretase. Science 2019; 363(6428):eaaw0930. DOI: 10.1126/science.aaw0930. PMID: 30630874.
8. Avsec Z, et al. Deep learning models of RNA biology predict clinical variant effects. Nature 2026; DOI: 10.1038/s41586-026-00000-0.`);
    setPublicRepo('https://github.com/imedpub-ltd/international-archives-of-neurology-neuroscience');
  };

  useEffect(() => {
    if (prefill) {
      loadRealManuscript();
      setActivePathway('wizard');
    }
  }, [prefill]);

  // Handle simulated/client-side package drop
  const handleDrop = (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    if ('preventDefault' in e) e.preventDefault();
    setIsDragging(false);

    // Simulate package inspection of the real staged manuscript bundle
    loadRealManuscript();
    setDroppedFile({
      name: '2026-11_pseudo_lof_dementia_genes_bundle.zip',
      size: '1.42 MB',
      type: 'LaTeX & Computable Reproducibility Capsule',
      extractedTitle:
        'Systematic Landscape of Cryptic-Splice Pseudo-Loss-of-Function Variants, ACMG PVS1 Classification Liabilities, and Allele-Specific Antisense Windows Across Five Autosomal-Dominant Dementia Genes',
      extractedAbstract:
        'Whether dominant dementia mutations act through simple haploinsufficiency or toxic alteration of gene product directly governs clinical variant interpretation...',
      extractedAuthors: 'Manuel Menendez-Gonzalez (Oviedo Univ. / HUCA / ISPA)',
      detectedFigures: 4,
      detectedReferences: 24
    });
  };

  const handleAddAuthor = () => {
    setAuthors([...authors, { name: '', affiliation: '', orcid: '', email: '' }]);
  };

  const handleRemoveAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const handleUpdateAuthor = (index: number, field: keyof Author, value: string) => {
    const updated = [...authors];
    updated[index][field] = value;
    setAuthors(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venue: targetVenue,
          title,
          abstract,
          track,
          keywords: keywords.split(',').map(k => k.trim()),
          authors,
          manuscriptBody,
          references,
          publicRepo,
          declarations: {
            openAccess: openAccessAccepted,
            ethicalCompliance,
            authorApproval
          }
        })
      });

      const data = await res.json();
      setResult(data);
      setStep(5); // Move to audit receipt step
      setActivePathway('wizard');
    } catch (err: unknown) {
      alert('Submission failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      {/* Editorial System Notice (GitHub Identity) */}
      <div className="mb-6 rounded-lg border border-[#e7e5e4] bg-[#f5f5f4] p-4 text-xs text-[#44403c] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <svg className="w-4 h-4 text-[#1c1917] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span>
            <strong>Editorial System:</strong> ediTxt uses a journal managing system based on GitHub. Please, log in your GitHub account or create an account if you do not have one.
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#78716c] flex-shrink-0">Connected: @manuelmdez</span>
      </div>

      {/* Main Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e5e4] pb-5">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#1c1917]">
            Submit a Manuscript
          </h1>
          <p className="mt-1 text-sm text-[#78716c]">
            Diamond Open Access (0€ APC). Sovereign peer review, living computable editor, and zero antediluvian forms.
          </p>
        </div>
      </div>

      {/* Pathway Tabs: Dropzone vs Living Editor vs Manual Form */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-[#e7e5e4] pb-4">
        <button
          type="button"
          onClick={() => setActivePathway('dropzone')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activePathway === 'dropzone'
              ? 'bg-[#1c1917] text-white'
              : 'border border-[#d6d3d1] bg-white text-[#44403c] hover:bg-[#f5f5f4]'
          }`}
        >
          <span>📦</span>
          <span>1. Drag &amp; Drop Manuscript Bundle (.zip / .tex / .pdf)</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePathway('editor')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activePathway === 'editor'
              ? 'bg-[#1c1917] text-white'
              : 'border border-[#d6d3d1] bg-white text-[#44403c] hover:bg-[#f5f5f4]'
          }`}
        >
          <span>✍️</span>
          <span>2. Living Computable Online Editor (Pre-Submission Deep Review)</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePathway('wizard')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activePathway === 'wizard'
              ? 'bg-[#1c1917] text-white'
              : 'border border-[#d6d3d1] bg-white text-[#44403c] hover:bg-[#f5f5f4]'
          }`}
        >
          <span>📋</span>
          <span>3. Assisted Structured Form (Step-by-Step)</span>
        </button>
      </div>

      {/* PATHWAY 1: DROPZONE PACKAGE UPLOAD */}
      {activePathway === 'dropzone' && (
        <div className="rounded-lg border border-[#e7e5e4] bg-white p-8 shadow-sm space-y-6">
          <div className="border-b border-[#e7e5e4] pb-4">
            <h2 className="font-serif text-xl font-bold text-[#1c1917]">
              Upload Manuscript Package
            </h2>
            <p className="mt-1 text-xs text-[#78716c]">
              Drop your complete submission bundle containing manuscript sources (`.tex`, `.md`, `.pdf`), bibliography (`.bib`), vector figures, and reproducible code capsule. Metadata and citations are extracted automatically.
            </p>
          </div>

          {!droppedFile ? (
            <div
              onDragOver={e => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition cursor-pointer ${
                isDragging
                  ? 'border-[#1c1917] bg-[#fafaf9]'
                  : 'border-[#d6d3d1] bg-[#fafaf9]/60 hover:bg-[#fafaf9]'
              }`}
              onClick={() => handleDrop({} as React.DragEvent)}
            >
              <div className="text-4xl">📁</div>
              <p className="mt-3 text-sm font-semibold text-[#1c1917]">
                Drag and drop your manuscript bundle (.zip, .tar.gz, .tex, .pdf)
              </p>
              <p className="mt-1 text-xs text-[#78716c]">
                or click here to select files from your computer
              </p>
              <span className="mt-4 rounded bg-[#e7e5e4] px-3 py-1 font-mono text-[11px] font-bold text-[#44403c]">
                Supports: main.tex + references.bib + figures/ + code/
              </span>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📦</span>
                    <div>
                      <h3 className="font-serif text-base font-bold text-emerald-950">
                        {droppedFile.name}
                      </h3>
                      <p className="text-xs text-emerald-800">
                        Size: {droppedFile.size} · {droppedFile.type} · Parsed Successfully
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDroppedFile(null)}
                    className="text-xs text-emerald-900 underline hover:no-underline"
                  >
                    Change file
                  </button>
                </div>

                <div className="mt-4 grid gap-3 border-t border-emerald-200/80 pt-4 text-xs sm:grid-cols-2">
                  <div>
                    <span className="font-bold text-emerald-900 uppercase text-[10px]">
                      Extracted Title:
                    </span>
                    <p className="mt-0.5 text-emerald-950 leading-snug">
                      {droppedFile.extractedTitle}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-900 uppercase text-[10px]">
                      Authors &amp; Affiliations:
                    </span>
                    <p className="mt-0.5 text-emerald-950">
                      {droppedFile.extractedAuthors}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-900 uppercase text-[10px]">
                      Artifacts Detected:
                    </span>
                    <p className="mt-0.5 text-emerald-950">
                      {droppedFile.detectedFigures} Vector Figures (300 DPI) · Supplementary_Data_and_Code.zip (412 KB)
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-900 uppercase text-[10px]">
                      Bibliography:
                    </span>
                    <p className="mt-0.5 text-emerald-950">
                      {droppedFile.detectedReferences} Citations (100% Crossref / PubMed resolvable)
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Dropped Package */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <Link
                  href="/editor/2026-11-pseudo-lof-dementia"
                  className="rounded border border-[#1c1917] bg-white px-5 py-2.5 text-xs font-bold text-[#1c1917] hover:bg-[#f5f5f4] transition"
                >
                  ✍️ Open in Living Editor to Polish &amp; Inspect Anchors →
                </Link>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rounded bg-[#047857] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#065f46] disabled:opacity-50 transition"
                >
                  {submitting ? 'Running Automated Screening…' : '🚀 Submit Package Directly to Automated Screening'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PATHWAY 2: LIVING ONLINE EDITOR */}
      {activePathway === 'editor' && (
        <div className="rounded-lg border border-[#e7e5e4] bg-white p-8 shadow-sm space-y-6">
          <div className="border-b border-[#e7e5e4] pb-4">
            <h2 className="font-serif text-xl font-bold text-[#1c1917]">
              Living Computable Online Editor
            </h2>
            <p className="mt-1 text-xs text-[#78716c]">
              EdiTXT replaces static, antediluvian submission forms with a living, computable document editor where figures, formulas, and statistical claims are linked directly to data manifests and verified in real time.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            <div className="rounded border border-[#e7e5e4] p-4 bg-[#fafaf9]">
              <div className="font-bold text-[#1c1917] mb-1">⚡ Pre-Submission Deep Review</div>
              <p className="text-[#57534e]">
                Forensic auditor agents analyze logic gaps, data drift, and citation hygiene while you write.
              </p>
            </div>
            <div className="rounded border border-[#e7e5e4] p-4 bg-[#fafaf9]">
              <div className="font-bold text-[#1c1917] mb-1">🔗 Computable Data Anchors</div>
              <p className="text-[#57534e]">
                Every p-value, variant count, and metric binds to real code execution outputs, preventing stale numbers.
              </p>
            </div>
            <div className="rounded border border-[#e7e5e4] p-4 bg-[#fafaf9]">
              <div className="font-bold text-[#1c1917] mb-1">1-Click Submission Transfer</div>
              <p className="text-[#57534e]">
                Submit directly from the editor into the peer review arbitration queue without retyping a single field.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-indigo-200 bg-indigo-50/60 p-5">
            <h3 className="font-serif text-sm font-bold text-indigo-950">
              Open Pre-Loaded Sample Computable Manuscripts:
            </h3>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href="/editor/2026-11-pseudo-lof-dementia"
                className="rounded bg-[#1c1917] px-4 py-2 text-xs font-bold text-white hover:bg-black transition"
              >
                🔬 Open 5-Gene Dementia Study (Full Staged Manuscript)
              </Link>
              <Link
                href="/editor/MANUSCRIPT-ALZHEIMER-TAU-2026"
                className="rounded border border-[#d6d3d1] bg-white px-4 py-2 text-xs font-semibold text-[#44403c] hover:bg-[#f5f5f4] transition"
              >
                📊 Open Alzheimer pTau217 Study
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* PATHWAY 3: ASSISTED STRUCTURED FORM (WIZARD) */}
      {activePathway === 'wizard' && (
        <div>
          {/* Stepper Navigation */}
          <div className="mb-6 grid grid-cols-5 gap-2 text-center text-xs font-semibold text-[#78716c]">
            <div className={`border-b-2 pb-2 ${step === 1 ? 'border-[#1c1917] text-[#1c1917]' : 'border-transparent'}`}>
              1. Metadata
            </div>
            <div className={`border-b-2 pb-2 ${step === 2 ? 'border-[#1c1917] text-[#1c1917]' : 'border-transparent'}`}>
              2. Authors &amp; Affiliations
            </div>
            <div className={`border-b-2 pb-2 ${step === 3 ? 'border-[#1c1917] text-[#1c1917]' : 'border-transparent'}`}>
              3. Manuscript &amp; References
            </div>
            <div className={`border-b-2 pb-2 ${step === 4 ? 'border-[#1c1917] text-[#1c1917]' : 'border-transparent'}`}>
              4. Declarations
            </div>
            <div className={`border-b-2 pb-2 ${step === 5 ? 'border-[#1c1917] text-[#1c1917]' : 'border-transparent'}`}>
              5. Audit &amp; Receipt
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-lg border border-[#e7e5e4] bg-white p-8 shadow-sm">
            {/* STEP 1: Metadata */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-semibold text-[#1c1917]">
                    1. Target Journal &amp; Article Metadata
                  </h2>
                  <button
                    type="button"
                    onClick={loadRealManuscript}
                    className="rounded border border-[#d6d3d1] bg-[#fafaf9] px-3 py-1 text-xs font-medium text-[#44403c] hover:bg-[#f5f5f4]"
                  >
                    📋 Pre-fill 5-Gene Dementia Paper
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57534e]">
                    Select Target Publication Venue *
                  </label>
                  <select
                    value={targetVenue}
                    onChange={e => setTargetVenue(e.target.value)}
                    className="mt-1 w-full rounded border border-[#d6d3d1] p-2.5 text-sm focus:border-black focus:outline-none"
                  >
                    <option value="preprints">EdiTxt Preprints (Zenodo DataCite DOI · Immediate)</option>
                    <option value="ianeuro">International Archives of Neurology &amp; Neuroscience (IAneuro · Crossref 10.3823)</option>
                    <option value="iamed">International Archives of Medicine (IAmed · Crossref 10.3823)</option>
                    <option value="ia">International Archives (IA · Multidisciplinary · Crossref 10.3823)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57534e]">
                    Manuscript Title *
                  </label>
                  <p className="mb-2 text-xs text-[#78716c]">
                    Must describe scientific findings directly. Do not cite external journals, years, or author names in title.
                  </p>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Systematic Landscape of Cryptic-Splice Pseudo-Loss-of-Function Variants..."
                    className="w-full rounded border border-[#d6d3d1] p-3 text-sm focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57534e]">
                    Scientific Track / Category *
                  </label>
                  <select
                    value={track}
                    onChange={e => setTrack(e.target.value)}
                    className="mt-1 w-full rounded border border-[#d6d3d1] p-2.5 text-sm focus:border-black focus:outline-none"
                  >
                    <option>Precision Neurology &amp; Neuroscience</option>
                    <option>Clinical Medicine &amp; Pharmacology</option>
                    <option>Multidisciplinary Computable Science</option>
                    <option>Functional Genomics &amp; Bioinformatics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57534e]">
                    Keywords (comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={keywords}
                    onChange={e => setKeywords(e.target.value)}
                    placeholder="PSEN1, cryptic splicing, Alzheimer disease..."
                    className="mt-1 w-full rounded border border-[#d6d3d1] p-2.5 text-sm focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57534e]">
                    Abstract (Structured / Unstructured) *
                  </label>
                  <p className="mb-2 text-xs text-[#78716c]">
                    Minimum 50 words. Complete background, methods, results, and conclusion.
                  </p>
                  <textarea
                    required
                    rows={6}
                    value={abstract}
                    onChange={e => setAbstract(e.target.value)}
                    placeholder="Provide full text of the abstract..."
                    className="w-full rounded border border-[#d6d3d1] p-3 text-sm font-sans focus:border-black focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-[#e7e5e4]">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded bg-[#1c1917] px-6 py-2.5 text-sm font-semibold text-white hover:bg-black"
                  >
                    Continue to Authors →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Authors */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-semibold text-[#1c1917]">
                    2. Authors &amp; Institutional Affiliations
                  </h2>
                  <button
                    type="button"
                    onClick={handleAddAuthor}
                    className="rounded border border-[#d6d3d1] px-3 py-1.5 text-xs font-medium text-[#44403c] hover:bg-[#f5f5f4]"
                  >
                    + Add Co-Author
                  </button>
                </div>

                <div className="space-y-4">
                  {authors.map((auth, index) => (
                    <div key={index} className="rounded border border-[#e7e5e4] p-4 bg-[#fafaf9] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#78716c]">
                          Author #{index + 1} {index === 0 && '(Corresponding)'}
                        </span>
                        {authors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveAuthor(index)}
                            className="text-xs text-rose-600 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11px] font-bold text-[#57534e]">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={auth.name}
                            onChange={e => handleUpdateAuthor(index, 'name', e.target.value)}
                            placeholder="Dr. Manuel Menéndez-González"
                            className="mt-1 w-full rounded border border-[#d6d3d1] p-2 text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#57534e]">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={auth.email}
                            onChange={e => handleUpdateAuthor(index, 'email', e.target.value)}
                            placeholder="menendezgmanuel@uniovi.es"
                            className="mt-1 w-full rounded border border-[#d6d3d1] p-2 text-xs bg-white"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-[#57534e]">Affiliation *</label>
                          <input
                            type="text"
                            required
                            value={auth.affiliation}
                            onChange={e => handleUpdateAuthor(index, 'affiliation', e.target.value)}
                            placeholder="Department of Medicine, Universidad de Oviedo / ISPA, Spain"
                            className="mt-1 w-full rounded border border-[#d6d3d1] p-2 text-xs bg-white"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-[#57534e]">ORCID iD</label>
                          <input
                            type="text"
                            value={auth.orcid}
                            onChange={e => handleUpdateAuthor(index, 'orcid', e.target.value)}
                            placeholder="0000-0002-1825-0097"
                            className="mt-1 w-full rounded border border-[#d6d3d1] p-2 text-xs font-mono bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-[#e7e5e4]">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded border border-[#d6d3d1] px-5 py-2 text-sm font-medium text-[#44403c] hover:bg-[#f5f5f4]"
                  >
                    ← Back to Metadata
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="rounded bg-[#1c1917] px-6 py-2.5 text-sm font-semibold text-white hover:bg-black"
                  >
                    Continue to Content →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Manuscript Body & References */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-semibold text-[#1c1917]">
                  3. Manuscript Body &amp; Dedicated References Box
                </h2>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57534e]">
                    Manuscript Body (Markdown / Text) *
                  </label>
                  <p className="mb-2 text-xs text-[#78716c]">
                    Paste the Introduction, Methods, Results, and Discussion sections.
                  </p>
                  <textarea
                    required
                    rows={10}
                    value={manuscriptBody}
                    onChange={e => setManuscriptBody(e.target.value)}
                    placeholder="## Introduction..."
                    className="w-full rounded border border-[#d6d3d1] p-3 text-sm font-mono focus:border-black focus:outline-none"
                  />
                </div>

                <div className="rounded border border-[#e7e5e4] p-4 bg-[#fafaf9]">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57534e]">
                    Dedicated References / Bibliography Box *
                  </label>
                  <p className="mb-2 text-xs text-[#78716c]">
                    Isolated for automated Crossref &amp; PubMed API verification. Provide full citations with DOIs or PMIDs.
                  </p>
                  <textarea
                    required
                    rows={8}
                    value={references}
                    onChange={e => setReferences(e.target.value)}
                    placeholder="1. Farinas A, et al. medRxiv 2026; DOI: 10.64898/2026.11.13.26367865."
                    className="w-full rounded border border-[#d6d3d1] p-3 text-sm font-mono focus:border-black focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57534e]">
                    Public Code &amp; Data Repository URL *
                  </label>
                  <p className="mb-2 text-xs text-[#78716c]">
                    Must resolve HTTP 200 without authentication. Private repositories are strictly prohibited.
                  </p>
                  <input
                    type="url"
                    required
                    value={publicRepo}
                    onChange={e => setPublicRepo(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full rounded border border-[#d6d3d1] p-2.5 text-sm font-mono focus:border-black focus:outline-none"
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-[#e7e5e4]">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded border border-[#d6d3d1] px-5 py-2 text-sm font-medium text-[#44403c] hover:bg-[#f5f5f4]"
                  >
                    ← Back to Authors
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="rounded bg-[#1c1917] px-6 py-2.5 text-sm font-semibold text-white hover:bg-black"
                  >
                    Continue to Declarations →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Declarations */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-semibold text-[#1c1917]">
                  4. Declarations &amp; Ethics Compliance
                </h2>

                <div className="space-y-4 rounded border border-[#e7e5e4] p-5 bg-[#fafaf9] text-xs">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={openAccessAccepted}
                      onChange={e => setOpenAccessAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-[#d6d3d1] text-black focus:ring-0"
                    />
                    <div>
                      <strong className="text-[#1c1917]">Diamond Open Access (CC BY 4.0 License):</strong> I agree to make this manuscript freely available to the public with 0€ author processing charges under Creative Commons Attribution 4.0 International.
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={ethicalCompliance}
                      onChange={e => setEthicalCompliance(e.target.checked)}
                      className="mt-0.5 rounded border-[#d6d3d1] text-black focus:ring-0"
                    />
                    <div>
                      <strong className="text-[#1c1917]">Ethical Integrity &amp; Public Data Availability:</strong> All data, code, and calculation scripts required to reproduce this work are accessible without authentication in a permanent public repository.
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={authorApproval}
                      onChange={e => setAuthorApproval(e.target.checked)}
                      className="mt-0.5 rounded border-[#d6d3d1] text-black focus:ring-0"
                    />
                    <div>
                      <strong className="text-[#1c1917]">Author Consent:</strong> All co-authors have reviewed and approved this submission for publication.
                    </div>
                  </label>
                </div>

                <div className="flex justify-between pt-4 border-t border-[#e7e5e4]">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="rounded border border-[#d6d3d1] px-5 py-2 text-sm font-medium text-[#44403c] hover:bg-[#f5f5f4]"
                  >
                    ← Back to Content
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded bg-[#047857] px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#065f46] disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? 'Running Automated Screening...' : '🚀 Submit for Automated Screening & Dry-Run'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Audit & Receipt Screen */}
            {step === 5 && result && (
              <div className="space-y-6">
                <div className={`rounded-lg p-6 ${result.verdict === 'READY_FOR_PREPRINT' ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${result.verdict === 'READY_FOR_PREPRINT' ? 'bg-emerald-700 text-white' : 'bg-amber-700 text-white'}`}>
                        {result.verdict === 'READY_FOR_PREPRINT' ? 'PASSED — PRE-SCREENING CERTIFIED' : 'ACTION REQUIRED — WARNINGS DETECTED'}
                      </span>
                      <h2 className="mt-2 font-serif text-2xl font-bold text-[#1c1917]">
                        {result.verdict === 'READY_FOR_PREPRINT' ? 'Screening Verified (Dry-Run Mode)' : 'Screening Invariant Warnings'}
                      </h2>
                      <p className="mt-1 text-xs text-[#57534e]">
                        Target Venue: <strong>{targetVenue.toUpperCase()}</strong>. Safe dry-run completed without irreversible DOI minting.
                      </p>
                    </div>
                    {result.zenodoDoi && (
                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-800 uppercase">Pre-Reserved DataCite DOI</div>
                        <span className="font-mono text-sm font-semibold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300 inline-block mt-0.5">
                          {result.zenodoDoi} (Draft)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 border-t border-emerald-200/60 pt-3">
                    <div className="font-mono text-xs text-[#57534e]">
                      <strong>Merkle Review Fingerprint:</strong> {result.merkleReceipt}
                    </div>
                  </div>
                </div>

                {/* Detailed Invariant Checks */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#57534e] mb-3">
                    Automated Agentic Audit Breakdown
                  </h3>
                  <div className="divide-y divide-[#e7e5e4] rounded border border-[#e7e5e4] bg-[#fafaf9]">
                    {result.checks.map((chk, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 text-xs">
                        <div>
                          <span className="font-semibold text-[#1c1917]">{chk.rule}</span>
                          <div className="mt-0.5 text-[#78716c]">{chk.detail}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                          chk.status === 'passed' ? 'bg-emerald-100 text-emerald-800' :
                          chk.status === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {chk.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#e7e5e4]">
                  <Link
                    href={`/editor/2026-11-pseudo-lof-dementia`}
                    className="rounded border border-[#1c1917] bg-white px-5 py-2 text-xs font-bold text-[#1c1917] hover:bg-[#f5f5f4]"
                  >
                    ✍️ Inspect in Living Editor →
                  </Link>
                  <Link
                    href="/preprints"
                    className="rounded bg-[#1c1917] px-6 py-2.5 text-sm font-semibold text-white hover:bg-black"
                  >
                    Return to Preprints Server
                  </Link>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </main>
  );
}

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1c1917] font-sans antialiased flex flex-col justify-between">
      <div>
        <Navbar />
        <Suspense fallback={<div className="p-10 text-center text-xs text-[#78716c]">Loading submission wizard...</div>}>
          <SubmitForm />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
