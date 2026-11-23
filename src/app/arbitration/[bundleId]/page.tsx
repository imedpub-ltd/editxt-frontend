'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { PhaseNav } from '@/components/PhaseNav';
import { getDocumentById, type ReviewFinding } from '@/lib/editorFixtures';

interface Message {
  id: number;
  sender: string;
  role: 'agent' | 'human_reviewer' | 'author';
  text: string;
  time: string;
}

export default function ArbitrationPage({
  params
}: {
  params: Promise<{ bundleId: string }>;
}) {
  const { bundleId } = use(params);
  const documentId = bundleId.replace(/^bundle-/, '');
  const doc = getDocumentById(documentId);

  const [findings, setFindings] = useState<ReviewFinding[]>(doc.reviewFindings);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'Forensic Screener (Agent)',
      role: 'agent',
      text: 'Automated screening complete. Title hygiene verified. 24 citations cross-checked in PubMed/Crossref (0 fabricated, 0 broken). Merkle root certified: 6d5506fc... Clean pass.',
      time: '10:14 AM'
    },
    {
      id: 2,
      sender: 'Clinical Neurologist (Independent Expert Reviewer)',
      role: 'human_reviewer',
      text: 'The demonstration of PSEN1 cryptic donor activation rather than haploinsufficiency is compelling. Please verify that the 22-mer ASO therapeutic window clearly specifies whether it preserves the canonical +1/+2 GU donor.',
      time: '11:30 AM'
    },
    {
      id: 3,
      sender: 'Author (You)',
      role: 'author',
      text: 'Thank you for the constructive note. Section 3.4 and Figure 4 explicitly annotate the canonical +1/+2 GU boundaries, demonstrating that the steric-blocking window spares the authentic donor while occluding the pathogenic cryptic site.',
      time: '12:05 PM'
    }
  ]);
  const [draft, setDraft] = useState('');
  const [gatesCleared, setGatesCleared] = useState(true);

  const toggleResolved = (id: string) => {
    setFindings(prev =>
      prev.map(f => (f.id === id ? { ...f, resolved: !f.resolved } : f))
    );
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;

    const newMsg: Message = {
      id: messages.length + 1,
      sender: 'Author (You)',
      role: 'author',
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setDraft('');
  };

  const blockingFindings = findings.filter(f => f.severity === 'critical' && !f.resolved);

  return (
    <div className="flex min-h-screen flex-col bg-[#fafaf9] text-[#1c1917]">
      <PhaseNav documentId={documentId} />

      {/* Header */}
      <div className="border-b border-[#e7e5e4] bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#78716c]">
                Arbitration Bundle: {bundleId}
              </span>
              <span className="rounded bg-indigo-50 px-2 py-0.5 font-mono text-[11px] font-bold text-indigo-700">
                ⚡ Hybrid Peer Review (Agentic + Human)
              </span>
            </div>
            <h1 className="mt-1 font-serif text-2xl font-bold text-[#1c1917]">
              {doc.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/editor/${documentId}`}
              className="rounded border border-[#d6d3d1] bg-white px-3 py-2 text-xs font-medium text-[#44403c] hover:bg-[#f5f5f4] transition"
            >
              ← Edit Manuscript Draft
            </Link>

            {blockingFindings.length === 0 && (
              <Link
                href={`/checkout/${documentId}`}
                className="rounded border border-emerald-600 bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
              >
                Proceed to Acceptance Checkout →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col md:flex-row">
        {/* Left: Review Thread & Messages */}
        <main className="flex-1 px-6 py-8 md:px-10 border-r border-[#e7e5e4]">
          <h2 className="font-serif text-xl font-bold text-[#1c1917] mb-4">
            Peer Review &amp; Editorial Arbitration Thread
          </h2>

          <div className="space-y-4">
            {messages.map(m => (
              <div
                key={m.id}
                className={`rounded-lg border p-4 text-xs ${
                  m.role === 'agent'
                    ? 'border-indigo-200 bg-indigo-50/50'
                    : m.role === 'human_reviewer'
                    ? 'border-amber-200 bg-amber-50/40'
                    : 'border-[#e7e5e4] bg-white'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[#1c1917] mb-1">
                  <div className="flex items-center gap-2">
                    <span>{m.sender}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-mono text-[10px] ${
                        m.role === 'agent'
                          ? 'bg-indigo-200 text-indigo-900'
                          : m.role === 'human_reviewer'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {m.role}
                    </span>
                  </div>
                  <span className="font-mono text-[#78716c] text-[10px]">{m.time}</span>
                </div>
                <p className="text-[#44403c] leading-relaxed text-sm">{m.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="mt-6">
            <label htmlFor="arbitration-reply" className="block text-xs font-bold text-[#78716c] uppercase mb-2">
              Post Response to Reviewers &amp; Editorial Board
            </label>
            <textarea
              id="arbitration-reply"
              rows={3}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Address reviewer queries or provide updated data anchors..."
              className="w-full rounded border border-[#d6d3d1] p-3 text-xs focus:border-[#1c1917] focus:outline-none"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                className="rounded bg-[#1c1917] px-4 py-2 text-xs font-bold text-white hover:bg-black transition"
              >
                Post Arbitration Reply
              </button>
            </div>
          </form>
        </main>

        {/* Right: Review Findings & Gates Checklist */}
        <aside className="w-full md:w-96 p-6 space-y-6">
          <div>
            <h3 className="font-serif text-base font-bold text-[#1c1917] mb-3">
              Reviewer Findings
            </h3>
            {findings.length === 0 ? (
              <p className="text-xs text-[#78716c]">Zero blocking reviewer findings.</p>
            ) : (
              <div className="space-y-3">
                {findings.map(f => (
                  <div
                    key={f.id}
                    className="rounded border border-[#e7e5e4] bg-white p-3 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                          f.severity === 'critical'
                            ? 'bg-rose-100 text-rose-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {f.severity.toUpperCase()}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleResolved(f.id)}
                        className={`text-[11px] font-bold ${
                          f.resolved ? 'text-emerald-700' : 'text-[#2563eb] hover:underline'
                        }`}
                      >
                        {f.resolved ? '✓ Marked Resolved' : 'Mark Resolved'}
                      </button>
                    </div>
                    <p className="text-[#44403c]">{f.description}</p>
                    <div className="font-mono text-[10px] text-[#78716c]">
                      Reviewer: {f.reviewerId}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-[#e7e5e4] pt-6">
            <h3 className="font-serif text-base font-bold text-[#1c1917] mb-3">
              Publication Acceptance Gates
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded border border-emerald-200 bg-emerald-50 p-2 text-emerald-900">
                <span>1. Title Hygiene Audit</span>
                <span className="font-bold">PASSED</span>
              </div>
              <div className="flex items-center justify-between rounded border border-emerald-200 bg-emerald-50 p-2 text-emerald-900">
                <span>2. Citation Resolution (Crossref/PubMed)</span>
                <span className="font-bold">PASSED</span>
              </div>
              <div className="flex items-center justify-between rounded border border-emerald-200 bg-emerald-50 p-2 text-emerald-900">
                <span>3. Public Code &amp; Data Availability</span>
                <span className="font-bold">PASSED</span>
              </div>
              <div className="flex items-center justify-between rounded border border-emerald-200 bg-emerald-50 p-2 text-emerald-900">
                <span>4. Camera-Ready LaTeX/PDF Typesetting</span>
                <span className="font-bold">PASSED</span>
              </div>
              <div className="flex items-center justify-between rounded border border-emerald-200 bg-emerald-50 p-2 text-emerald-900">
                <span>5. Human Independent Review Consensus</span>
                <span className="font-bold">PASSED</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
