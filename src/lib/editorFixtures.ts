/**
 * Living Editor Data Fixtures for Computable Manuscripts
 * Supports both the real 5-gene dementia manuscript and custom submissions.
 */

export type SemanticSegmentType =
  | 'NarrativeBlock'
  | 'ProofBlock'
  | 'EmpiricalBlock'
  | 'CitationBlock'
  | 'TherapeuticBlock';

export type DeepReviewBadgeType =
  | 'LOGICAL_GAP'
  | 'DATA_DRIFT'
  | 'CITATION_WARNING'
  | 'DISTILLATION_OPPORTUNITY';

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

export interface DataAssertionAnchor {
  nodeId: string;
  variablePath: string;
  expectedValue: unknown;
  contextText: string;
  claimId?: string;
  somArtifactId?: string;
  lineageHash?: string;
}

export interface ManifestDelta {
  variablePath: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface InlineEpistemicFinding {
  findingId: string;
  blockId: string;
  badgeType: DeepReviewBadgeType;
  category: string;
  auditorAgent: string;
  targetSpan: string;
  explanation: string;
  replacementText?: string;
  falsificationChallenge?: string;
}

export interface ReviewFinding {
  id: string;
  severity: 'critical' | 'major' | 'minor';
  resolved: boolean;
  targetBlockId: string;
  reviewerId: string;
  description: string;
}

export interface ComputableDocument {
  id: string;
  title: string;
  targetVenue: string;
  status?: string;
  isFinished?: boolean;
  statusNotice?: string;
  authors: Array<{ name: string; affiliation: string; orcid?: string }>;
  blocks: Block[];
  anchors: DataAssertionAnchor[];
  manifestDeltas: ManifestDelta[];
  findings: InlineEpistemicFinding[];
  reviewFindings: ReviewFinding[];
  citations: Array<{ id: string; text: string; doi?: string; pmid?: string }>;
  figures: Array<{ id: string; title: string; file: string; dpi: number }>;
}

export const DEMENTIA_5GENES_DOCUMENT: ComputableDocument = {
  id: '2026-11-pseudo-lof-dementia',
  title:
    'Systematic Landscape of Cryptic-Splice Pseudo-Loss-of-Function Variants, ACMG PVS1 Classification Liabilities, and Allele-Specific Antisense Windows Across Five Autosomal-Dominant Dementia Genes',
  targetVenue: 'international-archives-of-neurology-neuroscience',
  authors: [
    {
      name: 'Manuel Menendez-Gonzalez',
      affiliation: 'Medicine Dept., Oviedo Univ.; Neurology Dept., HUCA; ISPA, Oviedo, Spain',
      orcid: '0000-0002-1825-0097'
    }
  ],
  blocks: [
    {
      id: 'abs-1',
      kind: 'paragraph',
      semanticType: 'NarrativeBlock',
      segments: [
        {
          kind: 'text',
          text:
            'Whether dominant dementia mutations act through simple haploinsufficiency or toxic alteration of gene product directly governs clinical variant interpretation and antisense oligonucleotide therapeutics. Following population-genetic and splicing evidence that authentic PSEN1 null alleles do not cause early-onset Alzheimer\'s disease (EOAD) whereas the nominal stop-gain PSEN1 c.325A>T (p.K109*) activates a cryptic donor to produce an in-frame deletion (p.K109_L113del), we constructed a systematic five-gene genomic resource comparing three Alzheimer-linked loci (PSEN1, PSEN2, APP), the tauopathy gene MAPT, and the true haploinsufficiency control GRN.'
        }
      ]
    },
    {
      id: 'intro-1',
      kind: 'paragraph',
      semanticType: 'NarrativeBlock',
      segments: [
        {
          kind: 'text',
          text:
            'Interpreting predicted loss-of-function (pLoF) variants in autosomal-dominant adult-onset dementias presents an enduring mechanistic and diagnostic tension. In haploinsufficiency genes such as progranulin (GRN), premature termination codons cause uniform nonsense-mediated decay (NMD) and frontotemporal lobar degeneration. In stark contrast, disease-causing variants in PSEN1, PSEN2, and APP act via gain-of-function or dominant-negative mechanisms.'
        }
      ]
    },
    {
      id: 'methods-1',
      kind: 'paragraph',
      semanticType: 'EmpiricalBlock',
      segments: [
        {
          kind: 'text',
          text:
            'We evaluated all exhaustive GRCh38 MANE Select stop-gain single-nucleotide substitutions across the five target loci, comprising exactly '
        },
        { kind: 'anchor', variablePath: 'genomic_dataset.stopgain_snvs_count', display: '1,092' },
        {
          kind: 'text',
          text:
            ' unique variants, and interrogated molecular predictions using AlphaGenome Variant Impact models alongside cryo-EM structure 6IYC.'
        }
      ]
    },
    {
      id: 'claim-splicing',
      kind: 'claim',
      semanticType: 'EmpiricalBlock',
      claimId: 'CLM-SPLICE-001',
      segments: [
        {
          kind: 'text',
          text:
            'Cryptic-donor and exon-edge stop-gain substitutions exhibit significantly elevated splicing disruption compared with interior nonsense variants ('
        },
        { kind: 'anchor', variablePath: 'statistical_tests.mann_whitney_u_pval', display: 'p = 9.35e-10' },
        { kind: 'text', text: '), activating aberrant transcript architectures.' }
      ]
    },
    {
      id: 'results-clinvar',
      kind: 'paragraph',
      semanticType: 'EmpiricalBlock',
      segments: [
        {
          kind: 'text',
          text:
            'Auditing gnomAD v4.1 and 3,368 ClinVar entries exposed severe diagnostic liabilities: all '
        },
        { kind: 'anchor', variablePath: 'clinvar_audit.pvs1_liabilities_count', display: '11' },
        {
          kind: 'text',
          text:
            ' pathogenic or likely-pathogenic predicted loss-of-function submissions in PSEN1 and PSEN2 inappropriately invoke ACMG PVS1 criteria without experimental proof of haploinsufficiency.'
        }
      ]
    },
    {
      id: 'results-aso',
      kind: 'paragraph',
      semanticType: 'TherapeuticBlock',
      segments: [
        {
          kind: 'text',
          text:
            'Thermodynamic nearest-neighbor scanning revealed high-affinity 22-mer steric-blocking antisense oligonucleotide (ASO) candidate windows with delta-G of '
        },
        { kind: 'anchor', variablePath: 'aso_thermodynamics.delta_g_kcal_mol', display: '-24.8 kcal/mol' },
        {
          kind: 'text',
          text:
            ' that selectively occlude the cryptic splice donor while completely preserving the canonical +1/+2 GU splice boundary.'
        }
      ]
    },
    {
      id: 'citations-block',
      kind: 'generated',
      semanticType: 'CitationBlock',
      segments: [
        {
          kind: 'text',
          text:
            'Recent clinical and functional analyses confirm that heterozygous PSEN1 null variants do not confer Alzheimer disease (Farinas et al., medRxiv 2026; Menendez-Gonzalez M, Alzheimers Dement 2025; Sanjuan-Ruiz et al., Mol Neurodegener Adv 2025).'
        }
      ],
      provenance: {
        model: 'EdiTXT-Forensic-Auditor-2026',
        confidence: 0.99,
        contextHash: '6d5506fc7b03eb4e',
        evidence: [
          'doi:10.64898/2026.11.13.26367865',
          'pmid:39976261',
          'pmid:41127441'
        ],
        inference: 'Heterozygous PSEN1 pLoF does not cause EOAD; true pathogenesis requires gamma-secretase alteration'
      }
    }
  ],
  anchors: [
    {
      nodeId: 'methods-1',
      variablePath: 'genomic_dataset.stopgain_snvs_count',
      expectedValue: 1092,
      contextText: 'exactly 1,092 unique variants',
      claimId: 'CLM-DATA-001',
      somArtifactId: 'supp_table_s1_snvs',
      lineageHash: '8f7a1e3b2c'
    },
    {
      nodeId: 'claim-splicing',
      variablePath: 'statistical_tests.mann_whitney_u_pval',
      expectedValue: '9.35e-10',
      contextText: 'p = 9.35e-10',
      claimId: 'CLM-SPLICE-001',
      somArtifactId: 'figure2_alphagenome_splicing',
      lineageHash: '4d2e9f1a8c'
    },
    {
      nodeId: 'results-clinvar',
      variablePath: 'clinvar_audit.pvs1_liabilities_count',
      expectedValue: 11,
      contextText: 'all 11 pathogenic or likely-pathogenic',
      claimId: 'CLM-CLIN-001',
      somArtifactId: 'table1_clinvar_pvs1',
      lineageHash: '3a1c7b5d9e'
    },
    {
      nodeId: 'results-aso',
      variablePath: 'aso_thermodynamics.delta_g_kcal_mol',
      expectedValue: -24.8,
      contextText: 'delta-G of -24.8 kcal/mol',
      claimId: 'CLM-ASO-001',
      somArtifactId: 'figure4_aso_thermodynamics',
      lineageHash: '9e1f4a7b2d'
    }
  ],
  manifestDeltas: [
    // Zero deltas: current manuscript is 100% consistent with computed manifest
  ],
  findings: [
    {
      findingId: 'f-pvs1-recalibration',
      blockId: 'results-clinvar',
      badgeType: 'LOGICAL_GAP',
      category: 'CLINICAL_INTERPRETATION_GATE',
      auditorAgent: 'ACMG-PVS1-Forensic-Auditor',
      targetSpan: 'inappropriately invoke ACMG PVS1 criteria',
      explanation:
        'PVS1 requires unequivocal evidence that loss of function is an established mechanism of disease. In PSEN1/PSEN2, multiple studies show true nulls do not cause Alzheimer disease.',
      replacementText:
        'Auditing gnomAD v4.1 and 3,368 ClinVar entries exposed severe diagnostic liabilities: all 11 pathogenic or likely-pathogenic predicted loss-of-function submissions in PSEN1 and PSEN2 inappropriately invoke ACMG PVS1 criteria without experimental demonstration of haploinsufficiency, risking clinical misdiagnosis.',
      falsificationChallenge:
        'Examine whether any PSEN1 true null pedigree in ClinVar or gnomAD demonstrates cosegregation with EOAD without cryptic rescue.'
    },
    {
      findingId: 'f-citation-verified',
      blockId: 'citations-block',
      badgeType: 'CITATION_WARNING',
      category: 'BIBLIOGRAPHY_CROSSREF_AUDIT',
      auditorAgent: 'Crossref-PubMed-Gate',
      targetSpan: 'Farinas et al., medRxiv 2026',
      explanation:
        'Citation verified in medRxiv registry (DOI: 10.64898/2026.11.13.26367865). Public repository confirmed without authentication barrier.',
      replacementText:
        'Recent clinical and functional analyses confirm that heterozygous PSEN1 null variants do not confer Alzheimer disease (Farinas et al., medRxiv 2026, DOI: 10.64898/2026.11.13.26367865; Menendez-Gonzalez M, Alzheimers Dement 2025; Sanjuan-Ruiz et al., Mol Neurodegener Adv 2025).',
      falsificationChallenge: 'Crossref API returned HTTP 200 OK.'
    }
  ],
  reviewFindings: [
    {
      id: 'rf-1',
      severity: 'minor',
      resolved: true,
      targetBlockId: 'results-aso',
      reviewerId: 'Human-Reviewer-Independent-Neurology',
      description:
        'ASO thermodynamic window coordinates should clearly indicate whether they overlap canonical +1/+2 GU dinucleotide. (Resolved in manuscript text).'
    }
  ],
  citations: [
    {
      id: 'ref-1',
      text: 'Farinas A, et al. PSEN1 loss-of-function variants do not cause early-onset Alzheimer\'s disease. medRxiv 2026',
      doi: '10.64898/2026.11.13.26367865'
    },
    {
      id: 'ref-2',
      text: 'Menendez-Gonzalez M. Implementing a tridimensional diagnostic framework for personalized medicine in neurodegenerative diseases. Alzheimers Dement 2025; 21(2):e14591',
      doi: '10.1002/alz.14591',
      pmid: '39976261'
    },
    {
      id: 'ref-3',
      text: 'Sanjuan-Ruiz I, et al. The curious case of a heterozygous loss-of-function PSEN1 variant associated with early-onset Alzheimer\'s disease. Mol Neurodegener Adv 2025; 1(1):4',
      doi: '10.1186/s44477-025-00004-x',
      pmid: '41127441'
    },
    {
      id: 'ref-4',
      text: 'Richards S, et al. Standards and guidelines for the interpretation of sequence variants: a joint consensus recommendation of the ACMG and AMP. Genet Med 2015; 17(5):405-424',
      doi: '10.1038/gim.2015.30',
      pmid: '25741868'
    }
  ],
  figures: [
    {
      id: 'fig-1',
      title: 'Figure 1: Gene-level constraint and ClinVar distribution across five dementia genes',
      file: 'fig1_five_gene_constraint_clinvar.pdf',
      dpi: 300
    },
    {
      id: 'fig-2',
      title: 'Figure 2: AlphaGenome stop-gain and cryptic splicing molecular prediction atlas',
      file: 'fig2_alphagenome_stopgain_splicing_atlas.pdf',
      dpi: 300
    },
    {
      id: 'fig-3',
      title: 'Figure 3: AlphaFold 3 / Cryo-EM 6IYC interface and ESM-2 perturbation scores',
      file: 'fig3_cryoem_6iyc_esm2_contacts.pdf',
      dpi: 300
    },
    {
      id: 'fig-4',
      title: 'Figure 4: Steric-blocking antisense oligonucleotide 22-mer thermodynamic landscape',
      file: 'fig4_aso_thermodynamic_landscape.pdf',
      dpi: 300
    }
  ]
};

export const DEFAULT_ALZHEIMER_TAU_DOCUMENT: ComputableDocument = {
  id: 'MANUSCRIPT-ALZHEIMER-TAU-2026',
  title: 'Longitudinal cognitive decline predicted by pTau217',
  targetVenue: 'international-archives-of-medicine',
  authors: [
    {
      name: 'Manuel Menendez-Gonzalez',
      affiliation: 'Medicine Dept., Oviedo Univ., Spain',
      orcid: '0000-0002-1825-0097'
    }
  ],
  blocks: [
    {
      id: 'intro-p1',
      kind: 'paragraph',
      semanticType: 'NarrativeBlock',
      segments: [
        { kind: 'text', text: 'We analyzed the cognitive trajectory of the cohort over multiple visits.' }
      ]
    },
    {
      id: 'claim-1',
      kind: 'claim',
      semanticType: 'EmpiricalBlock',
      claimId: 'CLM-001',
      segments: [
        { kind: 'text', text: 'The longitudinal change rate of pTau217 predicts MMSE decline (p = 0.0012).' }
      ]
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
    }
  ],
  anchors: [
    {
      nodeId: 'results-p2',
      variablePath: 'model_metrics.accuracy',
      expectedValue: 0.942,
      contextText: 'peak accuracy of 94.2%',
      claimId: 'CLM-002'
    },
    {
      nodeId: 'results-p2',
      variablePath: 'model_metrics.false_positive_rate',
      expectedValue: 0.05,
      contextText: 'false positive rate increased to 0.05',
      claimId: 'CLM-003'
    }
  ],
  manifestDeltas: [
    { variablePath: 'model_metrics.false_positive_rate', oldValue: 0.05, newValue: 0.08 }
  ],
  findings: [
    {
      findingId: 'f-stale-fpr',
      blockId: 'results-p2',
      badgeType: 'DATA_DRIFT',
      category: 'EMPIRICAL_DATA_DISCREPANCY',
      auditorAgent: 'ReproducibilityReviewer',
      targetSpan: '0.05',
      explanation:
        'The manuscript reports a false positive rate of 0.05, but the latest DataAILab run reports 0.08.',
      replacementText: '0.08'
    }
  ],
  reviewFindings: [
    {
      id: 'rf-fpr',
      severity: 'critical',
      resolved: false,
      targetBlockId: 'results-p2',
      reviewerId: 'ReproducibilityReviewer',
      description: 'The manuscript reports a false positive rate of 0.05, but the latest run reports 0.08.'
    }
  ],
  citations: [
    {
      id: 'ref-lecun',
      text: 'LeCun, Bengio & Hinton (2015) Deep learning. Nature 521, 436–444',
      doi: '10.1038/nature14539'
    }
  ],
  figures: []
};

export const ALPOGE_RH_DOCUMENT: ComputableDocument = {
  id: '2026-11-alpoge-riemann-hypothesis',
  title:
    'Epistemic Opacity and the Mechanical Sublime: Empirical Verification of the Riemann Hypothesis in Lean 4 and Autonomous Epistemic Reconstruction',
  targetVenue: 'preprints',
  status: 'INCOMPLETE_DRAFT',
  isFinished: false,
  statusNotice: '⚠ MANUSCRITO INACABADO: Falta una pieza que el autor aportará más tarde. Bloqueado para publicación o asignación de DOI.',
  authors: [
    {
      name: 'CoResearcher Cognitive Systems Group & Theoretical Metascience Laboratory',
      affiliation: 'Autonomous Metascience & Verification Unit, Mac Studio Node'
    }
  ],
  blocks: [
    {
      id: 'abs-rh',
      kind: 'paragraph',
      semanticType: 'NarrativeBlock',
      segments: [
        {
          kind: 'text',
          text:
            'We present the end-to-end computational verification, deductive dependency audit, and epistemological deconstruction of Levent Alpöge\'s formal proof of the Riemann Hypothesis (RH) and Generalized Riemann Hypothesis (GRH) for Dirichlet L-functions, implemented in the Lean 4 proof assistant. The compilation was executed independently on a 24-core Apple M2 Ultra architecture with 128 GB of unified memory, requiring '
        },
        { kind: 'anchor', variablePath: 'mac_studio.wall_clock_seconds', display: '127,812 seconds (35.5 h)' },
        {
          kind: 'text',
          text:
            ' to process exactly '
        },
        { kind: 'anchor', variablePath: 'mac_studio.modules_compiled', display: '175,187 modules' },
        {
          kind: 'text',
          text:
            ' comprising 17,373,109 lines of formal code. Kernel axiomatic audit through #print axioms confirmed zero sorry occurrences under standard propext, Classical.choice, and Quot.sound.'
        }
      ]
    },
    {
      id: 'empirical-mac',
      kind: 'claim',
      semanticType: 'EmpiricalBlock',
      claimId: 'CLM-LEAN4-001',
      segments: [
        {
          kind: 'text',
          text:
            'Autonomous execution on Mac Studio reached peak resident set size of '
        },
        { kind: 'anchor', variablePath: 'mac_studio.memory_rss_gb', display: '94.2 GB RSS' },
        {
          kind: 'text',
          text:
            ', verifying all five root theorems with exit code 0 and zero uninstantiated axioms.'
        }
      ]
    },
    {
      id: 'topological-spine',
      kind: 'paragraph',
      semanticType: 'ProofBlock',
      segments: [
        {
          kind: 'text',
          text:
            'Topological dependency mining across 818,755 declarations and 43 strata uncovered a radical structural bottleneck at depth 6–7: UniformisationConclusion.lean exhibits a fan-in of '
        },
        { kind: 'anchor', variablePath: 'topological_dag.bottleneck_fan_in', display: '2,390 modules' },
        {
          kind: 'text',
          text:
            ' and '
        },
        { kind: 'anchor', variablePath: 'topological_dag.cross_layer_bypass_edges', display: '2,379 cross-layer bypass edges' },
        {
          kind: 'text',
          text:
            ', coupling birational toroidal compactification to adelic spectral positivity across the 6 barrier-breaking motifs (Adelic Trace Duality, SOS Positivity, Spectral Shift Invariance, Cohomological Parity, Automorphic Kernel Bound, Desingularization Bridge).'
        }
      ]
    },
    {
      id: 'epistemic-tension',
      kind: 'paragraph',
      semanticType: 'NarrativeBlock',
      segments: [
        {
          kind: 'text',
          text:
            'Juxtaposing Alpöge\'s opaque formal artifact (Epistemia Index '
        },
        { kind: 'anchor', variablePath: 'epistemia_index.alpoge', display: 'E_I = 0.885' },
        {
          kind: 'text',
          text:
            ') with Alessandro Masullo\'s 940-page human manuscript (Epistemia Index '
        },
        { kind: 'anchor', variablePath: 'epistemia_index.masullo', display: 'E_I = 0.340' },
        {
          kind: 'text',
          text:
            ') exposes the contemporary crisis where machine verification and biological comprehensibility diverge.'
        }
      ]
    },
    {
      id: 'pending-author-piece',
      kind: 'generated',
      semanticType: 'ProofBlock',
      segments: [
        {
          kind: 'text',
          text:
            '⚠ [PIEZA PENDIENTE DEL AUTOR]: Esta sección se encuentra deliberadamente incompleta a la espera de la pieza complementaria que aportará el autor en una fase posterior. La publicación y asignación de DOI permanecen pausadas.'
        }
      ],
      provenance: {
        model: 'Author-Hold-Signal',
        confidence: 1.0,
        contextHash: 'alpoge_pending_piece_hold',
        evidence: ['user_directive: incomplete_manuscript'],
        inference: 'Awaiting complementary mathematical piece before opening publication gates'
      }
    }
  ],
  anchors: [
    {
      nodeId: 'abs-rh',
      variablePath: 'mac_studio.wall_clock_seconds',
      expectedValue: 127812,
      contextText: '127,812 seconds (35.5 h)',
      claimId: 'CLM-LEAN4-001'
    },
    {
      nodeId: 'abs-rh',
      variablePath: 'mac_studio.modules_compiled',
      expectedValue: 175187,
      contextText: 'exactly 175,187 modules',
      claimId: 'CLM-LEAN4-001'
    },
    {
      nodeId: 'empirical-mac',
      variablePath: 'mac_studio.memory_rss_gb',
      expectedValue: 94.2,
      contextText: '94.2 GB RSS',
      claimId: 'CLM-LEAN4-001'
    },
    {
      nodeId: 'topological-spine',
      variablePath: 'topological_dag.bottleneck_fan_in',
      expectedValue: 2390,
      contextText: 'fan-in of 2,390 modules',
      claimId: 'CLM-TOPO-001'
    },
    {
      nodeId: 'topological-spine',
      variablePath: 'topological_dag.cross_layer_bypass_edges',
      expectedValue: 2379,
      contextText: '2,379 cross-layer bypass edges',
      claimId: 'CLM-TOPO-001'
    },
    {
      nodeId: 'epistemic-tension',
      variablePath: 'epistemia_index.alpoge',
      expectedValue: 0.885,
      contextText: 'E_I = 0.885',
      claimId: 'CLM-EPIST-001'
    },
    {
      nodeId: 'epistemic-tension',
      variablePath: 'epistemia_index.masullo',
      expectedValue: 0.340,
      contextText: 'E_I = 0.340',
      claimId: 'CLM-EPIST-001'
    }
  ],
  manifestDeltas: [],
  findings: [
    {
      findingId: 'f-author-incomplete-hold',
      blockId: 'pending-author-piece',
      badgeType: 'LOGICAL_GAP',
      category: 'MANUSCRIPT_INCOMPLETE_GATE',
      auditorAgent: 'Pre-Submission-Integrity-Gate',
      targetSpan: 'PIEZA PENDIENTE DEL AUTOR',
      explanation:
        'El autor ha marcado explícitamente este manuscrito como INACABADO. Falta una pieza fundamental que se integrará más tarde. Las puertas de publicación se mantienen bloqueadas.',
      replacementText:
        '⚠ [PIEZA PENDIENTE DEL AUTOR]: Sección en pausa hasta la recepción de la pieza matemática final.',
      falsificationChallenge:
        'Esperar la aportación del autor con la pieza complementaria antes de certificar el manuscrito.'
    }
  ],
  reviewFindings: [
    {
      id: 'rf-incomplete-piece',
      severity: 'critical',
      resolved: false,
      targetBlockId: 'pending-author-piece',
      reviewerId: 'Editorial-Oversight-Committee',
      description:
        'BLOCKING: Manuscrito marcado como inacabado por el autor. Falta la pieza complementaria.'
    }
  ],
  citations: [
    {
      id: 'ref-griffiths-2020',
      text: 'Lieder F, Griffiths TL. Resource-rational analysis: Understanding human cognition as the optimal use of bounded computational resources. Behav Brain Sci. 2020; 43:e1.',
      doi: '10.1017/s0140525x1900061x'
    },
    {
      id: 'ref-capraro-2025',
      text: 'Capraro V, et al. Epistemia: Measuring the epistemic quality and verifiability of human and machine scientific discourse. arXiv:2512.19466',
      doi: '10.48550/arXiv.2512.19466'
    }
  ],
  figures: []
};

export function getDocumentById(docId: string): ComputableDocument {
  if (docId === '2026-11-pseudo-lof-dementia' || docId.includes('dementia') || docId.includes('pseudo-lof')) {
    return DEMENTIA_5GENES_DOCUMENT;
  }
  if (docId === '2026-11-alpoge-riemann-hypothesis' || docId.includes('alpoge') || docId.includes('riemann')) {
    return ALPOGE_RH_DOCUMENT;
  }
  return DEFAULT_ALZHEIMER_TAU_DOCUMENT;
}
