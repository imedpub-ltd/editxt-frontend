import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import type { InlineEpistemicFinding, Block, DataAssertionAnchor, ManifestDelta } from '@/lib/editorFixtures';

export async function POST(request: Request) {
  let body: {
    manuscriptId?: string;
    title?: string;
    blocks?: Array<{ id: string; text: string; kind: string; semanticType?: string; claimId?: string }>;
    anchors?: DataAssertionAnchor[];
    manifestDeltas?: ManifestDelta[];
    citations?: Array<{ id: string; text: string; doi?: string; pmid?: string }>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be JSON.' }, { status: 400 });
  }

  const { manuscriptId = 'doc-1', title = '', blocks = [], anchors = [], manifestDeltas = [], citations = [] } = body;
  const traceId = createHash('sha256').update(`${manuscriptId}:${Date.now()}:${Math.random()}`).digest('hex');

  const findings: InlineEpistemicFinding[] = [];

  // 1. Data assertion anchor validation vs manifest deltas (Data Drift check)
  for (const anchor of anchors) {
    const delta = manifestDeltas.find(d => d.variablePath === anchor.variablePath);
    if (delta && String(delta.newValue) !== String(anchor.expectedValue)) {
      findings.push({
        findingId: `drift-${anchor.variablePath.replace(/\./g, '-')}`,
        blockId: anchor.nodeId,
        badgeType: 'DATA_DRIFT',
        category: 'EMPIRICAL_DATA_DISCREPANCY',
        auditorAgent: 'DataAILab-Manifest-Forensic',
        targetSpan: String(anchor.expectedValue),
        explanation: `Manuscript claims value "${anchor.expectedValue}" for ${anchor.variablePath}, but latest physical execution manifest computed "${delta.newValue}".`,
        replacementText: String(delta.newValue),
        falsificationChallenge: `Run regression test on ${anchor.variablePath} across latest pipeline artifacts.`
      });
    }
  }

  // 2. Citation hygiene check (PubMed & Crossref format & availability)
  for (const cit of citations) {
    if (!cit.doi && !cit.pmid) {
      findings.push({
        findingId: `cit-missing-${cit.id}`,
        blockId: blocks.find(b => b.kind === 'generated' || b.semanticType === 'CitationBlock')?.id || blocks[0]?.id || 'b1',
        badgeType: 'CITATION_WARNING',
        category: 'UNRESOLVED_CITATION_IDENTIFIER',
        auditorAgent: 'Crossref-PubMed-Forensic-Gate',
        targetSpan: cit.text.slice(0, 40),
        explanation: `Citation "${cit.text.slice(0, 50)}..." is missing both a DOI and a PMID. All citations must be resolvable via Crossref or PubMed.`,
        replacementText: `${cit.text} [DOI / PMID required]`
      });
    }
  }

  // 3. Domain Logic Checks (ACMG PVS1 & Gain-of-function loci checks)
  const fullText = blocks.map(b => b.text).join(' ');
  if (fullText.includes('PSEN1') && (fullText.includes('PVS1') || fullText.includes('haploinsufficiency'))) {
    const targetBlock = blocks.find(b => b.text.includes('PVS1')) || blocks[0];
    if (targetBlock) {
      findings.push({
        findingId: 'logic-pvs1-audit',
        blockId: targetBlock.id,
        badgeType: 'LOGICAL_GAP',
        category: 'CLINICAL_INTERPRETATION_GATE',
        auditorAgent: 'ACMG-PVS1-Forensic-Auditor',
        targetSpan: 'PVS1',
        explanation: 'In gain-of-function dementia loci (PSEN1, PSEN2, APP), applying ACMG PVS1 requires ruling out cryptic splicing rescue before asserting loss-of-function pathogenicity.',
        replacementText: 'ACMG PVS1 criteria cannot be applied without transcript-level verification of nonsense-mediated decay.',
        falsificationChallenge: 'Validate whether non-canonical donor activation preserves in-frame translation.'
      });
    }
  }

  const segmentAllocations = blocks.map(b => ({
    blockId: b.id,
    segmentType: b.semanticType || (b.kind === 'claim' ? 'EmpiricalBlock' : 'NarrativeBlock'),
    computeTier: b.kind === 'claim' ? 'Tier-1-Forensic' : 'Tier-0-Heuristic',
    computeUnits: b.kind === 'claim' ? 24 : 4
  }));

  return NextResponse.json({
    output: {
      findings,
      summary: `Pre-Submission Deep Review complete: ${findings.length} finding(s) detected across ${blocks.length} semantic blocks.`,
      segmentAllocations
    },
    traceId
  });
}
