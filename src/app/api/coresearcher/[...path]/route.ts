import '../../../../lib/env';
import { NextResponse } from 'next/server';
import { forwardToCoResearcher } from '../../../../../../src/core/integrations/coresearcher/proxy';
import { coresearcherConfig } from '../../../../../../src/core/integrations/coresearcher/proxyPolicy';

/**
 * Server-side proxy to CoResearcher (CORESEARCHER_URL, default port 8001). It adds CORESEARCHER_API_KEY, which
 * never reaches the browser, and forwards only what src/core/integrations/coresearcher/proxyPolicy.ts allows:
 * every GET, and POST to CoResearcher's READ_ONLY endpoints unless EDITXT_CORESEARCHER_WRITES=enabled.
 */

type Context = { params: Promise<{ path: string[] }> };

async function handle(request: Request, context: Context) {
  const { path } = await context.params;
  const body = request.method === 'POST' ? await request.text() : null;
  const result = await forwardToCoResearcher(
    { method: request.method, segments: path, search: new URL(request.url).search, body },
    coresearcherConfig(process.env)
  );
  return new NextResponse(result.body, {
    status: result.status,
    headers: { 'content-type': result.contentType, 'cache-control': 'no-store', ...result.headers }
  });
}

export const dynamic = 'force-dynamic';
export const GET = handle;
export const POST = handle;

export async function PUT() {
  return NextResponse.json({ error: 'PUT is not forwarded to CoResearcher.' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'DELETE is not forwarded to CoResearcher.' }, { status: 405 });
}
