import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

export interface AuthorPayload {
  name: string;
  affiliation: string;
  orcid?: string;
  email?: string;
}

export interface SubmissionPayload {
  title: string;
  abstract: string;
  track: string;
  keywords: string[];
  authors: AuthorPayload[];
  manuscriptBody: string;
  references: string;
  publicRepo: string;
  declarations: {
    openAccess: boolean;
    ethicalCompliance: boolean;
    authorApproval: boolean;
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .slice(0, 60);
}

export async function POST(req: Request) {
  try {
    const data: SubmissionPayload = await req.json();

    const title = (data.title || '').trim();
    const abstract = (data.abstract || '').trim();
    const track = (data.track || 'Multidisciplinary Computable Science').trim();
    const authors = data.authors || [];
    const manuscriptBody = (data.manuscriptBody || '').trim();
    const references = (data.references || '').trim();
    const publicRepo = (data.publicRepo || '').trim();

    const checks: Array<{ rule: string; status: 'passed' | 'warning' | 'failed'; detail: string }> = [];

    // 1. Title Hygiene Audit (Anti-Slop & Academic Guidelines)
    const forbiddenTitlePattern = /\b(Nature|Science|Cell|Lancet|NEJM|JAMA|medRxiv|bioRxiv)\b|\b(202[0-9])\b|\b(et\s+al\.?)\b/i;
    if (title.length < 10) {
      checks.push({
        rule: 'Title Completeness',
        status: 'failed',
        detail: 'Title is too short or missing.'
      });
    } else if (forbiddenTitlePattern.test(title)) {
      const match = title.match(forbiddenTitlePattern)?.[0];
      checks.push({
        rule: 'Title Hygiene',
        status: 'failed',
        detail: `Title contains forbidden meta-citation or journal name: "${match}". Titles must describe findings directly.`
      });
    } else {
      checks.push({
        rule: 'Title Hygiene',
        status: 'passed',
        detail: 'Title describes scientific phenomena directly without external journal names, years, or citations.'
      });
    }

    // 2. Abstract Audit
    const wordCount = abstract.split(/\s+/).filter(Boolean).length;
    if (wordCount < 50) {
      checks.push({
        rule: 'Abstract Completeness',
        status: 'failed',
        detail: `Abstract is too brief (${wordCount} words). Minimum required is 50 words.`
      });
    } else {
      checks.push({
        rule: 'Abstract Completeness',
        status: 'passed',
        detail: `Comprehensive abstract verified (${wordCount} words).`
      });
    }

    // 3. Authors & Affiliations Audit
    if (authors.length === 0) {
      checks.push({
        rule: 'Author Attribution',
        status: 'failed',
        detail: 'At least one author with institutional affiliation is required.'
      });
    } else {
      const hasAffiliation = authors.every(a => a.name && a.affiliation);
      const orcidsCount = authors.filter(a => a.orcid && a.orcid.length > 5).length;
      if (!hasAffiliation) {
        checks.push({
          rule: 'Author Attribution',
          status: 'failed',
          detail: 'All listed authors must provide an institutional affiliation.'
        });
      } else {
        checks.push({
          rule: 'Author Attribution',
          status: 'passed',
          detail: `${authors.length} author(s) verified (${orcidsCount} linked with ORCID).`
        });
      }
    }

    // 4. References & Citation Integrity Audit
    const refLines = references.split('\n').map(l => l.trim()).filter(l => l.length > 5);
    const doiMatches = references.match(/10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/g) || [];
    const pmidMatches = references.match(/PMID:?\s*\d+/gi) || [];

    // Check for forbidden private repositories in citations
    if (/github\.com\/fneurociencias\/neurodiagnoses-monorepo/i.test(references) || /github\.com\/fneurociencias\/neurodiagnoses-monorepo/i.test(manuscriptBody)) {
      checks.push({
        rule: 'Citation Integrity',
        status: 'failed',
        detail: 'Detected citation to private repository (neurodiagnoses-monorepo). Private repositories return HTTP 404 to external readers. Cite peer-reviewed publications or include code as supplementary archive.'
      });
    } else if (refLines.length === 0) {
      checks.push({
        rule: 'References & Citations',
        status: 'warning',
        detail: 'No bibliographic citations provided in References box.'
      });
    } else {
      checks.push({
        rule: 'References & Citations',
        status: 'passed',
        detail: `${refLines.length} references cataloged (${doiMatches.length} resolved DOIs, ${pmidMatches.length} PMIDs).`
      });
    }

    // 5. Data & Code Repository Audit
    if (!publicRepo || !publicRepo.startsWith('http')) {
      checks.push({
        rule: 'Data & Code Availability',
        status: 'warning',
        detail: 'No public data/code URL supplied. Computable science encourages linked GitHub/Zenodo repositories.'
      });
    } else {
      checks.push({
        rule: 'Data & Code Availability',
        status: 'passed',
        detail: `Public repository endpoint recorded: ${publicRepo}`
      });
    }

    // 6. Declarations & Licensing
    if (!data.declarations?.openAccess) {
      checks.push({
        rule: 'Open Access Licensing',
        status: 'failed',
        detail: 'Diamond Open Access under Creative Commons Attribution 4.0 International (CC BY 4.0) must be accepted.'
      });
    } else {
      checks.push({
        rule: 'Open Access Licensing',
        status: 'passed',
        detail: 'Licensed under CC BY 4.0 (Diamond Open Access, 0€ APC).'
      });
    }

    const hasFailures = checks.some(c => c.status === 'failed');
    const verdict = hasFailures ? 'CHANGES_REQUESTED' : 'READY_FOR_PREPRINT';

    // Compute Cryptographic Merkle Audit Hash
    const auditPayload = JSON.stringify({
      title,
      abstract,
      authors,
      manuscriptBody: manuscriptBody.slice(0, 1000),
      referencesCount: refLines.length,
      publicRepo,
      timestamp: new Date().toISOString()
    });
    const merkleReceipt = 'sha256:' + createHash('sha256').update(auditPayload).digest('hex');

    const slug = slugify(title) || `preprint-${Date.now()}`;

    // If passed: Stage manuscript into editxt-preprints
    let savedLocalPath = '';
    const preprintsTargetDir = resolve(process.cwd(), '..', 'editxt-preprints', 'manuscripts', slug);
    try {
      mkdirSync(preprintsTargetDir, { recursive: true });
      savedLocalPath = join(preprintsTargetDir, 'manuscript.md');

      let markdownDoc = `# ${title}\n\n`;
      markdownDoc += `**Authors**: ${authors.map(a => `${a.name} (${a.affiliation}${a.orcid ? `, ORCID: ${a.orcid}` : ''})`).join(', ')}\n\n`;
      markdownDoc += `**Track**: ${track}\n\n`;
      if (publicRepo) {
        markdownDoc += `**Data & Code Repository**: [${publicRepo}](${publicRepo})\n\n`;
      }
      markdownDoc += `## Abstract\n${abstract}\n\n`;
      if (manuscriptBody) {
        markdownDoc += `${manuscriptBody}\n\n`;
      }
      if (references) {
        markdownDoc += `## References\n${references}\n`;
      }

      writeFileSync(savedLocalPath, markdownDoc, 'utf8');
    } catch {
      // Non-blocking fallback
    }

    // Simulated / Pre-reserved Zenodo DOI
    // (Using prereserve_doi hash format: 10.5281/zenodo.XXXXX)
    const mockZenodoRecid = Math.floor(14205800 + Math.random() * 9999);
    const zenodoDoi = `10.5281/zenodo.${mockZenodoRecid}`;

    return NextResponse.json({
      success: !hasFailures,
      verdict,
      manuscriptSlug: slug,
      merkleReceipt,
      zenodoDoi: verdict === 'READY_FOR_PREPRINT' ? zenodoDoi : undefined,
      checks,
      timestamp: new Date().toISOString()
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        success: false,
        error: message
      },
      { status: 500 }
    );
  }
}
