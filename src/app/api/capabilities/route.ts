import '../../../lib/env';
import { NextResponse } from 'next/server';
import { registry } from '../../../lib/registry';

/** Lists every registered capability contract (name, schemas, determinism). */
export async function GET() {
  return NextResponse.json({ capabilities: registry.contracts() });
}
