import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[#e7e5e4] bg-white py-12 text-[#78716c] text-xs">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="font-serif text-base font-bold text-[#1c1917]">
            International Archives Series
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[#78716c]">
            A Diamond Open Access publishing ecosystem operated by <strong>iMedPub Limited</strong>.
            All articles are published with 0€ author processing charges (0€ APC) under CC BY 4.0.
          </p>
          <div className="mt-3 font-mono text-[11px] text-[#a8a29e]">
            Registered in England & Wales · Crossref Member 2155
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-[#1c1917] uppercase tracking-wider text-[11px]">
            Journals & Preprints
          </h4>
          <ul className="mt-3 space-y-1.5">
            <li><Link href="/preprints" className="hover:text-black">EdiTxt Preprints Server</Link></li>
            <li><Link href="/journals/ia" className="hover:text-black">International Archives (IA)</Link></li>
            <li><Link href="/journals/iamed" className="hover:text-black">International Archives of Medicine (IAmed)</Link></li>
            <li><Link href="/journals/ianeuro" className="hover:text-black">International Archives of Neurology & Neuroscience (IAneuro)</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-[#1c1917] uppercase tracking-wider text-[11px]">
            Editorial & Review System
          </h4>
          <ul className="mt-3 space-y-1.5">
            <li><Link href="/about" className="hover:text-black">Hybrid Peer Review Model</Link></li>
            <li><Link href="/about#ethics" className="hover:text-black">Publication Ethics & COPE Compliance</Link></li>
            <li><Link href="/submit" className="hover:text-black">Author Submission Guidelines</Link></li>
            <li><a href="https://zenodo.org/communities/imedpub" target="_blank" rel="noreferrer" className="hover:text-black">Zenodo Community Repository ↗</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-[#1c1917] uppercase tracking-wider text-[11px]">
            Open Infrastructure
          </h4>
          <p className="mt-3 leading-relaxed text-[#78716c]">
            ediTxt uses a journal managing system based on GitHub. All workflow traces, screening logs, and peer evaluations maintain cryptographically falsifiable Merkle receipts.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded bg-[#f5f5f4] border border-[#e7e5e4] px-2 py-0.5 text-[10px] font-mono text-[#44403c]">
              Crossref: 10.3823
            </span>
            <span className="rounded bg-[#f5f5f4] border border-[#e7e5e4] px-2 py-0.5 text-[10px] font-mono text-[#44403c]">
              DataCite: 10.5281
            </span>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 mt-8 pt-6 border-t border-[#f5f5f4] flex flex-wrap justify-between items-center text-[#a8a29e]">
        <div>© {new Date().getFullYear()} iMedPub Limited. Open Access under CC BY 4.0.</div>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <Link href="/contact" className="hover:underline">Contact Editorial Office</Link>
        </div>
      </div>
    </footer>
  );
}
