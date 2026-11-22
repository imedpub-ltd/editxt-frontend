import '../../../../lib/env';
import { NextResponse } from 'next/server';
import { CapabilityInputError, CapabilityNotFoundError } from '../../../../../../src/core/capabilities/CapabilityRegistry';
import { registry } from '../../../../lib/registry';

/**
 * POST /api/review/pre-submission
 * Executes the sovereign Pre-Submission Deep Review capability (`review.deep_review_pre_submission`),
 * performing Dynamic Document Segmentation, Dynamic Compute Allocation, and parallel forensic checks.
 */
export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be JSON.' }, { status: 400 });
  }

  try {
    const invocation = await registry.invoke('review.deep_review_pre_submission', input);
    return NextResponse.json(invocation);
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
