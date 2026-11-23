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
    'Independent Formal Verification, Epistemic Spine Cartography, and Comparative Auditing of Riemann Hypothesis Proof Claims',
  targetVenue: 'preprints',
  status: 'CERTIFIED_PREPRINT',
  isFinished: true,
  statusNotice: '✓ PREPRINT CERTIFICADO v1.1 (DRY RUN): Compilación limpia en Apple M4 Max (127.812s) + replay transitivo lake env leanchecker --fresh Main (26.898s, exit_code=0, mkEmptyEnvironment) y explorador D3 integrados.',
  authors: [
    {
      name: 'Manuel Menéndez-González',
      affiliation: 'Fundación de Neurociencias, Oviedo, Spain',
      orcid: '0000-0002-1825-0097'
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
            'We present the independent formal verification, transitive fresh-environment replay, deductive dependency mapping, and epistemological evaluation of Levent Alpöge\'s formal proof of the Riemann Hypothesis (RH) and Generalized Riemann Hypothesis (GRH) for Dirichlet L-functions in Lean 4. Clean compilation on an Apple M4 Max (16-core ARM64, 64 GB unified memory, 98 GB build footprint) took '
        },
        { kind: 'anchor', variablePath: 'mac_studio.wall_clock_seconds', display: '127,812 seconds (35.5 h)' },
        {
          kind: 'text',
          text:
            ' to compile '
        },
        { kind: 'anchor', variablePath: 'mac_studio.modules_compiled', display: '175,187 modules' },
        {
          kind: 'text',
          text:
            ' with exit code 0. Kernel axiomatic audit through #print axioms confirmed zero sorry statements under propext, Classical.choice, and Quot.sound across a 28-line statement TCB.'
        }
      ]
    },
    {
      id: 'dual-cert',
      kind: 'claim',
      semanticType: 'EmpiricalBlock',
      claimId: 'CLM-LEANCHECK-001',
      segments: [
        {
          kind: 'text',
          text:
            'Transitive fresh-environment replay via lake env leanchecker --fresh Main completed cleanly from mkEmptyEnvironment in '
        },
        { kind: 'anchor', variablePath: 'mac_studio.leanchecker_fresh_seconds', display: '26,898 seconds (7 h 28 min 18 s)' },
        {
          kind: 'text',
          text:
            ' (exit_code = 0, log SHA-256 ff8ea3d0...) across all '
        },
        { kind: 'anchor', variablePath: 'mac_studio.olean_binaries_count', display: '183,889 .olean binaries' },
        {
          kind: 'text',
          text:
            ', ruling out .olean corruption, environment hacking, and metaprogramming bypasses under Lean v4.33.1. Only an independent external Rust second kernel (nanoda / lean4export stalled at 46.47 GB on 64 GB RAM) remains open locally.'
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
            'Independent clean compilation on Apple M4 Max (16-core ARM64, 64 GB unified memory) produced a '
        },
        { kind: 'anchor', variablePath: 'mac_studio.build_footprint_gb', display: '98 GB .lake/build footprint' },
        {
          kind: 'text',
          text:
            ', certifying all 5 root theorems with exit code 0 and zero custom axioms.'
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
            'Deductive DAG cartography across 818,755 declarations and 43 strata reveals an acute structural bottleneck at depth 6–7: UniformisationConclusion.lean exhibits a fan-in of '
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
            ', orchestrating 6 fundamental mathematical motifs: Galois patching (109,260 decls), Unitary theta lifts (15,750 decls), Bost slope & Iwasawa towers (13,010 decls), GGP & Bessel positivity (7,011 decls), Siegel mass & Chowla-Selberg (4,618 decls), and Stepanov determinants (1,808 decls).'
        }
      ]
    },
    {
      id: 'rh-meaning-necessity',
      kind: 'paragraph',
      semanticType: 'NarrativeBlock',
      segments: [
        {
          kind: 'text',
          text:
            'Rather than asserting "perfect randomness," RH establishes optimal deterministic cancellation between additive stepping (+1) and multiplicative block-packing: π(x) = Li(x) + O(√x log x), with Montgomery–Odlyzko GUE level repulsion forbidding large-scale oscillatory bias. Separating unbounded arithmetic law (the medium) from finite physical instantiation bounds (Planck scale floor; ~10^120 ops on ~10^90 bits, Lloyd 2002; cosmic horizon entropy ~2.6×10^122 k_B) clarifies why asymptotic proof still matters: finite checks alone miss scale-crossing phenomena such as Littlewood\'s sign reversal of π(x) − li(x) bounded near '
        },
        { kind: 'anchor', variablePath: 'arithmetic_bounds.skewes_upper_bound', display: '1.397 × 10^316' },
        {
          kind: 'text',
          text:
            '. Thus critical-line alignment reflects pure combinatorial and structural necessity rather than physical fine-tuning.'
        }
      ]
    },
    {
      id: 'formal-trust-anatomy',
      kind: 'claim',
      semanticType: 'ProofBlock',
      claimId: 'CLM-TCB-001',
      segments: [
        {
          kind: 'text',
          text:
            'To make formal verification transparent to non-Lean readers, our Anatomy of Formal Trust isolates the four possible failure vectors (specification hacking including 1/0 = 0 total division, proof skipping/axiom smuggling, single-kernel bugs, and prose scope inflation). Humans need only inspect the '
        },
        { kind: 'anchor', variablePath: 'tcb.external_statement_lines', display: '28-line external TCB' },
        {
          kind: 'text',
          text:
            ' (R_TCB = 1.62 × 10^-6). Metamathematically, discharging all five Π_1^0-equivalent root theorems strictly over [propext, Classical.choice, Quot.sound] confirms that standard mathematical foundations suffice deductively without exotic axioms.'
        }
      ]
    },
    {
      id: 'opacity-reduction',
      kind: 'paragraph',
      semanticType: 'ProofBlock',
      segments: [
        {
          kind: 'text',
          text:
            'Echoing Thurston (1994) and Griffiths (2026), kernel certification completes only Phase 1; Phase 2 is cognitive distillation. We deliver open interactive instruments: the D3 Epistemic Spine Explorer (epistemic_spine_explorer.html) mapping all 6 motifs and 11 libraries, and the Three-Level Mathematical Architecture Primer (mathematical_architecture_primer.md) bridging classical Chebyshev–Stepanov divisibility to iterated unitary theta lifts.'
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
            'Comparative epistemic auditing highlights divergent verification pathways: Alpöge\'s root formal theorems yield an Epistemia risk score of '
        },
        { kind: 'anchor', variablePath: 'epistemia_index.alpoge', display: 'E_I = 0.245 (VALID_OPAQUE)' },
        {
          kind: 'text',
          text:
            ' (0.4075 when bundled with unformalized ERH), whereas Alessandro Masullo\'s 940-page informal manuscript yields an Epistemia risk score of '
        },
        { kind: 'anchor', variablePath: 'epistemia_index.masullo', display: 'E_I = 0.850 (SUSPEND_JUDGMENT)' },
        {
          kind: 'text',
          text:
            ' due to 19 broken references and incomplete critical sections in Chapter 13.'
        }
      ]
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
      contextText: 'compile 175,187 modules',
      claimId: 'CLM-LEAN4-001'
    },
    {
      nodeId: 'dual-cert',
      variablePath: 'mac_studio.leanchecker_fresh_seconds',
      expectedValue: 26898,
      contextText: '26,898 seconds (7 h 28 min 18 s)',
      claimId: 'CLM-LEANCHECK-001'
    },
    {
      nodeId: 'dual-cert',
      variablePath: 'mac_studio.olean_binaries_count',
      expectedValue: 183889,
      contextText: '183,889 .olean binaries',
      claimId: 'CLM-LEANCHECK-001'
    },
    {
      nodeId: 'empirical-mac',
      variablePath: 'mac_studio.build_footprint_gb',
      expectedValue: 98,
      contextText: '98 GB .lake/build footprint',
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
      expectedValue: 0.245,
      contextText: 'E_I = 0.245 (VALID_OPAQUE)',
      claimId: 'CLM-EPIST-001'
    },
    {
      nodeId: 'epistemic-tension',
      variablePath: 'epistemia_index.masullo',
      expectedValue: 0.850,
      contextText: 'E_I = 0.850 (SUSPEND_JUDGMENT)',
      claimId: 'CLM-EPIST-001'
    },
    {
      nodeId: 'rh-meaning-necessity',
      variablePath: 'arithmetic_bounds.skewes_upper_bound',
      expectedValue: '1.397e316',
      contextText: '1.397 × 10^316',
      claimId: 'CLM-ARITH-001'
    },
    {
      nodeId: 'formal-trust-anatomy',
      variablePath: 'tcb.external_statement_lines',
      expectedValue: 28,
      contextText: '28-line external TCB',
      claimId: 'CLM-TCB-001'
    }
  ],
  manifestDeltas: [],
  findings: [
    {
      findingId: 'f-verified-fresh-replay',
      blockId: 'dual-cert',
      badgeType: 'CITATION_WARNING',
      category: 'KERNEL_FRESH_REPLAY_GATE_V1_1',
      auditorAgent: 'Leanchecker-Fresh-Replay-Auditor',
      targetSpan: '26,898 seconds (7 h 28 min 18 s)',
      explanation:
        'KERNEL_CHECKED_AND_FRESH_REPLAYED_V4_33_1: lake env leanchecker --fresh Main completed with exit_code=0 from mkEmptyEnvironment (SHA-256 ff8ea3d0...), ruling out .olean corruption and environment hacking. External Rust kernel (nanoda) remains open locally due to 46.47 GB export memory ceiling on 64 GB RAM.',
      replacementText: 'Transitive fresh replay confirmed (26,898s, exit_code=0); external Rust second kernel noted as local 64 GB hardware limit.'
    }
  ],
  reviewFindings: [
    {
      id: 'rf-fresh-replay-v1-1',
      severity: 'minor',
      resolved: true,
      targetBlockId: 'dual-cert',
      reviewerId: 'Editorial-Oversight-Committee',
      description:
        'v1.1 certificate verified: lake build Main (127,812s) + lake env leanchecker --fresh Main (26,898s, exit_code=0, SHA-256 ff8ea3d0...) passed. External nanoda 64 GB boundary transparently documented.'
    }
  ],
  citations: [
    {
      id: 'ref-vonkoch-1901',
      text: 'von Koch H. Sur la distribution des nombres premiers. Acta Mathematica. 1901; 24:159-182.',
      doi: '10.1007/BF02403071'
    },
    {
      id: 'ref-montgomery-1973',
      text: 'Montgomery HL. The pair correlation of zeros of the zeta function. Proc Symp Pure Math. 1973; 24:181-193.',
      doi: '10.1090/pspum/024/9944'
    },
    {
      id: 'ref-odlyzko-1987',
      text: 'Odlyzko AM. On the distribution of spacings between zeros of the zeta function. Math Comp. 1987; 48(177):273-308.',
      doi: '10.1090/S0025-5718-1987-0866115-0'
    },
    {
      id: 'ref-thurston-1994',
      text: 'Thurston WP. On proof and progress in mathematics. Bull Amer Math Soc. 1994; 30(2):161-177.',
      doi: '10.1090/S0273-0979-1994-00502-6'
    },
    {
      id: 'ref-lagarias-2002',
      text: 'Lagarias JC. An elementary problem equivalent to the Riemann hypothesis. Amer Math Monthly. 2002; 109(6):534-543.',
      doi: '10.2307/2695443'
    },
    {
      id: 'ref-lloyd-2002',
      text: 'Lloyd S. Computational capacity of the universe. Phys Rev Lett. 2002; 88(23):237901.',
      doi: '10.1103/PhysRevLett.88.237901'
    },
    {
      id: 'ref-saouter-2015',
      text: 'Saouter Y, Trudgian T, Demichel P. A still sharper region where π(x) − li(x) is positive. Math Comp. 2015; 84(295):2433-2446.',
      doi: '10.1090/S0025-5718-2015-02930-5'
    },
    {
      id: 'ref-capraro-2025',
      text: 'Quattrociocchi W, Capraro V, Perc M. Epistemological Fault Lines Between Human and Artificial Intelligence. arXiv:2512.19466.',
      doi: '10.48550/arXiv.2512.19466'
    }
  ],
  figures: [
    {
      id: 'fig-spine-explorer',
      title: 'Interactive D3 Epistemic Spine Explorer (6 Motifs & 11 Libraries)',
      file: 'epistemic_spine_explorer.html',
      dpi: 300
    },
    {
      id: 'fig-math-primer',
      title: 'Mathematical Architecture Primer (Unitary Shimura Varieties & Positivity)',
      file: 'mathematical_architecture_primer.md',
      dpi: 300
    },
    {
      id: 'fig-comparative-audit',
      title: 'Comparative Epistemic Audit (Alpöge vs. Masullo)',
      file: 'comparative_audit_alpoge_vs_masullo.md',
      dpi: 300
    }
  ]
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
