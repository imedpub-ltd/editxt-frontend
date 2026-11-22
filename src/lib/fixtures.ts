/*
 * Prototype data. There is no persistence layer yet, so every page reads from here.
 * Replace with the document store once it exists; the pages only depend on these shapes.
 */
import type { DataAssertionAnchor, ManifestDelta } from '../../../src/core/github/CodeToTextImpactAnalyzer';
import type { ReviewGateFinding } from '../../../src/core/publication/PublicationPipeline';
import type { EvidenceRequest } from '../../../src/core/integrations/coresearcher/contract';
import type { SemanticSegmentType } from '../../../src/core/review/PreSubmissionDeepReviewCapability';

export const DOCUMENT_ID = 'MANUSCRIPT-ALZHEIMER-TAU-2026';
export const BUNDLE_ID = `bundle-${DOCUMENT_ID}`;
export const MANUSCRIPT_TITLE = 'Longitudinal cognitive decline predicted by pTau217';

export type Segment =
  | { kind: 'text'; text: string }
  | { kind: 'anchor'; variablePath: string; display: string };

export interface Provenance {
  model: string;
  confidence: number;
  contextHash: string;
  evidence: string[];
  inference: string;
}

export interface Block {
  id: string;
  kind: 'paragraph' | 'claim' | 'generated';
  semanticType?: SemanticSegmentType;
  claimId?: string;
  segments: Segment[];
  provenance?: Provenance;
}

export const blocks: Block[] = [
  {
    id: 'intro-p1',
    kind: 'paragraph',
    semanticType: 'NarrativeBlock',
    segments: [{ kind: 'text', text: 'We analyzed the cognitive trajectory of the cohort over multiple visits.' }]
  },
  {
    id: 'theorem-p1',
    kind: 'paragraph',
    semanticType: 'ProofBlock',
    segments: [
      {
        kind: 'text',
        text: 'Theorem 1 (Biomarker Trajectory Operator). The latent progression operator T exhibits global convergence to a unique fixed-point attractor across all patient states.'
      }
    ]
  },
  {
    id: 'lemma-aux-1',
    kind: 'paragraph',
    semanticType: 'ProofBlock',
    segments: [
      {
        kind: 'text',
        text: 'Auxiliary Lemma A.1 bounds the third-order residual tensor by iterating an intermediate bound that is never invoked in Theorem 1.'
      }
    ]
  },
  {
    id: 'claim-1',
    kind: 'claim',
    semanticType: 'EmpiricalBlock',
    claimId: 'CLM-001',
    segments: [{ kind: 'text', text: 'The longitudinal change rate of pTau217 predicts MMSE decline (p = 0.0012).' }]
  },
  {
    id: 'results-p2',
    kind: 'paragraph',
    semanticType: 'EmpiricalBlock',
    segments: [
      { kind: 'text', text: 'The model achieved a peak accuracy of ' },
      { kind: 'anchor', variablePath: 'model_metrics.accuracy', display: '94.2%' },
      { kind: 'text', text: ' on the holdout set. However, the false positive rate increased to ' },
      { kind: 'anchor', variablePath: 'model_metrics.false_positive_rate', display: '0.05' },
      { kind: 'text', text: ', which requires further tuning.' }
    ]
  },
  {
    id: 'fragment-1',
    kind: 'generated',
    semanticType: 'CitationBlock',
    segments: [
      {
        kind: 'text',
        text: 'Recent studies show that continuous learning models exhibit catastrophic forgetting when exposed to sequentially distinct distributions (arxiv:2003.01234).'
      }
    ],
    provenance: {
      model: 'gpt-4o-2024-08-06',
      confidence: 0.92,
      contextHash: 'a7b2c9d',
      evidence: ['arxiv:2003.01234'],
      inference: 'Forgetting correlates with distribution shift'
    }
  }
];

export const anchors: DataAssertionAnchor[] = [
  {
    nodeId: 'results-p2',
    variablePath: 'model_metrics.accuracy',
    expectedValue: 0.942,
    contextText: 'peak accuracy of 94.2% on the holdout set',
    claimId: 'CLM-002',
    somArtifactId: 'art_fig_cc15b6e9',
    lineageHash: '2b3fafce913c4cd4'
  },
  {
    nodeId: 'results-p2',
    variablePath: 'model_metrics.false_positive_rate',
    expectedValue: 0.05,
    contextText: 'false positive rate increased to 0.05',
    claimId: 'CLM-003',
    somArtifactId: 'art_tab_0f21',
    lineageHash: '9c1e77a0b5d2'
  }
];

/** Latest DataAILab manifest delta for this manuscript (what the CI last reported). */
export const latestManifestDeltas: ManifestDelta[] = [
  { variablePath: 'model_metrics.false_positive_rate', oldValue: 0.05, newValue: 0.08 }
];

export const reviewFindings: (ReviewGateFinding & { description: string; targetBlockId: string; reviewerId: string })[] = [
  {
    id: 'f-stale-fpr',
    severity: 'critical',
    resolved: false,
    targetBlockId: 'results-p2',
    reviewerId: 'ReproducibilityReviewer',
    description: 'The manuscript reports a false positive rate of 0.05, but the latest DataAILab manifest reports 0.08.'
  },
  {
    id: 'f-123',
    severity: 'major',
    resolved: false,
    targetBlockId: 'fragment-1',
    reviewerId: 'EpistemicReviewer',
    description: 'The claim "forgetting is fully mitigated" is not supported by the EvidenceTraceArtifact.'
  }
];

export const journal = { name: 'Nature', figureCount: 2, referenceIds: ['doi:10.1038/nature14539'] };

export const gateInputs = {
  citations: [
    { id: 'ref-lecun-2015', text: 'LeCun, Bengio & Hinton (2015) Deep learning', doi: '10.1038/nature14539' }
  ] as { id: string; text: string; pmid?: string; doi?: string }[],
  literatureQueries: ['"pTau217" AND "cognitive decline"'],
  humanReviewerId: 'USR-reviewer-1',
  agentModelVersion: 'gemini-1.5-pro',
  venueName: 'Nature'
};

/**
 * Which CoResearcher evidence each manuscript claim is linked to. CLM-001 rests on the plasma pTau217 two-cutoff rule,
 * which CoResearcher holds as a formal case. Until a store exists, the links live here; the editor sends one
 * EvidenceRequest per claim and records the answer as an EvidenceTraceArtifact.
 */
export const evidenceBindings: Record<string, EvidenceRequest> = {
  'CLM-001': { target: { type: 'FORMAL_CASE', id: 'ptau217_two_cutoff' }, claim_ids: ['CLM-001'] }
};
