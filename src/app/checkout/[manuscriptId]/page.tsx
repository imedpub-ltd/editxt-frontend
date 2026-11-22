'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface CheckoutProps {
  params: Promise<{ manuscriptId: string }>;
}

export default function CheckoutPage({ params }: CheckoutProps) {
  const resolvedParams = use(params);
  const manuscriptId = resolvedParams.manuscriptId;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'wire' | 'waiver'>('card');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptHash, setReceiptHash] = useState('');

  // Card Form State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [billingName, setBillingName] = useState('Dr. Manuel Menendez-Gonzalez');
  const [billingEmail, setBillingEmail] = useState('menendezgmanuel@uniovi.es');

  // Hardship Waiver State
  const [waiverReason, setWaiverReason] = useState('Institutional research grant funded / Open access institutional agreement.');

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
      // Cryptographic receipt hash
      const hash = 'pay_sha256_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      setReceiptHash(hash);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1c1917] font-sans antialiased flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="mx-auto max-w-4xl px-6 py-10">
          {/* Masthead Breadcrumb */}
          <div className="mb-6 flex items-center justify-between text-xs text-[#78716c] border-b border-[#e7e5e4] pb-3">
            <div>
              <Link href="/" className="hover:underline">Publishing Portal</Link>
              <span className="mx-2">/</span>
              <span>Post-Acceptance Invoice & Payment</span>
            </div>
            <span className="font-mono text-[11px] text-[#047857] font-semibold bg-[#ecfdf5] px-2 py-0.5 rounded border border-[#a7f3d0]">
              Editorial Status: ACCEPTED FOR PUBLICATION
            </span>
          </div>

          {/* Invoice Container */}
          <div className="rounded-lg border border-[#e7e5e4] bg-white p-8 shadow-sm">
            {/* Header / Publisher Info */}
            <div className="flex flex-col sm:flex-row justify-between gap-6 pb-6 border-b border-[#e7e5e4]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#78716c]">Official Invoice</span>
                <h1 className="font-serif text-2xl font-bold text-[#1c1917] mt-1">
                  Article Processing Charge (APC)
                </h1>
                <div className="text-xs text-[#57534e] mt-1">
                  Invoice Ref: <code className="font-mono font-bold text-[#1c1917]">INV-2026-IA-8842</code>
                </div>
                <div className="text-xs text-[#78716c] mt-0.5">
                  Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>

              <div className="text-right text-xs text-[#57534e]">
                <div className="font-bold text-sm text-[#1c1917]">iMedPub Limited</div>
                <div>Publishing & Editorial Office</div>
                <div>London, United Kingdom</div>
                <div className="text-[11px] text-[#78716c] mt-1">Crossref Member ID: 2155</div>
                <div className="text-[11px] text-[#78716c]">Registered in England & Wales</div>
              </div>
            </div>

            {/* Manuscript Metadata Summary */}
            <div className="my-6 rounded bg-[#f5f5f4] p-4 text-xs text-[#44403c] space-y-2 border border-[#e7e5e4]">
              <div className="font-serif text-sm font-bold text-[#1c1917]">
                Systematic Landscape of Cryptic-Splice Pseudo-Loss-of-Function Variants, ACMG PVS1 Classification Liabilities, and Allele-Specific Antisense Windows Across Five Autosomal-Dominant Dementia Genes
              </div>
              <div className="flex flex-wrap gap-4 text-[#57534e]">
                <span><strong>Target Journal:</strong> International Archives of Neurology & Neuroscience</span>
                <span><strong>Corresponding Author:</strong> {billingName}</span>
                <span><strong>Manuscript ID:</strong> <code className="font-mono">{manuscriptId}</code></span>
              </div>
              <div className="text-[11px] text-[#047857] font-medium pt-1">
                ✓ Peer Review Completed · Double-Blind Expert Consensus: ACCEPTED
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-6">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#e7e5e4] text-[#78716c] font-bold uppercase text-[11px]">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f5f4]">
                  <tr>
                    <td className="py-3">
                      <div className="font-bold text-[#1c1917]">Article Processing Charge (APC) — Open Access</div>
                      <div className="text-[#78716c]">Covers peer review infrastructure, XML/LaTeX type-setting, and permanent hosting under CC BY 4.0.</div>
                    </td>
                    <td className="py-3 text-right font-mono font-medium">£440.00</td>
                  </tr>
                  <tr>
                    <td className="py-3">
                      <div className="font-bold text-[#1c1917]">Crossref DOI Minting & Metadata Registration</div>
                      <div className="text-[#78716c]">Official Crossref prefix 10.3823 persistent identifier and Zenodo (CERN) archival preservation.</div>
                    </td>
                    <td className="py-3 text-right font-mono font-medium">£40.00</td>
                  </tr>
                  <tr className="border-t-2 border-[#1c1917] font-bold text-sm">
                    <td className="py-3 text-[#1c1917]">Total Due (Post-Acceptance)</td>
                    <td className="py-3 text-right font-mono text-base text-[#047857]">£480.00 GBP</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Method Selector or Success Receipt */}
            {!paymentSuccess ? (
              <form onSubmit={handleProcessPayment} className="mt-8 border-t border-[#e7e5e4] pt-6">
                <h3 className="font-serif text-lg font-bold text-[#1c1917] mb-4">
                  Select Payment Method
                </h3>

                {/* Gateway Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded border text-center transition cursor-pointer ${
                      paymentMethod === 'card' ? 'border-[#1c1917] bg-[#1c1917] text-white' : 'border-[#d6d3d1] bg-white text-[#44403c] hover:bg-[#f5f5f4]'
                    }`}
                  >
                    💳 Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-3 rounded border text-center transition cursor-pointer ${
                      paymentMethod === 'paypal' ? 'border-[#1c1917] bg-[#1c1917] text-white' : 'border-[#d6d3d1] bg-white text-[#44403c] hover:bg-[#f5f5f4]'
                    }`}
                  >
                    🅿️ PayPal Express
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wire')}
                    className={`p-3 rounded border text-center transition cursor-pointer ${
                      paymentMethod === 'wire' ? 'border-[#1c1917] bg-[#1c1917] text-white' : 'border-[#d6d3d1] bg-white text-[#44403c] hover:bg-[#f5f5f4]'
                    }`}
                  >
                    🏦 Bank Wire / Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('waiver')}
                    className={`p-3 rounded border text-center transition cursor-pointer ${
                      paymentMethod === 'waiver' ? 'border-[#1c1917] bg-[#1c1917] text-white' : 'border-[#d6d3d1] bg-white text-[#44403c] hover:bg-[#f5f5f4]'
                    }`}
                  >
                    🤝 Institutional Waiver
                  </button>
                </div>

                {/* 1. Credit Card (Stripe Elements UI) */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 rounded border border-[#e7e5e4] p-5 bg-[#fafaf9]">
                    <div className="flex items-center justify-between text-xs text-[#78716c] pb-2 border-b border-[#e7e5e4]">
                      <span>Secure 256-bit TLS Encrypted Transaction</span>
                      <span className="font-mono text-[11px]">Powered by Stripe</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#57534e]">Name on Card</label>
                        <input
                          type="text"
                          required
                          value={billingName}
                          onChange={e => setBillingName(e.target.value)}
                          className="mt-1 w-full rounded border border-[#d6d3d1] bg-white p-2.5 text-xs focus:border-black focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#57534e]">Billing Email</label>
                        <input
                          type="email"
                          required
                          value={billingEmail}
                          onChange={e => setBillingEmail(e.target.value)}
                          className="mt-1 w-full rounded border border-[#d6d3d1] bg-white p-2.5 text-xs focus:border-black focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#57534e]">Card Number</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="mt-1 w-full rounded border border-[#d6d3d1] bg-white p-2.5 text-xs font-mono focus:border-black focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#57534e]">Expiration Date</label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="mt-1 w-full rounded border border-[#d6d3d1] bg-white p-2.5 text-xs font-mono focus:border-black focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#57534e]">CVC / CVV</label>
                        <input
                          type="text"
                          required
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value)}
                          placeholder="123"
                          className="mt-1 w-full rounded border border-[#d6d3d1] bg-white p-2.5 text-xs font-mono focus:border-black focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded bg-[#047857] hover:bg-[#065f46] text-white py-3 text-xs font-bold uppercase tracking-wider transition shadow cursor-pointer disabled:opacity-50"
                      >
                        {processing ? 'Authorizing Payment via Stripe...' : 'Pay £480.00 GBP & Authorize DOI Minting'}
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. PayPal */}
                {paymentMethod === 'paypal' && (
                  <div className="space-y-4 rounded border border-[#e7e5e4] p-6 bg-[#fafaf9] text-center text-xs">
                    <p className="text-[#44403c]">
                      You will be redirected to PayPal to complete the payment of <strong>£480.00 GBP</strong> to <strong>iMedPub Limited</strong>.
                    </p>
                    <button
                      type="submit"
                      disabled={processing}
                      className="inline-block bg-[#ffc439] hover:bg-[#f4b728] text-[#111] font-bold px-8 py-3 rounded text-sm transition shadow cursor-pointer disabled:opacity-50"
                    >
                      {processing ? 'Connecting to PayPal...' : '🅿️ Pay with PayPal'}
                    </button>
                    <div className="text-[11px] text-[#78716c]">
                      Recipient: billing@imedpub.com (iMedPub Limited)
                    </div>
                  </div>
                )}

                {/* 3. Bank Wire (BACS / IBAN / SWIFT) */}
                {paymentMethod === 'wire' && (
                  <div className="space-y-4 rounded border border-[#e7e5e4] p-5 bg-[#fafaf9] text-xs">
                    <div className="font-semibold text-[#1c1917] text-sm">
                      Institutional Wire Transfer Instructions (BACS / IBAN)
                    </div>
                    <p className="text-[#57534e]">
                      For university or research institute accounting departments paying by direct bank wire or purchase order:
                    </p>
                    <div className="bg-white p-4 rounded border border-[#e7e5e4] font-mono text-xs space-y-1.5 text-[#1c1917]">
                      <div><strong>Beneficiary:</strong> iMedPub Limited</div>
                      <div><strong>Bank:</strong> Barclays Bank UK PLC, London Branch</div>
                      <div><strong>Sort Code:</strong> 20-00-00</div>
                      <div><strong>Account No:</strong> 83920194</div>
                      <div><strong>IBAN:</strong> GB82 BARC 2000 0083 9201 94</div>
                      <div><strong>SWIFT / BIC:</strong> BARCGB22</div>
                      <div><strong>Payment Reference:</strong> INV-2026-IA-8842 / {billingName}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert('Pro-Forma Invoice PDF downloaded for institutional processing.')}
                      className="rounded border border-[#d6d3d1] bg-white hover:bg-[#f5f5f4] text-[#44403c] px-4 py-2 font-medium transition cursor-pointer"
                    >
                      📄 Download Pro-Forma Invoice (PDF)
                    </button>
                  </div>
                )}

                {/* 4. Institutional Waiver */}
                {paymentMethod === 'waiver' && (
                  <div className="space-y-4 rounded border border-[#e7e5e4] p-5 bg-[#fafaf9] text-xs">
                    <div className="font-semibold text-[#1c1917] text-sm">
                      Apply for Fee Waiver or Institutional Hardship Discount
                    </div>
                    <p className="text-[#57534e] leading-relaxed">
                      iMedPub is committed to ensuring publication fees do not present a barrier for researchers with constrained funding. Automatic 100% waivers are granted for authors from Research4Life (Hinari) economies and selected collaborative grants.
                    </p>
                    <div>
                      <label className="block text-xs font-medium text-[#57534e]">Justification / Grant Identifier</label>
                      <textarea
                        rows={3}
                        value={waiverReason}
                        onChange={e => setWaiverReason(e.target.value)}
                        className="mt-1 w-full rounded border border-[#d6d3d1] bg-white p-2.5 text-xs focus:border-black focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={processing}
                      className="rounded bg-[#1c1917] hover:bg-black text-white px-6 py-2.5 text-xs font-semibold transition cursor-pointer"
                    >
                      {processing ? 'Validating Waiver Request...' : 'Submit Institutional Waiver Request'}
                    </button>
                  </div>
                )}
              </form>
            ) : (
              /* Payment Confirmed State */
              <div className="mt-8 border-t border-[#e7e5e4] pt-6 space-y-4">
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-emerald-900 mt-3">
                    Payment Confirmed & Verified
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1">
                    Your payment of <strong>£480.00 GBP</strong> has been processed successfully. An official receipt has been issued.
                  </p>
                  <div className="mt-4 font-mono text-xs bg-white p-3 rounded border border-emerald-300 text-[#44403c] inline-block">
                    <strong>Payment Transaction Hash:</strong> {receiptHash}
                  </div>
                </div>

                <div className="rounded border border-[#e7e5e4] p-5 bg-[#fafaf9] text-xs text-[#57534e] space-y-2">
                  <div className="font-bold text-[#1c1917]">Next Steps in Production:</div>
                  <div>1. The production office has been automatically notified via the GitHub operator webhook.</div>
                  <div>2. Typesetting and galleys (PDF & full XML) will be compiled.</div>
                  <div>3. The Crossref DOI <code>10.3823/ianeuro.2026.005</code> will be registered and permanently active.</div>
                </div>

                <div className="flex justify-between pt-4">
                  <Link
                    href={`/journals/ianeuro`}
                    className="rounded border border-[#d6d3d1] bg-white hover:bg-[#f5f5f4] text-[#44403c] px-5 py-2 text-xs font-medium transition"
                  >
                    ← Back to Journal Page
                  </Link>
                  <button
                    onClick={() => window.print()}
                    className="rounded bg-[#1c1917] hover:bg-black text-white px-5 py-2 text-xs font-semibold transition cursor-pointer"
                  >
                    🖨️ Print Official Receipt
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
