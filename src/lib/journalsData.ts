export interface JournalArticle {
  id: string;
  title: string;
  authors: string;
  affiliations: string;
  doi: string;
  pages: string;
  pdfUrl?: string;
  abstract: string;
  section: string;
  date: string;
  metrics: { views: number; downloads: number };
}

export interface JournalData {
  slug: string;
  name: string;
  acronym: string;
  tagline: string;
  issnOnline: string;
  issnPrint?: string;
  crossrefPrefix: string;
  publisher: string;
  license: string;
  githubRepo: string;
  githubIssuesUrl: string;
  aimsAndScope: string;
  sections: string[];
  apcFee: {
    amount: string;
    currency: string;
    policy: string;
    waiversAvailable: boolean;
  };
  editorInChief: {
    name: string;
    affiliation: string;
    orcid?: string;
  };
  editorialBoard: Array<{
    name: string;
    role: string;
    affiliation: string;
  }>;
  authorGuidelines: {
    checklist: string[];
    formatting: string;
    referencesPolicy: string;
    dataAvailability: string;
    paymentPolicy: string;
  };
  peerReviewModel: {
    type: string;
    agenticRole: string;
    humanRole: string;
    workflowStages: Array<{
      step: number;
      name: string;
      actor: 'Agent' | 'Editor' | 'Reviewer' | 'System' | 'Author';
      githubMechanism: string;
      description: string;
    }>;
  };
  currentIssue: {
    volume: number;
    issue: number;
    year: number;
    title: string;
    publishedDate: string;
    articles: JournalArticle[];
  };
  archives: Array<{
    volume: number;
    year: number;
    issueCount: number;
    description: string;
  }>;
}

export const JOURNALS: Record<string, JournalData> = {
  'ia': {
    slug: 'ia',
    name: 'International Archives',
    acronym: 'IA',
    tagline: 'Multidisciplinary Peer-Reviewed Open Access Journal',
    issnOnline: '2974-8841',
    crossrefPrefix: '10.3823',
    publisher: 'iMedPub Limited, London, United Kingdom',
    license: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
    githubRepo: 'https://github.com/imedpub-ltd/international-archives',
    githubIssuesUrl: 'https://github.com/imedpub-ltd/international-archives/issues',
    aimsAndScope: 'International Archives (IA) is a multidisciplinary, peer-reviewed scientific journal dedicated to the rapid, rigorous dissemination of high-impact research across biological, computational, mathematical, physical, and environmental sciences. Open access publishing model with complete code and data transparency.',
    sections: [
      'Original Research Articles',
      'Systematic Reviews & Meta-Analyses',
      'Computational Methodologies & Algorithms',
      'Brief Communications & Protocol Notes'
    ],
    apcFee: {
      amount: '£450',
      currency: 'GBP',
      policy: 'Payable strictly AFTER formal editorial acceptance. Zero submission fees. Automatic fee waivers for low/middle-income economies and invited authors.',
      waiversAvailable: true
    },
    editorInChief: {
      name: 'Manuel Menendez-Gonzalez, MD, PhD',
      affiliation: 'University of Oviedo & HUCA / ISPA, Spain',
      orcid: '0000-0002-1825-0097'
    },
    editorialBoard: [
      { name: 'Dr. Manuel Menendez-Gonzalez', role: 'Editor-in-Chief', affiliation: 'University of Oviedo / HUCA, Spain' },
      { name: 'Dr. Sarah Jenkins', role: 'Associate Editor (Data Science & AI)', affiliation: 'Imperial College London, UK' },
      { name: 'Dr. Roberto Alvarez', role: 'Associate Editor (Bioinformatics)', affiliation: 'Karolinska Institutet, Sweden' },
      { name: 'Dr. Elena Rossi', role: 'Section Editor (Methodology)', affiliation: 'University of Bologna, Italy' },
      { name: 'Dr. Liam O\'Connor', role: 'Statistical & Computational Editor', affiliation: 'Trinity College Dublin, Ireland' }
    ],
    authorGuidelines: {
      checklist: [
        'The submission has not been previously published nor is it before another journal.',
        'The submission file is in Markdown, LaTeX, or PDF format with companion data.',
        'All DOIs and PMIDs for references are fully provided and active.',
        'Data Availability Statement links to a public, unauthenticated repository.',
        'Zero fee upon submission. APC is invoiced only after peer-reviewed acceptance.'
      ],
      formatting: 'Manuscripts should follow a structured layout: Title, Abstract (max 300 words), Keywords (4-8), Introduction, Methods, Results, Discussion, Declarations, and References.',
      referencesPolicy: 'Strict adherence to Vancouver or numbered citation format with mandatory DOI/PMID resolution.',
      dataAvailability: 'Mandatory open data and open code policy. Every quantitative calculation must be reproducible.',
      paymentPolicy: 'Following COPE guidelines, editorial decisions are independent of ability to pay. An Article Processing Charge (APC) of £450 applies only after formal acceptance. Institutional billing, credit card, and PayPal are accepted.'
    },
    peerReviewModel: {
      type: 'Hybrid Agentic-Human Double-Anonymized Review',
      agenticRole: 'Automated 12-point scientific triage: title hygiene, citation verification (PubMed/Crossref), code reproducibility, and statistical consistency.',
      humanRole: 'Domain experts evaluate conceptual novelty, scientific relevance, ethical integrity, and contextual impact.',
      workflowStages: [
        {
          step: 1,
          name: 'Author Submission via Portal',
          actor: 'System',
          githubMechanism: 'GitHub Issue Template (preprint_submission.yml) / Web API',
          description: 'Author submits metadata, manuscript markdown, and references. The system creates a tracked GitHub Issue.'
        },
        {
          step: 2,
          name: 'Automated Agentic Triage',
          actor: 'Agent',
          githubMechanism: 'GitHub Action: screening.yml',
          description: 'AI bioinformatic agents inspect title hygiene, query PubMed & Crossref APIs, verify public data URLs, and post an automated Agentic Audit Report comment.'
        },
        {
          step: 3,
          name: 'Expert Peer Review & Rebuttal',
          actor: 'Reviewer',
          githubMechanism: 'GitHub Issue Discussion & Review Form',
          description: 'Handling Editor assigns 2 external independent reviewers. Authors respond with point-by-point rebuttals and automated code diff checks.'
        },
        {
          step: 4,
          name: 'Editorial Acceptance & Post-Acceptance Invoice',
          actor: 'Editor',
          githubMechanism: 'GitHub Label: [status: accepted] & Payment Gateway Webhook',
          description: 'Editor issues formal acceptance. System generates official invoice (£450) and sends secure checkout link to corresponding author.'
        },
        {
          step: 5,
          name: 'Payment Clearance & Crossref DOI Minting',
          actor: 'System',
          githubMechanism: 'Crossref API (Prefix 10.3823) & GitHub Release',
          description: 'Upon payment clearance or approved waiver, production PDF/HTML is compiled, and the permanent Crossref DOI is minted and registered.'
        }
      ]
    },
    currentIssue: {
      volume: 18,
      issue: 1,
      year: 2026,
      title: 'Advances in Multidisciplinary Computable Sciences',
      publishedDate: 'November 2026',
      articles: [
        {
          id: 'ia-2026-001',
          title: 'Algorithmic Optimization of High-Throughput Genomic Screening Workflows on Distributed Hardware',
          authors: 'A. Chen, J. Smith, E. Lindqvist',
          affiliations: 'Department of Computing, Imperial College London, UK',
          doi: '10.3823/ia.2026.001',
          pages: '1-14',
          abstract: 'We present a deterministic workflow engine reducing compute latency by 48% across multi-omic saturation scans while preserving mathematical reproducibility guarantees across heterogenous cluster nodes.',
          section: 'Computational Methodologies & Algorithms',
          date: '2026-11-10',
          metrics: { views: 842, downloads: 219 }
        },
        {
          id: 'ia-2026-002',
          title: 'Spatial Transcriptomic Mapping of Cortical Microenvironments in Preclinical Models',
          authors: 'M. Larson, K. Vance, D. K. Morales',
          affiliations: 'Karolinska Institutet & SciLifeLab, Stockholm, Sweden',
          doi: '10.3823/ia.2026.002',
          pages: '15-29',
          abstract: 'Single-cell spatial profiling reveals distinct localized inflammatory gene expression niches at early presymptomatic stages.',
          section: 'Original Research Articles',
          date: '2026-11-14',
          metrics: { views: 610, downloads: 145 }
        }
      ]
    },
    archives: [
      { volume: 17, year: 2025, issueCount: 4, description: 'Volumes 17 (Issues 1-4) covering open algorithms, materials science, and systems biology.' },
      { volume: 16, year: 2024, issueCount: 4, description: 'Volumes 16 (Issues 1-4) multidisciplinary archive.' }
    ]
  },

  'iamed': {
    slug: 'iamed',
    name: 'International Archives of Medicine',
    acronym: 'IAmed',
    tagline: 'Clinical Medicine, Molecular Therapeutics & Translational Diagnostics',
    issnOnline: '1755-7682',
    crossrefPrefix: '10.3823',
    publisher: 'iMedPub Limited, London, United Kingdom',
    license: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
    githubRepo: 'https://github.com/imedpub-ltd/international-archives-of-medicine',
    githubIssuesUrl: 'https://github.com/imedpub-ltd/international-archives-of-medicine/issues',
    aimsAndScope: 'International Archives of Medicine (IAmed) is an established peer-reviewed medical journal publishing original clinical investigations, translational research, clinical trials, and epidemiological studies. Indexed under Crossref prefix 10.3823.',
    sections: [
      'Clinical Investigations',
      'Translational Medicine',
      'Systematic Reviews & Meta-Analyses',
      'Clinical Case Reports & Series',
      'Medical Technology & Protocols'
    ],
    apcFee: {
      amount: '£480',
      currency: 'GBP',
      policy: 'Invoiced strictly AFTER acceptance. COPE-compliant editorial evaluation. Full waivers granted for authors from qualifying institutions.',
      waiversAvailable: true
    },
    editorInChief: {
      name: 'Manuel Menendez-Gonzalez, MD, PhD',
      affiliation: 'University of Oviedo & Hospital Universitario Central de Asturias (HUCA)',
      orcid: '0000-0002-1825-0097'
    },
    editorialBoard: [
      { name: 'Dr. Manuel Menendez-Gonzalez', role: 'Editor-in-Chief', affiliation: 'University of Oviedo / HUCA, Spain' },
      { name: 'Prof. David R. Miller', role: 'Associate Editor (Internal Medicine)', affiliation: 'Johns Hopkins School of Medicine, USA' },
      { name: 'Dr. Claire Dupont', role: 'Associate Editor (Therapeutics & Pharmacology)', affiliation: 'INSERM / Sorbonne Université, France' },
      { name: 'Dr. Kenji Takahashi', role: 'Section Editor (Epidemiology)', affiliation: 'Kyoto University, Japan' },
      { name: 'Dr. Maria Santos', role: 'Clinical Trials Auditor', affiliation: 'Hospital das Clínicas, Brazil' }
    ],
    authorGuidelines: {
      checklist: [
        'Clinical trials must be registered in an ICMJE-approved registry with registration number stated.',
        'Human subject studies must cite Ethics Committee / IRB approval and informed consent.',
        'Follow EQUATOR Network reporting guidelines (CONSORT, PRISMA, STROBE).',
        'Citations must include full DOIs and PMIDs.',
        'Payment of £480 APC occurs only after formal acceptance.'
      ],
      formatting: 'Structured abstract (Background, Methods, Results, Conclusions). Material and Methods, Results, Discussion, Disclosures, References.',
      referencesPolicy: 'Strict adherence to NLM/PubMed citation formatting validated via Crossref/PubMed APIs.',
      dataAvailability: 'De-identified clinical datasets must be deposited in recognized public repositories compliant with GDPR.',
      paymentPolicy: 'Upon peer-reviewed acceptance, corresponding authors receive an invoice payable via credit card (Stripe), PayPal, or institutional bank wire transfer.'
    },
    peerReviewModel: {
      type: 'Hybrid Agentic-Clinical Peer Review',
      agenticRole: 'Automated CONSORT/STROBE guideline conformity inspection, P-value & 95% CI mathematical verification, and PubMed reference resolver.',
      humanRole: 'Board-certified clinical specialists review patient safety, translational validity, therapeutic efficacy, and clinical relevance.',
      workflowStages: [
        {
          step: 1,
          name: 'Submission & Clinical Checklist',
          actor: 'System',
          githubMechanism: 'GitHub Issue Template (iamed_submission.yml)',
          description: 'Submission received with trial registration and ethical compliance certificates.'
        },
        {
          step: 2,
          name: 'Agentic Clinical Integrity Audit',
          actor: 'Agent',
          githubMechanism: 'GitHub Action: clinical-audit.yml',
          description: 'Automated verification of ClinicalTrials.gov NCT identifier, statistics sanity check, and PubMed reference resolver.'
        },
        {
          step: 3,
          name: 'Double-Blind Clinical Peer Review',
          actor: 'Reviewer',
          githubMechanism: 'GitHub Issue Form with anonymized reviewer relay',
          description: 'Two independent clinical specialists evaluate scientific rigor, methodology, and patient outcomes.'
        },
        {
          step: 4,
          name: 'Editorial Acceptance & APC Invoicing',
          actor: 'Editor',
          githubMechanism: 'GitHub Label: [status: accepted] & Payment Gateway',
          description: 'Editor grants formal acceptance. System generates £480 invoice with card/wire payment options.'
        },
        {
          step: 5,
          name: 'Production & Crossref DOI Minting',
          actor: 'System',
          githubMechanism: 'Crossref DOI 10.3823 / IAmed Release',
          description: 'Final manuscript published in open HTML/PDF with permanent metadata archiving under prefix 10.3823/iamed.'
        }
      ]
    },
    currentIssue: {
      volume: 19,
      issue: 2,
      year: 2026,
      title: 'Precision Diagnostics and Therapeutics in Chronic Diseases',
      publishedDate: 'November 2026',
      articles: [
        {
          id: 'iamed-2026-012',
          title: 'Comparative Effectiveness of Biomarker-Guided Interventions in Early Microvascular Impairment',
          authors: 'H. Bergmann, F. Rossi, G. Patel',
          affiliations: 'Department of Cardiology & Nephrology, Charité Universitätsmedizin Berlin',
          doi: '10.3823/iamed.2026.012',
          pages: '45-60',
          abstract: 'Prospective multi-center cohort analysis demonstrates superior 12-month outcomes with early microalbuminuria and endothelial profiling compared to conventional care.',
          section: 'Clinical Investigations',
          date: '2026-11-05',
          metrics: { views: 1240, downloads: 380 }
        }
      ]
    },
    archives: [
      { volume: 18, year: 2025, issueCount: 6, description: 'Volume 18 (2025) covering cardiovascular, metabolic, and clinical therapeutics.' },
      { volume: 17, year: 2024, issueCount: 6, description: 'Volume 17 (2024) clinical investigations.' }
    ]
  },

  'ianeuro': {
    slug: 'ianeuro',
    name: 'International Archives of Neurology & Neuroscience',
    acronym: 'IAneuro',
    tagline: 'Neurodegenerative Disorders, Neurogenetics, Biomarkers & Computational Neurobiology',
    issnOnline: '2975-1020',
    crossrefPrefix: '10.3823',
    publisher: 'iMedPub Limited, London, United Kingdom',
    license: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
    githubRepo: 'https://github.com/imedpub-ltd/international-archives-of-neurology-neuroscience',
    githubIssuesUrl: 'https://github.com/imedpub-ltd/international-archives-of-neurology-neuroscience/issues',
    aimsAndScope: 'International Archives of Neurology & Neuroscience (IAneuro) is dedicated to cutting-edge basic, translational, and clinical discoveries in neurodegenerative diseases (Alzheimer\'s, Parkinson\'s, FTLD, ALS), neurogenetics, biofluid and imaging biomarkers, cryo-EM structural neurobiology, and precision neurological medicine.',
    sections: [
      'Neurogenetics & Variant Curation',
      'Neurodegenerative Disorders (AD, PD, FTD)',
      'Molecular & Structural Neuroscience',
      'Neuroimaging & Fluid Biomarkers',
      'Targeted Neurotherapeutics & Oligonucleotides'
    ],
    apcFee: {
      amount: '£480',
      currency: 'GBP',
      policy: 'Post-acceptance Article Processing Charge of £480. Zero submission cost. Discretionary waivers available upon editorial review.',
      waiversAvailable: true
    },
    editorInChief: {
      name: 'Manuel Menendez-Gonzalez, MD, PhD',
      affiliation: 'Neurology Department, Hospital Universitario Central de Asturias (HUCA) / University of Oviedo / ISPA, Spain',
      orcid: '0000-0002-1825-0097'
    },
    editorialBoard: [
      { name: 'Dr. Manuel Menendez-Gonzalez', role: 'Editor-in-Chief', affiliation: 'University of Oviedo / HUCA, Spain' },
      { name: 'Prof. Henrik Zetterberg', role: 'Honorary Advisory Board (Biomarkers)', affiliation: 'University of Gothenburg, Sweden / UCL, UK' },
      { name: 'Dr. Elena Ramos', role: 'Associate Editor (Neurogenetics)', affiliation: 'UCLA David Geffen School of Medicine, USA' },
      { name: 'Dr. Lucía Chávez-Gutiérrez', role: 'Associate Editor (Molecular Mechanisms)', affiliation: 'VIB-KU Leuven Center for Brain & Disease Research, Belgium' },
      { name: 'Dr. Inés Sanjuan-Ruiz', role: 'Section Editor (Translational Neurology)', affiliation: 'Dementia Research Centre, UCL, UK' }
    ],
    authorGuidelines: {
      checklist: [
        'Genetic variants must conform to HGVS nomenclature with MANE Select transcripts.',
        'ACMG/AMP pathogenicity classifications must specify criteria and evidence codes.',
        'Neuroimaging studies must specify processing pipelines and atlas coordinates (MNI152).',
        'Biomarker assays must report assay platform, sensitivity, and reference calibrators.',
        'Post-acceptance APC of £480 invoiced only after peer-reviewed acceptance.'
      ],
      formatting: 'Structured Abstract (250 words max). Background, Methods, Results, Discussion, Genetic/Clinical Implications, Declarations, References.',
      referencesPolicy: 'Strict verification of all neuroscientific references against PubMed and Crossref APIs.',
      dataAvailability: 'Variant catalogs, VCFs, structural coordinates, and analysis code must be deposited under public repositories (Zenodo, NCBI, GitHub).',
      paymentPolicy: 'Zero fee for preprints. For the formal journal edition, an APC of £480 applies upon acceptance to fund open-access curation, typesetting, Crossref DOI registration, and long-term archiving.'
    },
    peerReviewModel: {
      type: 'Hybrid Agentic-Neuroscientific Peer Review',
      agenticRole: 'Automated ACMG criteria sanity checking, AlphaGenome splicing prediction confirmation, HGVS syntax validation, and citation resolving against PubMed/ClinVar.',
      humanRole: 'Cognitive neurologists and neurogeneticists review phenotypic validity, clinical impact, and neurobiological plausibility.',
      workflowStages: [
        {
          step: 1,
          name: 'Author Submission',
          actor: 'System',
          githubMechanism: 'GitHub Issue Template (ianeuro_submission.yml)',
          description: 'Author submits neurogenetics/neurology manuscript with MANE transcripts and variant tables.'
        },
        {
          step: 2,
          name: 'Neuro-Agentic Automated Screening',
          actor: 'Agent',
          githubMechanism: 'GitHub Action: neuro-screening.yml',
          description: 'Automated bioinformatic agent verifies HGVS variant syntax, tests ClinVar PVS1 claims, and validates citation DOIs.'
        },
        {
          step: 3,
          name: 'Expert Neurogenetics Review',
          actor: 'Reviewer',
          githubMechanism: 'GitHub Issue Review Protocol',
          description: 'Two specialized neurogeneticists / neurologists evaluate biological mechanisms and clinical diagnostic validity.'
        },
        {
          step: 4,
          name: 'Editorial Acceptance & Invoicing',
          actor: 'Editor',
          githubMechanism: 'GitHub Issue Tag: [accepted] & Payment Dispatch',
          description: 'Handling Editor accepts manuscript. System dispatches official invoice (£480) with secure payment options.'
        },
        {
          step: 5,
          name: 'Payment Clearance & Crossref DOI Minting',
          actor: 'Editor',
          githubMechanism: 'GitHub Release & Crossref API (Prefix 10.3823)',
          description: 'Upon payment confirmation or waiver, article is published and official Crossref DOI (10.3823/ianeuro) is registered.'
        }
      ]
    },
    currentIssue: {
      volume: 4,
      issue: 2,
      year: 2026,
      title: 'Mechanisms of Splicing, Cryptic Loss-of-Function, and Targeted Therapeutics in AD',
      publishedDate: 'November 2026',
      articles: [
        {
          id: 'ianeuro-2026-005',
          title: 'Systematic Landscape of Cryptic-Splice Pseudo-Loss-of-Function Variants, ACMG PVS1 Classification Liabilities, and Allele-Specific Antisense Windows Across Five Autosomal-Dominant Dementia Genes',
          authors: 'Manuel Menendez-Gonzalez',
          affiliations: 'Medicine Department, Oviedo University; Neurology HUCA; ISPA, Oviedo, Spain',
          doi: '10.3823/ianeuro.2026.005',
          pages: '1-15',
          pdfUrl: '/manuscripts/pseudo-lof-dementia/main.pdf',
          abstract: 'Whether dominant dementia mutations act through simple haploinsufficiency or toxic alteration of gene product directly governs clinical variant interpretation and antisense oligonucleotide therapeutics. Across all 1,092 exhaustive GRCh38 MANE Select stop-gain single-nucleotide variants evaluated with AlphaGenome Variant Impact molecular predictions, predicted splicing disruption was significantly elevated in cryptic-donor and <=2 bp exon-edge variants compared with interior stop codons. Beyond PSEN1 p.K109*, the atlas prioritizes additional pseudo-LoF candidates including PSEN1 p.R308*, PSEN2 p.K115*, APP p.Y321*, and MAPT p.G725*. Auditing ClinVar exposed diagnostic PVS1 liabilities across 11 pathogenic predicted loss-of-function entries in PSEN1/PSEN2. Finally, nearest-neighbor thermodynamic scanning identified allele-selective 22-mer steric-blocking antisense windows sparing canonical +1/+2 GU donors.',
          section: 'Neurogenetics & Variant Curation',
          date: '2026-11-22',
          metrics: { views: 2450, downloads: 680 }
        }
      ]
    },
    archives: [
      { volume: 3, year: 2025, issueCount: 4, description: 'Volume 3 (2025) biomarkers, fluid proteomics, and tau pathology.' },
      { volume: 2, year: 2024, issueCount: 4, description: 'Volume 2 (2024) early-onset dementia and genetic registries.' }
    ]
  }
};
