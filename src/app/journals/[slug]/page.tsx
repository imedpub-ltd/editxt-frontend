'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { JOURNALS, JournalData } from '@/lib/journalsData';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function JournalPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const journal: JournalData | undefined = JOURNALS[resolvedParams.slug];

  if (!journal) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState<'current' | 'about' | 'editorial' | 'submissions' | 'hybrid-review' | 'archives' | 'github'>('current');
  const [expandedAbstract, setExpandedAbstract] = useState<string | null>(null);

  const toggleAbstract = (id: string) => {
    setExpandedAbstract(expandedAbstract === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1c1917] font-sans antialiased flex flex-col justify-between">
      <div>
        <Navbar currentJournal={journal.slug} />

        {/* Journal Hero & Masthead Banner (OJS Header Block) */}
        <section className="bg-white border-b border-[#e7e5e4] py-8">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="bg-[#1c1917] text-white font-mono text-xs font-bold px-2.5 py-1 rounded">
                    {journal.acronym}
                  </span>
                  <span className="text-xs font-semibold text-[#047857] bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-0.5 rounded">
                    Diamond Open Access · 0 € APC
                  </span>
                  <span className="text-xs text-[#78716c] font-mono">
                    Online ISSN: {journal.issnOnline}
                  </span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1917] mt-3">
                  {journal.name}
                </h1>
                <p className="mt-2 text-sm text-[#57534e] max-w-3xl leading-relaxed">
                  {journal.tagline}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#78716c]">
                  <span><strong>Publisher:</strong> {journal.publisher}</span>
                  <span>·</span>
                  <span><strong>DOI Prefix:</strong> Crossref <code className="bg-[#f5f5f4] px-1 rounded">{journal.crossrefPrefix}</code></span>
                  <span>·</span>
                  <span><strong>License:</strong> CC BY 4.0</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2 flex-shrink-0">
                <Link
                  href={`/submit?journal=${journal.slug}`}
                  className="rounded bg-[#047857] hover:bg-[#065f46] text-white px-5 py-2.5 text-xs font-semibold text-center shadow-sm transition"
                >
                  Make a Submission →
                </Link>
                <a
                  href={journal.githubRepo}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded border border-[#d6d3d1] hover:bg-[#f5f5f4] text-[#44403c] px-4 py-2 text-xs font-medium text-center transition flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub Operator ↗</span>
                </a>
              </div>
            </div>

            {/* OJS Tab Navigation Bar */}
            <div className="mt-8 flex flex-wrap border-b border-[#e7e5e4] text-xs font-semibold gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-3 py-2 border-b-2 transition cursor-pointer ${activeTab === 'current' ? 'border-[#1c1917] text-[#1c1917]' : 'border-transparent text-[#78716c] hover:text-black'}`}
              >
                Current Issue (Vol. {journal.currentIssue.volume}, No. {journal.currentIssue.issue})
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-3 py-2 border-b-2 transition cursor-pointer ${activeTab === 'about' ? 'border-[#1c1917] text-[#1c1917]' : 'border-transparent text-[#78716c] hover:text-black'}`}
              >
                Aims & Scope
              </button>
              <button
                onClick={() => setActiveTab('editorial')}
                className={`px-3 py-2 border-b-2 transition cursor-pointer ${activeTab === 'editorial' ? 'border-[#1c1917] text-[#1c1917]' : 'border-transparent text-[#78716c] hover:text-black'}`}
              >
                Editorial Team
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-3 py-2 border-b-2 transition cursor-pointer ${activeTab === 'submissions' ? 'border-[#1c1917] text-[#1c1917]' : 'border-transparent text-[#78716c] hover:text-black'}`}
              >
                Author Guidelines
              </button>
              <button
                onClick={() => setActiveTab('hybrid-review')}
                className={`px-3 py-2 border-b-2 transition cursor-pointer ${activeTab === 'hybrid-review' ? 'border-[#047857] text-[#047857] font-bold' : 'border-transparent text-[#78716c] hover:text-black'}`}
              >
                ⚡ Hybrid Peer Review (Agentic + Human)
              </button>
              <button
                onClick={() => setActiveTab('archives')}
                className={`px-3 py-2 border-b-2 transition cursor-pointer ${activeTab === 'archives' ? 'border-[#1c1917] text-[#1c1917]' : 'border-transparent text-[#78716c] hover:text-black'}`}
              >
                Issue Archives
              </button>
              <button
                onClick={() => setActiveTab('github')}
                className={`px-3 py-2 border-b-2 transition cursor-pointer ${activeTab === 'github' ? 'border-[#1c1917] text-[#1c1917]' : 'border-transparent text-[#78716c] hover:text-black'}`}
              >
                GitHub Architecture & Code
              </button>
            </div>
          </div>
        </section>

        {/* Tab Content Display */}
        <main className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Primary Content (2 Columns) */}
            <div className="lg:col-span-2 space-y-8">

              {/* TAB 1: CURRENT ISSUE (OJS Table of Contents) */}
              {activeTab === 'current' && (
                <div>
                  <div className="border-b border-[#e7e5e4] pb-4 mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#78716c]">
                      Table of Contents
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-[#1c1917] mt-1">
                      Vol. {journal.currentIssue.volume} No. {journal.currentIssue.issue} ({journal.currentIssue.year}): {journal.currentIssue.title}
                    </h2>
                    <div className="text-xs text-[#78716c] mt-1">
                      Published: {journal.currentIssue.publishedDate}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {journal.currentIssue.articles.map((article) => (
                      <div key={article.id} className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm hover:border-[#d6d3d1] transition">
                        <div className="flex items-center justify-between text-xs text-[#78716c] mb-2">
                          <span className="font-semibold uppercase tracking-wider text-[#047857]">{article.section}</span>
                          <span>pp. {article.pages}</span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-[#1c1917] leading-snug">
                          {article.title}
                        </h3>
                        <div className="text-xs font-medium text-[#44403c] mt-2">
                          {article.authors}
                        </div>
                        <div className="text-xs text-[#78716c] italic mt-0.5">
                          {article.affiliations}
                        </div>

                        {/* Expandable Abstract */}
                        <div className="mt-3">
                          <button
                            onClick={() => toggleAbstract(article.id)}
                            className="text-xs text-[#2563eb] hover:underline font-medium cursor-pointer"
                          >
                            {expandedAbstract === article.id ? 'Hide Abstract ▲' : 'View Abstract ▼'}
                          </button>
                          {expandedAbstract === article.id && (
                            <p className="mt-2 text-xs leading-relaxed text-[#57534e] bg-[#f5f5f4] p-3 rounded border border-[#e7e5e4]">
                              {article.abstract}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#f5f5f4] flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono bg-[#f5f5f4] px-2 py-0.5 rounded text-[#44403c] border border-[#e7e5e4]">
                              DOI: {article.doi}
                            </span>
                            <span className="text-[#a8a29e]">·</span>
                            <span className="text-[#78716c]">{article.metrics.views} Views</span>
                            <span className="text-[#78716c]">{article.metrics.downloads} Downloads</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {article.pdfUrl ? (
                              <a
                                href={article.pdfUrl}
                                download
                                className="rounded bg-[#1c1917] hover:bg-black text-white px-3 py-1 font-semibold text-xs transition"
                              >
                                PDF (Full Text)
                              </a>
                            ) : (
                              <span className="rounded bg-[#f5f5f4] text-[#78716c] px-3 py-1 text-xs font-medium">
                                HTML / PDF
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: AIMS AND SCOPE */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm">
                    <h2 className="font-serif text-xl font-bold text-[#1c1917] mb-3">Focus and Scope</h2>
                    <p className="text-sm leading-relaxed text-[#44403c]">{journal.aimsAndScope}</p>

                    <h3 className="font-serif text-base font-bold text-[#1c1917] mt-6 mb-2">Subject Sections</h3>
                    <ul className="space-y-1.5 text-xs text-[#57534e] list-disc list-inside">
                      {journal.sections.map((sec, i) => (
                        <li key={i}>{sec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm">
                    <h2 className="font-serif text-xl font-bold text-[#1c1917] mb-3">Diamond Open Access Policy</h2>
                    <p className="text-sm leading-relaxed text-[#44403c]">
                      {journal.name} provides immediate, permanent open access to its content under the principle that making research freely available to the public supports a greater global exchange of knowledge.
                    </p>
                    <div className="mt-4 bg-[#ecfdf5] border border-[#a7f3d0] p-4 rounded text-xs text-[#065f46] space-y-1">
                      <div>✓ <strong>0 € Article Processing Charges (0 € APC):</strong> Authors pay nothing to submit or publish.</div>
                      <div>✓ <strong>No Subscription Paywalls:</strong> Readers worldwide access full text without institutional subscription.</div>
                      <div>✓ <strong>Author Retains Copyright:</strong> Published under the CC BY 4.0 International License.</div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm">
                    <h2 className="font-serif text-xl font-bold text-[#1c1917] mb-3">Archiving & Preservation</h2>
                    <p className="text-sm leading-relaxed text-[#44403c]">
                      All published issues are permanently archived across three redundant preservation layers: Zenodo (CERN / InvenioRDM), GitHub Git LFS historical trees, and the official iMedPub institutional repository.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: EDITORIAL TEAM */}
              {activeTab === 'editorial' && (
                <div className="space-y-6">
                  <div className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#78716c]">Editor-in-Chief</span>
                    <h3 className="font-serif text-xl font-bold text-[#1c1917] mt-1">{journal.editorInChief.name}</h3>
                    <p className="text-xs text-[#57534e] mt-0.5">{journal.editorInChief.affiliation}</p>
                    {journal.editorInChief.orcid && (
                      <div className="mt-2 font-mono text-xs text-[#047857]">
                        ORCID: <a href={`https://orcid.org/${journal.editorInChief.orcid}`} target="_blank" rel="noreferrer" className="underline">{journal.editorInChief.orcid}</a>
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm">
                    <h3 className="font-serif text-lg font-bold text-[#1c1917] mb-4">Editorial Board Members</h3>
                    <div className="divide-y divide-[#f5f5f4]">
                      {journal.editorialBoard.map((member, i) => (
                        <div key={i} className="py-3">
                          <div className="text-sm font-bold text-[#1c1917]">{member.name}</div>
                          <div className="text-xs font-medium text-[#047857]">{member.role}</div>
                          <div className="text-xs text-[#78716c]">{member.affiliation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: AUTHOR GUIDELINES & SUBMISSIONS */}
              {activeTab === 'submissions' && (
                <div className="space-y-6">
                  <div className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm">
                    <h2 className="font-serif text-xl font-bold text-[#1c1917] mb-3">Submission Preparation Checklist</h2>
                    <p className="text-xs text-[#78716c] mb-4">
                      As part of the submission process, authors are required to check off their submission\'s compliance with all of the following items:
                    </p>
                    <ul className="space-y-2 text-xs text-[#44403c]">
                      {journal.authorGuidelines.checklist.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#047857] font-bold">☑</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm">
                    <h3 className="font-serif text-lg font-bold text-[#1c1917] mb-2">Manuscript Layout & Formatting</h3>
                    <p className="text-xs leading-relaxed text-[#44403c]">{journal.authorGuidelines.formatting}</p>

                    <h3 className="font-serif text-base font-bold text-[#1c1917] mt-4 mb-2">Citations & References Policy</h3>
                    <p className="text-xs leading-relaxed text-[#44403c]">{journal.authorGuidelines.referencesPolicy}</p>

                    <h3 className="font-serif text-base font-bold text-[#1c1917] mt-4 mb-2">Data & Code Availability</h3>
                    <p className="text-xs leading-relaxed text-[#44403c]">{journal.authorGuidelines.dataAvailability}</p>
                  </div>

                  <div className="bg-[#1c1917] text-white p-6 rounded-lg text-center">
                    <h3 className="font-serif text-xl font-bold">Ready to submit your manuscript?</h3>
                    <p className="text-xs text-[#d6d3d1] mt-1 max-w-md mx-auto">
                      Submissions take 5 minutes with real-time automated verification of citations, hygiene, and data accessibility.
                    </p>
                    <Link
                      href={`/submit?journal=${journal.slug}`}
                      className="mt-4 inline-block bg-[#047857] hover:bg-[#065f46] text-white px-6 py-2.5 rounded text-xs font-semibold tracking-wide transition shadow"
                    >
                      Start Submission Process →
                    </Link>
                  </div>
                </div>
              )}

              {/* TAB 5: HYBRID PEER REVIEW (AGENTIC + HUMAN ON GITHUB) */}
              {activeTab === 'hybrid-review' && (
                <div className="space-y-6">
                  <div className="rounded-lg border border-[#047857] bg-[#f0fdf4] p-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#047857]">The EdiTxt Protocol</span>
                    <h2 className="font-serif text-2xl font-bold text-[#14532d] mt-1">
                      Hybrid Peer Review Architecture (Agentic AI + Human Experts)
                    </h2>
                    <p className="text-xs text-[#166534] mt-2 leading-relaxed">
                      How do we manage hybrid peer review transparently on GitHub? Traditional journals suffer from 4-month review delays, hidden editorial black boxes, and unverified data claims. Our journals utilize GitHub as a secure, distributed workflow engine combining <strong>instant automated screening agents</strong> with <strong>rigorous human expert evaluation</strong>.
                    </p>
                  </div>

                  {/* 5-Stage GitHub Workflow Diagram */}
                  <div className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm">
                    <h3 className="font-serif text-lg font-bold text-[#1c1917] mb-4">
                      The 5-Stage Operational Pipeline on GitHub
                    </h3>

                    <div className="space-y-6">
                      {journal.peerReviewModel.workflowStages.map((stage) => (
                        <div key={stage.step} className="flex gap-4 items-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1c1917] text-white font-bold text-xs flex items-center justify-center">
                            {stage.step}
                          </div>
                          <div className="flex-grow">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h4 className="font-serif text-base font-bold text-[#1c1917]">{stage.name}</h4>
                              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                                stage.actor === 'Agent' ? 'bg-purple-100 text-purple-800' :
                                stage.actor === 'Editor' ? 'bg-blue-100 text-blue-800' :
                                stage.actor === 'Reviewer' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                Actor: {stage.actor}
                              </span>
                            </div>
                            <div className="mt-1 font-mono text-[11px] text-[#78716c]">
                              GitHub Engine: <code className="bg-[#f5f5f4] px-1 py-0.5 rounded">{stage.githubMechanism}</code>
                            </div>
                            <p className="mt-1 text-xs text-[#44403c] leading-relaxed">
                              {stage.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Division of Labor: Agentic vs Human */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border border-[#e7e5e4] bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase">
                        <span>🤖</span> What the Autonomous Agent Does (Phase 1)
                      </div>
                      <p className="mt-2 text-xs text-[#57534e] leading-relaxed">
                        {journal.peerReviewModel.agenticRole}
                      </p>
                      <ul className="mt-3 space-y-1.5 text-xs text-[#44403c] list-disc list-inside">
                        <li>Real-time Crossref & PubMed citation DOI resolver.</li>
                        <li>Automated Title Hygiene and causal hype filtering.</li>
                        <li>Public repository reachability test (HTTP 200 unauthenticated).</li>
                        <li>Generates tamper-proof SHA-256 Merkle audit receipt.</li>
                      </ul>
                    </div>

                    <div className="rounded-lg border border-[#e7e5e4] bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase">
                        <span>👤</span> What Human Peer Reviewers Do (Phase 2)
                      </div>
                      <p className="mt-2 text-xs text-[#57534e] leading-relaxed">
                        {journal.peerReviewModel.humanRole}
                      </p>
                      <ul className="mt-3 space-y-1.5 text-xs text-[#44403c] list-disc list-inside">
                        <li>Evaluate scientific originality and hypothesis plausibility.</li>
                        <li>Assess clinical or theoretical significance for the field.</li>
                        <li>Scrutinize ethical standards and potential confounders.</li>
                        <li>Provide qualitative editorial recommendations and guidance.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: ARCHIVES */}
              {activeTab === 'archives' && (
                <div className="space-y-6">
                  <div className="border-b border-[#e7e5e4] pb-4 mb-4">
                    <h2 className="font-serif text-xl font-bold text-[#1c1917]">Past Volumes and Issues</h2>
                    <p className="text-xs text-[#78716c] mt-1">Complete historical archive of {journal.name}.</p>
                  </div>

                  <div className="space-y-4">
                    {journal.archives.map((arc, i) => (
                      <div key={i} className="rounded-lg border border-[#e7e5e4] bg-white p-5 shadow-sm flex items-center justify-between">
                        <div>
                          <h3 className="font-serif text-base font-bold text-[#1c1917]">
                            Volume {arc.volume} ({arc.year})
                          </h3>
                          <p className="text-xs text-[#78716c] mt-0.5">{arc.description}</p>
                        </div>
                        <span className="text-xs font-semibold text-[#047857] bg-[#ecfdf5] px-2.5 py-1 rounded">
                          {arc.issueCount} Issues Available
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: GITHUB OPERATOR */}
              {activeTab === 'github' && (
                <div className="space-y-6">
                  <div className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm">
                    <h2 className="font-serif text-xl font-bold text-[#1c1917] mb-2">Connected GitHub Infrastructure</h2>
                    <p className="text-xs text-[#57534e] leading-relaxed mb-4">
                      Each journal maintains its own dedicated GitHub repository within the <code>imedpub-ltd</code> organization. Submissions, automated actions, screening workflows, and version tags are hosted directly on GitHub.
                    </p>

                    <div className="bg-[#1c1917] text-[#d6d3d1] p-4 rounded-lg font-mono text-xs space-y-2">
                      <div><span className="text-[#a8a29e]"># Target Repository:</span> {journal.githubRepo}</div>
                      <div><span className="text-[#a8a29e]"># Issues Tracker:</span> {journal.githubIssuesUrl}</div>
                      <div><span className="text-[#a8a29e]"># Screening Action:</span> .github/workflows/screening.yml</div>
                      <div><span className="text-[#a8a29e]"># Automation Script:</span> scripts/process-issue-submission.cjs</div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <a
                        href={journal.githubRepo}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded bg-[#1c1917] text-white px-4 py-2 text-xs font-semibold hover:bg-black transition"
                      >
                        Inspect Code Repository ↗
                      </a>
                      <a
                        href={journal.githubIssuesUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded border border-[#d6d3d1] text-[#44403c] px-4 py-2 text-xs font-medium hover:bg-[#f5f5f4] transition"
                      >
                        View Open Submissions / Issues ↗
                      </a>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Sidebar (OJS Right Navigation / Metadata Block) */}
            <aside className="space-y-6">
              {/* Make a Submission Box */}
              <div className="rounded-lg border border-[#e7e5e4] bg-white p-5 shadow-sm">
                <h3 className="font-serif text-base font-bold text-[#1c1917] mb-1">Make a Submission</h3>
                <p className="text-xs text-[#78716c] mb-4">
                  0 € APC. Instant automated pre-screening and Merkle audit certification.
                </p>
                <Link
                  href={`/submit?journal=${journal.slug}`}
                  className="block w-full text-center rounded bg-[#047857] hover:bg-[#065f46] text-white py-2 text-xs font-semibold transition shadow-sm"
                >
                  Submit to {journal.acronym}
                </Link>
              </div>

              {/* Journal Info & Metadata */}
              <div className="rounded-lg border border-[#e7e5e4] bg-white p-5 shadow-sm space-y-3 text-xs">
                <h4 className="font-semibold uppercase tracking-wider text-[#78716c] text-[11px]">
                  Journal Information
                </h4>
                <div className="flex justify-between border-b border-[#f5f5f4] pb-2">
                  <span className="text-[#78716c]">Online ISSN:</span>
                  <span className="font-mono font-medium text-[#1c1917]">{journal.issnOnline}</span>
                </div>
                <div className="flex justify-between border-b border-[#f5f5f4] pb-2">
                  <span className="text-[#78716c]">DOI Prefix:</span>
                  <span className="font-mono font-medium text-[#1c1917]">{journal.crossrefPrefix}</span>
                </div>
                <div className="flex justify-between border-b border-[#f5f5f4] pb-2">
                  <span className="text-[#78716c]">Frequency:</span>
                  <span className="font-medium text-[#1c1917]">Continuous / Quarterly Issues</span>
                </div>
                <div className="flex justify-between border-b border-[#f5f5f4] pb-2">
                  <span className="text-[#78716c]">Open Access:</span>
                  <span className="font-medium text-[#047857]">Diamond (0 € APC)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716c]">License:</span>
                  <span className="font-medium text-[#1c1917]">CC BY 4.0</span>
                </div>
              </div>

              {/* Publisher & Governance */}
              <div className="rounded-lg border border-[#e7e5e4] bg-white p-5 shadow-sm text-xs space-y-2">
                <h4 className="font-semibold uppercase tracking-wider text-[#78716c] text-[11px]">
                  Publisher
                </h4>
                <div className="font-medium text-[#1c1917]">iMedPub Limited</div>
                <div className="text-[#78716c]">London, United Kingdom</div>
                <div className="text-[11px] text-[#a8a29e] pt-1">
                  Crossref Member 2155 · COPE Best Practice Guidelines
                </div>
              </div>

              {/* Indexing Badges */}
              <div className="rounded-lg border border-[#e7e5e4] bg-white p-5 shadow-sm text-xs">
                <h4 className="font-semibold uppercase tracking-wider text-[#78716c] text-[11px] mb-3">
                  Persistent Identifiers
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded bg-[#f5f5f4] px-2.5 py-1 text-[11px] font-mono text-[#44403c] border border-[#e7e5e4]">
                    Crossref 10.3823
                  </span>
                  <span className="rounded bg-[#f5f5f4] px-2.5 py-1 text-[11px] font-mono text-[#44403c] border border-[#e7e5e4]">
                    Zenodo CERN
                  </span>
                  <span className="rounded bg-[#f5f5f4] px-2.5 py-1 text-[11px] font-mono text-[#44403c] border border-[#e7e5e4]">
                    DataCite
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
