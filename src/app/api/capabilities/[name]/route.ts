import '../../../../lib/env';
import { NextResponse } from 'next/server';
import { CapabilityInputError, CapabilityNotFoundError } from '../../../../../../src/core/capabilities/CapabilityRegistry';
import { registry } from '../../../../lib/registry';

/** Invokes a registered capability with a JSON body. Returns the output and its trace id. */
export async function POST(request: Request, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params;

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be JSON.' }, { status: 400 });
  }

  try {
    return NextResponse.json(await registry.invoke(name, input));
  } catch (error) {
    if (error instanceof CapabilityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof CapabilityInputError) {
      return NextResponse.json({ error: error.message, problems: error.problems }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
