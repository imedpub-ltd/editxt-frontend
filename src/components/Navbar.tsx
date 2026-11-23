'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  currentJournal?: string;
}

export default function Navbar({ currentJournal }: NavbarProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [githubUser, setGithubUser] = useState<string | null>(null);

  const handleSimulateLogin = () => {
    setGithubUser('manuelmdez');
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setGithubUser(null);
  };

  return (
    <>
      {/* Top Universal Identity & System Header (OJS Global Bar) */}
      <div className="bg-[#1c1917] text-[#d6d3d1] text-xs border-b border-[#292524] px-6 py-2">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-white tracking-wide">iMedPub Publishing Portal</span>
            <span className="text-[#78716c]">|</span>
            <Link href="/preprints" className="hover:text-white transition">EdiTxt Preprints</Link>
            <span className="text-[#78716c]">·</span>
            <Link href="/journals/ia" className="hover:text-white transition">IA</Link>
            <span className="text-[#78716c]">·</span>
            <Link href="/journals/iamed" className="hover:text-white transition">IAmed</Link>
            <span className="text-[#78716c]">·</span>
            <Link href="/journals/ianeuro" className="hover:text-white transition">IAneuro</Link>
          </div>

          <div className="flex items-center gap-3">
            {githubUser ? (
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                <span className="font-mono text-white">@{githubUser}</span>
                <button
                  onClick={handleLogout}
                  className="text-[#a8a29e] hover:text-white underline ml-2 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1.5 bg-[#292524] hover:bg-[#383330] text-white px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>Author Login (GitHub)</span>
              </button>
            )}
            <Link
              href="/submit"
              className="bg-[#047857] hover:bg-[#065f46] text-white px-3 py-1 rounded text-xs font-semibold tracking-wide transition"
            >
              Submit Manuscript
            </Link>
          </div>
        </div>
      </div>

      {/* Main Journal Masthead (OJS Classic Top Block) */}
      <header className="border-b border-[#e7e5e4] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <Link href="/" className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#1c1917] hover:opacity-90">
              International Archives Series
            </Link>
            <div className="text-xs text-[#78716c] font-medium tracking-wide mt-0.5">
              Diamond Open Access (0€ APC) · Peer-Reviewed Journals & Preprints · iMedPub Limited
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#44403c]">
            <Link href="/" className="hover:text-black">Home</Link>
            <Link href="/preprints" className={`hover:text-black ${currentJournal === 'preprints' ? 'text-black font-bold' : ''}`}>Preprints</Link>
            <Link href="/journals/ia" className={`hover:text-black ${currentJournal === 'ia' ? 'text-black font-bold' : ''}`}>IA (Multidisciplinary)</Link>
            <Link href="/journals/iamed" className={`hover:text-black ${currentJournal === 'iamed' ? 'text-black font-bold' : ''}`}>IAmed (Medicine)</Link>
            <Link href="/journals/ianeuro" className={`hover:text-black ${currentJournal === 'ianeuro' ? 'text-black font-bold' : ''}`}>IAneuro (Neurology)</Link>
            <Link href="/editor/2026-11-pseudo-lof-dementia" className="hover:text-black font-semibold text-[#047857]">Living Editor</Link>
            <Link href="/checkout/2026-11-pseudo-lof-dementia" className="hover:text-black text-xs text-[#78716c]">Gateway</Link>
          </nav>
        </div>
      </header>

      {/* GitHub Identity Explanation Notice (Requested by User) */}
      <div className="bg-[#f5f5f4] border-b border-[#e7e5e4] px-6 py-2.5 text-xs text-[#44403c]">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#1c1917] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>
              <strong>Editorial Notice:</strong> ediTxt uses a journal managing system based on GitHub. Please, log in your GitHub account or create an account if you do not have one.
            </span>
          </div>
          {!githubUser && (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-xs font-semibold text-[#1c1917] hover:underline flex-shrink-0 cursor-pointer"
            >
              Sign In →
            </button>
          )}
        </div>
      </div>

      {/* GitHub Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-[#e7e5e4]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e5e4]">
              <h3 className="font-serif text-lg font-bold text-[#1c1917]">
                Author Authentication
              </h3>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-[#78716c] hover:text-black font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-sm text-[#44403c]">
              <p>
                <strong>ediTxt uses a journal managing system based on GitHub.</strong> Please, log in your GitHub account or create an account if you do not have one.
              </p>
              <div className="bg-[#f5f5f4] p-3 rounded text-xs text-[#57534e] space-y-1">
                <div>✓ Transparent and tamper-proof peer review audit trail.</div>
                <div>✓ Automated reproducibility screening on commit.</div>
                <div>✓ Direct linkage to your ORCID and GitHub verified identity.</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleSimulateLogin}
                className="w-full flex items-center justify-center gap-2 bg-[#1c1917] hover:bg-black text-white py-2.5 rounded font-medium text-sm transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                Continue with GitHub Account
              </button>
              <a
                href="https://github.com/signup"
                target="_blank"
                rel="noreferrer"
                className="w-full text-center border border-[#d6d3d1] hover:bg-[#f5f5f4] text-[#44403c] py-2 rounded text-xs font-medium transition"
              >
                Create a new GitHub account ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
