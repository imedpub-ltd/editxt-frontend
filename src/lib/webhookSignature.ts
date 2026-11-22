import { createHmac, timingSafeEqual } from 'crypto';

/** Verifies a GitHub-style `X-Hub-Signature-256` header (`sha256=<hex>`) in constant time. */
export function verifyWebhookSignature(secret: string, rawBody: string, header: string | null): boolean {
  if (!header || !header.startsWith('sha256=')) return false;
  const expected = Buffer.from(`sha256=${createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex')}`);
  const received = Buffer.from(header, 'utf8');
  return received.length === expected.length && timingSafeEqual(received, expected);
}
