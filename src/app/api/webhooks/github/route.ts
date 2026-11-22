import '../../../../lib/env';
import { NextResponse } from 'next/server';
import { registry } from '../../../../lib/registry';
import { anchors } from '../../../../lib/fixtures';
import { verifyWebhookSignature } from '../../../../lib/webhookSignature';
import { GitHubCommentPoster } from '../../../../../../src/core/github/GitHubCommentPoster';

/**
 * Scientific CI entry point. DataAILab's CI posts the manifest deltas of a PR, signed with
 * GITHUB_WEBHOOK_SECRET (HMAC-SHA256, header X-Hub-Signature-256). The manuscript anchors come
 * from EdiTXT, never from the caller.
 *
 * Posting the comment is opt-in (see GitHubCommentPoster). A failed post does not fail the
 * analysis: the response carries `posting.reason` instead.
 */

const MAX_BODY_BYTES = 1_000_000;
const DELIVERY_MEMORY = 1000;

/** GitHub retries deliveries. Remember recent delivery ids so a retry does not post a second comment. This is per process. */
const recentDeliveries = new Set<string>();

function rememberDelivery(id: string): boolean {
  if (recentDeliveries.has(id)) return false;
  recentDeliveries.add(id);
  if (recentDeliveries.size > DELIVERY_MEMORY) {
    const oldest = recentDeliveries.values().next().value;
    if (oldest !== undefined) recentDeliveries.delete(oldest);
  }
  return true;
}

export async function POST(request: Request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'GITHUB_WEBHOOK_SECRET is not configured.' }, { status: 503 });
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large.' }, { status: 413 });
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large.' }, { status: 413 });
  }
  if (!verifyWebhookSignature(secret, rawBody, request.headers.get('x-hub-signature-256'))) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
  }

  const deliveryId = request.headers.get('x-github-delivery');
  if (deliveryId && !rememberDelivery(deliveryId)) {
    return NextResponse.json({ duplicate: true, deliveryId }, { status: 200 });
  }

  let payload: { prNumber?: unknown; manifestDeltas?: unknown; repository?: unknown };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Body must be JSON.' }, { status: 400 });
  }
  if (!Number.isInteger(payload.prNumber) || (payload.prNumber as number) < 1 || !Array.isArray(payload.manifestDeltas)) {
    return NextResponse.json(
      { error: 'Body must contain prNumber (positive integer) and manifestDeltas (array).' },
      { status: 400 }
    );
  }
  const prNumber = payload.prNumber as number;

  const { output } = await registry.invoke('review.check_manuscript_impact', {
    anchors,
    manifestDeltas: payload.manifestDeltas
  });

  const poster = new GitHubCommentPoster({
    token: process.env.GITHUB_TOKEN,
    enabled: process.env.EDITXT_PR_COMMENTS === 'enabled'
  });
  const posting = typeof payload.repository === 'string'
    ? await poster.post({ repository: payload.repository, prNumber, body: output.comment })
    : { posted: false as const, reason: 'payload has no repository (owner/repo)' };

  return NextResponse.json({ prNumber, ...output, posting });
}
