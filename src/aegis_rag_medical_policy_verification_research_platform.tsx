import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  FileText,
  Users,
  Scale,
  Activity,
  History,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Sliders,
  Play,
  Sparkles,
  Search,
  GitCompare,
  Lock,
  Eye,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  Info,
  Layers,
  Cpu,
  UserCheck,
  BookOpen,
  Zap,
  Filter,
  ArrowRight,
  Terminal,
  Award,
  AlertOctagon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ReferenceLine
} from 'recharts';

// ============================================================================
// 1. IMMUTABLE VERSIONED POLICY CORPUS (HealthShield Gold v2.4 & v3.0)
// ============================================================================
const POLICY_VERSIONS = [
  {
    policy_id: 'POL-HSG-001',
    name: 'HealthShield Gold Comprehensive',
    version: 'v2.4 (2025)',
    jurisdiction: 'IN-IRDAI-STD',
    effective_from: '2025-01-01',
    effective_to: '2025-12-31',
    source_hash: 'sha256:8f94e2c1a7b309d4e5f6120987ab34cd',
    approval_status: 'APPROVED_IMMUTABLE'
  },
  {
    policy_id: 'POL-HSG-001',
    name: 'HealthShield Gold Comprehensive',
    version: 'v3.0 (2026)',
    jurisdiction: 'IN-IRDAI-STD',
    effective_from: '2026-01-01',
    effective_to: '2026-12-31',
    source_hash: 'sha256:3c71b9e04d2a881f6e0945cd2189fa02',
    approval_status: 'APPROVED_IMMUTABLE'
  }
];

const POLICY_CLAUSES = [
  // v2.4 Clauses
  {
    clause_id: 'CL-101',
    policy_version: 'v2.4 (2025)',
    section: 'Sec 2.1 — Inpatient Hospitalization',
    page: 4,
    clause_type: 'Inclusion',
    text: 'Inpatient hospitalization expenses exceeding 24 consecutive hours for medically necessary surgical or medical treatment are covered up to the Base Sum Insured ($50,000), including room rent, nursing, ICU charges, and surgeon fees.',
    keywords: ['inpatient', 'hospitalization', 'surgery', 'appendectomy', 'stent', 'cardiac', 'icu']
  },
  {
    clause_id: 'CL-204',
    policy_version: 'v2.4 (2025)',
    section: 'Sec 4.2 — Pre-Existing Disease (PED) Waiting Period',
    page: 11,
    clause_type: 'Waiting Period',
    text: 'Expenses related to the treatment of a Pre-Existing Disease (PED) and its direct complications shall be excluded until the expiry of 24 months of continuous coverage from the date of inception of the first policy.',
    keywords: ['pre-existing', 'hypertension', 'cardiac', 'stent', 'coronary', 'waiting period', '24 months']
  },
  {
    clause_id: 'CL-209',
    policy_version: 'v2.4 (2025)',
    section: 'Sec 4.5 — Specific Named Ailment Waiting Period',
    page: 12,
    clause_type: 'Waiting Period',
    text: 'A 12-month waiting period applies to elective hernia, cataract, and benign prostatic hypertrophy. Acute emergency surgeries including acute appendicitis are exempt from initial waiting periods after 30 days.',
    keywords: ['appendectomy', 'appendicitis', 'acute', 'emergency', 'waiting period', '30 days']
  },
  {
    clause_id: 'CL-312',
    policy_version: 'v2.4 (2025)',
    section: 'Sec 5.4 — Cardiovascular Implant Sub-Limit',
    page: 16,
    clause_type: 'Sub-Limit',
    text: 'Drug-eluting coronary stents (DES) are covered up to the National Pharmaceutical Pricing Authority (NPPA) ceiling price per stent, maximum 2 stents per hospitalization event.',
    keywords: ['stent', 'cardiac', 'coronary', 'sub-limit', 'des', 'angioplasty']
  },
  {
    clause_id: 'CL-408',
    policy_version: 'v2.4 (2025)',
    section: 'Sec 6.8 — Unproven & Experimental Therapies',
    page: 21,
    clause_type: 'Exclusion',
    text: 'Any treatment, procedure, or pharmacological agent classified as investigational, experimental, or lacking Phase III FDA/CDSCO approval for the specific ICD-10 indication is strictly excluded.',
    keywords: ['experimental', 'immunotherapy', 'investigational', 'phase', 'unproven', 'outpatient']
  },
  {
    clause_id: 'CL-502',
    policy_version: 'v2.4 (2025)',
    section: 'Sec 7.1 — Outpatient (OPD) Infusions',
    page: 24,
    clause_type: 'Exclusion',
    text: 'Outpatient department (OPD) consultations and day-care biologic infusions not listed in Annexure-II Day-Care Procedures are excluded unless covered under an active OPD Rider.',
    keywords: ['outpatient', 'opd', 'infusion', 'immunotherapy', 'day-care']
  },
  {
    clause_id: 'CL-601',
    policy_version: 'v2.4 (2025)',
    section: 'Sec 8.3 — Dental & Cosmetic Surgery',
    page: 28,
    clause_type: 'Exclusion',
    text: 'Routine dental examinations, orthodontics, and aesthetic/cosmetic procedures not necessitated by accidental trauma are excluded.',
    keywords: ['dental', 'cosmetic', 'aesthetic']
  },

  // v3.0 Clauses (Updated Policy Schedule)
  {
    clause_id: 'CL-101',
    policy_version: 'v3.0 (2026)',
    section: 'Sec 2.1 — Inpatient Hospitalization',
    page: 4,
    clause_type: 'Inclusion',
    text: 'Inpatient hospitalization expenses exceeding 24 consecutive hours for medically necessary surgical or medical treatment are covered up to the Base Sum Insured ($75,000), including room rent, nursing, ICU charges, and surgeon fees.',
    keywords: ['inpatient', 'hospitalization', 'surgery', 'appendectomy', 'stent', 'cardiac', 'icu']
  },
  {
    clause_id: 'CL-204',
    policy_version: 'v3.0 (2026)',
    section: 'Sec 4.2 — Pre-Existing Disease (PED) Waiting Period (Revised)',
    page: 11,
    clause_type: 'Waiting Period',
    text: 'Expenses related to the treatment of a Pre-Existing Disease (PED) and its direct complications shall be excluded until the expiry of 12 months (reduced from 24 months in v2.4) of continuous coverage from inception, provided the condition was declared at underwriting.',
    keywords: ['pre-existing', 'hypertension', 'cardiac', 'stent', 'coronary', 'waiting period', '12 months']
  },
  {
    clause_id: 'CL-209',
    policy_version: 'v3.0 (2026)',
    section: 'Sec 4.5 — Specific Named Ailment Waiting Period',
    page: 12,
    clause_type: 'Waiting Period',
    text: 'A 12-month waiting period applies to elective hernia, cataract, and benign prostatic hypertrophy. Acute emergency surgeries including acute appendicitis are exempt from initial waiting periods after 30 days.',
    keywords: ['appendectomy', 'appendicitis', 'acute', 'emergency', 'waiting period', '30 days']
  },
  {
    clause_id: 'CL-312',
    policy_version: 'v3.0 (2026)',
    section: 'Sec 5.4 — Cardiovascular Implant Sub-Limit',
    page: 16,
    clause_type: 'Sub-Limit',
    text: 'Drug-eluting coronary stents (DES) are covered up to 115% of NPPA ceiling price per stent, maximum 3 stents per hospitalization event.',
    keywords: ['stent', 'cardiac', 'coronary', 'sub-limit', 'des', 'angioplasty']
  },
  {
    clause_id: 'CL-408',
    policy_version: 'v3.0 (2026)',
    section: 'Sec 6.8 — Unproven & Experimental Therapies',
    page: 21,
    clause_type: 'Exclusion',
    text: 'Any treatment, procedure, or pharmacological agent classified as investigational, experimental, or lacking Phase III FDA/CDSCO approval for the specific ICD-10 indication is strictly excluded, except under approved NCCN Category 1 oncology protocols.',
    keywords: ['experimental', 'immunotherapy', 'investigational', 'phase', 'unproven', 'outpatient']
  },
  {
    clause_id: 'CL-502',
    policy_version: 'v3.0 (2026)',
    section: 'Sec 7.1 — Outpatient (OPD) Infusions',
    page: 24,
    clause_type: 'Exclusion',
    text: 'Outpatient department (OPD) consultations and day-care biologic infusions not listed in Annexure-II Day-Care Procedures are excluded unless covered under an active OPD Rider.',
    keywords: ['outpatient', 'opd', 'infusion', 'immunotherapy', 'day-care']
  },
  {
    clause_id: 'CL-601',
    policy_version: 'v3.0 (2026)',
    section: 'Sec 8.3 — Dental & Cosmetic Surgery',
    page: 28,
    clause_type: 'Exclusion',
    text: 'Routine dental examinations, orthodontics, and aesthetic/cosmetic procedures not necessitated by accidental trauma are excluded.',
    keywords: ['dental', 'cosmetic', 'aesthetic']
  }
];

// ============================================================================
// 2. PRE-LOADED SYNTHETIC CLINICAL CASES & MULTI-AGENT SIMULATIONS
// ============================================================================
const SYNTHETIC_CASES = [
  {
    case_id: 'CASE-2026-0841',
    title: 'Cardiac PCI Stent w/ Pre-Existing Hypertension Edge Case',
    badge: 'Contested Edge Case',
    badgeColor: 'amber',
    patient_summary: '58M admitted via ED with acute NSTEMI (I21.4). Underwent single-vessel PCI with 1 Drug-Eluting Stent (CPT 92928). Hospitalized 72 hours. Declared Stage-1 Hypertension at policy inception 18 months ago.',
    facts: {
      diagnosis: 'Acute Non-ST Elevation Myocardial Infarction (ICD-10: I21.4)',
      procedure: 'Percutaneous Coronary Intervention w/ 1 DES (CPT: 92928)',
      hospitalization_hours: 72,
      pre_existing: 'Essential Hypertension (I10) — declared at underwriting',
      policy_tenure_months: 18,
      claim_amount: '$14,200'
    },
    default_policy: 'v2.4 (2025)',
    // Pre-computed simulation data keyed by policy version
    runs: {
      'v2.4 (2025)': {
        retrieval: [
          { clause_id: 'CL-101', sim: 0.91, status: 'Relevant' },
          { clause_id: 'CL-204', sim: 0.94, status: 'Relevant' },
          { clause_id: 'CL-312', sim: 0.89, status: 'Relevant' },
          { clause_id: 'CL-209', sim: 0.62, status: 'Filtered Out' },
          { clause_id: 'CL-601', sim: 0.31, status: 'Filtered Out' }
        ],
        diversity_r0: 0.68,
        diversity_r1: 0.44,
        agents: [
          {
            id: 'Agent A',
            role: 'Coverage Eligibility Synthesizer',
            r0_verdict: 'Eligible',
            r0_clauses: ['CL-101', 'CL-312'],
            r0_rationale: 'Patient underwent emergency inpatient PCI (>24h stay) for acute NSTEMI (I21.4). Satisfies Sec 2.1 inpatient criteria and Sec 5.4 single DES implant sub-limit.',
            r0_tokens: 142,
            r1_verdict: 'Conditional',
            r1_clauses: ['CL-101', 'CL-204', 'CL-312'],
            r1_critique: 'Acknowledges Agent B’s flag on CL-204 (24-month PED waiting period at 18 months tenure). Reclassifies to Conditional pending cardiologist etiology attestation on whether NSTEMI is a direct complication of pre-existing hypertension.',
            r1_tokens: 168
          },
          {
            id: 'Agent B',
            role: 'Strict Exclusion & Waiting-Period Auditor',
            r0_verdict: 'Ineligible',
            r0_clauses: ['CL-204'],
            r0_rationale: 'Policy tenure is 18 months (< 24 months required under CL-204). Essential hypertension is an established cardiovascular risk factor and direct precursor to coronary atherosclerosis/NSTEMI; excluded under PED waiting period.',
            r0_tokens: 135,
            r1_verdict: 'Ineligible',
            r1_clauses: ['CL-204', 'CL-101'],
            r1_critique: 'Maintains Ineligible under strict v2.4 reading: CL-204 explicitly excludes direct complications of declared PED within 24 months regardless of emergency status.',
            r1_tokens: 151
          },
          {
            id: 'Agent C',
            role: 'Clinical Coding & Sub-Limit Verifier',
            r0_verdict: 'Conditional',
            r0_clauses: ['CL-312', 'CL-204', 'CL-101'],
            r0_rationale: 'CPT 92928 with 1 DES complies with CL-312 (max 2 stents, NPPA cap). However, causal nexus between ICD-10 I10 (PED at 18m) and I21.4 requires clinical causation audit under CL-204.',
            r0_tokens: 156,
            r1_verdict: 'Conditional',
            r1_clauses: ['CL-312', 'CL-204', 'CL-101'],
            r1_critique: 'Concurs with Agent A’s revised Conditional stance. Neither automatic approval nor automatic denial is strictly entailed without causal comorbidity adjudication.',
            r1_tokens: 160
          }
        ],
        judges: [
          // Candidate 0 = Agent A, Candidate 1 = Agent B, Candidate 2 = Agent C
          { judge_id: 'J1 (Clinical Rubric)', raw: [0.81, 0.85, 0.88], rep: [0.04, 0.03, 0.02], ungrd: [0.00, 0.00, 0.00] },
          { judge_id: 'J2 (Policy Legalist)', raw: [0.78, 0.89, 0.86], rep: [0.05, 0.02, 0.02], ungrd: [0.00, 0.00, 0.00] },
          { judge_id: 'J3 (Ground Auditor)', raw: [0.82, 0.82, 0.90], rep: [0.03, 0.04, 0.01], ungrd: [0.00, 0.00, 0.00] }
        ],
        latency_ms: { retrieval: 48, debate_r0: 410, debate_r1: 390, judging: 265 }
      },
      'v3.0 (2026)': {
        retrieval: [
          { clause_id: 'CL-101', sim: 0.92, status: 'Relevant' },
          { clause_id: 'CL-204', sim: 0.95, status: 'Relevant' },
          { clause_id: 'CL-312', sim: 0.89, status: 'Relevant' },
          { clause_id: 'CL-209', sim: 0.60, status: 'Filtered Out' }
        ],
        diversity_r0: 0.14,
        diversity_r1: 0.09,
        agents: [
          {
            id: 'Agent A',
            role: 'Coverage Eligibility Synthesizer',
            r0_verdict: 'Eligible',
            r0_clauses: ['CL-101', 'CL-204', 'CL-312'],
            r0_rationale: 'Under HealthShield Gold v3.0, CL-204 reduces the PED waiting period from 24 to 12 months. With 18 months continuous tenure, PED waiting period is fully satisfied. Covered up to NPPA + 15% DES cap (CL-312).',
            r0_tokens: 138,
            r1_verdict: 'Eligible',
            r1_clauses: ['CL-101', 'CL-204', 'CL-312'],
            r1_critique: 'Unanimous consensus across all agents under v3.0 12-month PED rule.',
            r1_tokens: 110
          },
          {
            id: 'Agent B',
            role: 'Strict Exclusion & Waiting-Period Auditor',
            r0_verdict: 'Eligible',
            r0_clauses: ['CL-204', 'CL-101'],
            r0_rationale: 'No waiting-period violation: tenure (18m) exceeds v3.0 CL-204 threshold (12m), and hypertension was declared at underwriting.',
            r0_tokens: 124,
            r1_verdict: 'Eligible',
            r1_clauses: ['CL-204', 'CL-101'],
            r1_critique: 'Confirmed no exclusionary bar exists in v3.0.',
            r1_tokens: 105
          },
          {
            id: 'Agent C',
            role: 'Clinical Coding & Sub-Limit Verifier',
            r0_verdict: 'Eligible',
            r0_clauses: ['CL-312', 'CL-101', 'CL-204'],
            r0_rationale: 'CPT 92928 (1 DES) falls well within v3.0 CL-312 limit (max 3 stents, 115% NPPA rate) and $75,000 Sum Insured.',
            r0_tokens: 129,
            r1_verdict: 'Eligible',
            r1_clauses: ['CL-312', 'CL-101', 'CL-204'],
            r1_critique: 'All coding and sub-limit checks pass.',
            r1_tokens: 108
          }
        ],
        judges: [
          { judge_id: 'J1 (Clinical Rubric)', raw: [0.95, 0.93, 0.94], rep: [0.01, 0.01, 0.01], ungrd: [0.00, 0.00, 0.00] },
          { judge_id: 'J2 (Policy Legalist)', raw: [0.94, 0.95, 0.92], rep: [0.02, 0.01, 0.02], ungrd: [0.00, 0.00, 0.00] },
          { judge_id: 'J3 (Ground Auditor)', raw: [0.96, 0.94, 0.95], rep: [0.01, 0.01, 0.01], ungrd: [0.00, 0.00, 0.00] }
        ],
        latency_ms: { retrieval: 44, debate_r0: 385, debate_r1: 0, judging: 240 }
      }
    }
  },
  {
    case_id: 'CASE-2026-0842',
    title: 'Acute Laparoscopic Appendectomy (Clear Approval)',
    badge: 'High Consensus',
    badgeColor: 'emerald',
    patient_summary: '29F presented with acute uncomplicated appendicitis (K35.80). Emergency laparoscopic appendectomy (CPT 44970) performed; 36-hour inpatient admission. No pre-existing conditions; policy active for 5 months.',
    facts: {
      diagnosis: 'Unspecified Acute Appendicitis (ICD-10: K35.80)',
      procedure: 'Laparoscopic Appendectomy (CPT: 44970)',
      hospitalization_hours: 36,
      pre_existing: 'None declared',
      policy_tenure_months: 5,
      claim_amount: '$6,850'
    },
    default_policy: 'v2.4 (2025)',
    runs: {
      'v2.4 (2025)': {
        retrieval: [
          { clause_id: 'CL-101', sim: 0.93, status: 'Relevant' },
          { clause_id: 'CL-209', sim: 0.96, status: 'Relevant' },
          { clause_id: 'CL-204', sim: 0.58, status: 'Filtered Out' },
          { clause_id: 'CL-601', sim: 0.25, status: 'Filtered Out' }
        ],
        diversity_r0: 0.11,
        diversity_r1: 0.08,
        agents: [
          {
            id: 'Agent A',
            role: 'Coverage Eligibility Synthesizer',
            r0_verdict: 'Eligible',
            r0_clauses: ['CL-101', 'CL-209'],
            r0_rationale: 'Inpatient hospitalization of 36 hours (>24h threshold in CL-101) for acute appendicitis. Policy active 5 months (>30-day acute emergency exemption in CL-209).',
            r0_tokens: 118,
            r1_verdict: 'Eligible',
            r1_clauses: ['CL-101', 'CL-209'],
            r1_critique: 'Early stopping triggered: full consensus and complete clause entailment.',
            r1_tokens: 95
          },
          {
            id: 'Agent B',
            role: 'Strict Exclusion & Waiting-Period Auditor',
            r0_verdict: 'Eligible',
            r0_clauses: ['CL-209', 'CL-101'],
            r0_rationale: 'CL-209 explicitly exempts acute appendicitis from named-ailment waiting periods after 30 days. At 5 months tenure with no PED, zero exclusions apply.',
            r0_tokens: 121,
            r1_verdict: 'Eligible',
            r1_clauses: ['CL-209', 'CL-101'],
            r1_critique: 'Early stopping triggered: no exclusion or waiting period triggers.',
            r1_tokens: 92
          },
          {
            id: 'Agent C',
            role: 'Clinical Coding & Sub-Limit Verifier',
            r0_verdict: 'Eligible',
            r0_clauses: ['CL-101', 'CL-209'],
            r0_rationale: 'ICD-10 K35.80 aligns directly with CPT 44970. No procedure-specific sub-limit applies; claim ($6,850) is well within $50,000 Base Sum Insured.',
            r0_tokens: 115,
            r1_verdict: 'Eligible',
            r1_clauses: ['CL-101', 'CL-209'],
            r1_critique: 'Early stopping triggered: coding and benefit limits verified.',
            r1_tokens: 90
          }
        ],
        judges: [
          { judge_id: 'J1 (Clinical Rubric)', raw: [0.96, 0.95, 0.96], rep: [0.01, 0.01, 0.01], ungrd: [0.00, 0.00, 0.00] },
          { judge_id: 'J2 (Policy Legalist)', raw: [0.95, 0.97, 0.94], rep: [0.01, 0.01, 0.01], ungrd: [0.00, 0.00, 0.00] },
          { judge_id: 'J3 (Ground Auditor)', raw: [0.97, 0.96, 0.96], rep: [0.01, 0.01, 0.01], ungrd: [0.00, 0.00, 0.00] }
        ],
        latency_ms: { retrieval: 41, debate_r0: 360, debate_r1: 0, judging: 225 }
      },
      'v3.0 (2026)': {
        retrieval: [
          { clause_id: 'CL-101', sim: 0.93, status: 'Relevant' },
          { clause_id: 'CL-209', sim: 0.96, status: 'Relevant' },
          { clause_id: 'CL-204', sim: 0.55, status: 'Filtered Out' }
        ],
        diversity_r0: 0.10,
        diversity_r1: 0.07,
        agents: [
          {
            id: 'Agent A',
            role: 'Coverage Eligibility Synthesizer',
            r0_verdict: 'Eligible',
            r0_clauses: ['CL-101', 'CL-209'],
            r0_rationale: 'Inpatient hospitalization of 36 hours for acute appendicitis covered under CL-101 ($75k limit) and exempt from waiting period under CL-209.',
            r0_tokens: 115,
            r1_verdict: 'Eligible',
            r1_clauses: ['CL-101', 'CL-209'],
            r1_critique: 'Unanimous consensus.',
            r1_tokens: 90
          },
          {
            id: 'Agent B',
            role: 'Strict Exclusion & Waiting-Period Auditor',
            r0_verdict: 'Eligible',
            r0_clauses: ['CL-209'],
            r0_rationale: 'Acute appendicitis exemption after 30 days satisfied (5 months tenure).',
            r0_tokens: 110,
            r1_verdict: 'Eligible',
            r1_clauses: ['CL-209'],
            r1_critique: 'No exclusions.',
            r1_tokens: 88
          },
          {
            id: 'Agent C',
            role: 'Clinical Coding & Sub-Limit Verifier',
            r0_verdict: 'Eligible',
            r0_clauses: ['CL-101'],
            r0_rationale: 'K35.80 + CPT 44970 verified without sub-limit caps.',
            r0_tokens: 112,
            r1_verdict: 'Eligible',
            r1_clauses: ['CL-101'],
            r1_critique: 'Verified.',
            r1_tokens: 89
          }
        ],
        judges: [
          { judge_id: 'J1 (Clinical Rubric)', raw: [0.97, 0.96, 0.96], rep: [0.01, 0.01, 0.01], ungrd: [0.00, 0.00, 0.00] },
          { judge_id: 'J2 (Policy Legalist)', raw: [0.96, 0.97, 0.95], rep: [0.01, 0.01, 0.01], ungrd: [0.00, 0.00, 0.00] },
          { judge_id: 'J3 (Ground Auditor)', raw: [0.97, 0.96, 0.97], rep: [0.01, 0.01, 0.01], ungrd: [0.00, 0.00, 0.00] }
        ],
        latency_ms: { retrieval: 39, debate_r0: 350, debate_r1: 0, judging: 215 }
      }
    }
  },
  {
    case_id: 'CASE-2026-0843',
    title: 'Outpatient Phase-II Experimental Immunotherapy Exclusion',
    badge: 'Exclusion / Escalation',
    badgeColor: 'rose',
    patient_summary: '64M with refractory solid tumor (C34.90) seeking outpatient infusion of a Phase-II investigational bispecific antibody (CPT 96413). No OPD rider on policy; tenure 30 months.',
    facts: {
      diagnosis: 'Malignant Neoplasm of Unspecified Part of Bronchus or Lung (ICD-10: C34.90)',
      procedure: 'Outpatient Chemotherapy/Biologic IV Infusion — Phase II Trial Agent (CPT: 96413)',
      hospitalization_hours: 4,
      pre_existing: 'Diagnosed post-policy inception (14 months after start)',
      policy_tenure_months: 30,
      claim_amount: '$22,400'
    },
    default_policy: 'v2.4 (2025)',
    runs: {
      'v2.4 (2025)': {
        retrieval: [
          { clause_id: 'CL-408', sim: 0.96, status: 'Relevant' },
          { clause_id: 'CL-502', sim: 0.92, status: 'Relevant' },
          { clause_id: 'CL-101', sim: 0.71, status: 'Filtered Out' },
          { clause_id: 'CL-601', sim: 0.22, status: 'Filtered Out' }
        ],
        diversity_r0: 0.24,
        diversity_r1: 0.15,
        agents: [
          {
            id: 'Agent A',
            role: 'Coverage Eligibility Synthesizer',
            r0_verdict: 'Ineligible',
            r0_clauses: ['CL-408', 'CL-502'],
            r0_rationale: 'Despite 30-month tenure, treatment is an outpatient Phase-II investigational agent lacking Phase III FDA/CDSCO approval (excluded by CL-408) and administered in OPD without an OPD rider (excluded by CL-502).',
            r0_tokens: 146,
            r1_verdict: 'Ineligible',
            r1_clauses: ['CL-408', 'CL-502'],
            r1_critique: 'Dual exclusion criteria in CL-408 and CL-502 strictly bar coverage.',
            r1_tokens: 132
          },
          {
            id: 'Agent B',
            role: 'Strict Exclusion & Waiting-Period Auditor',
            r0_verdict: 'Ineligible',
            r0_clauses: ['CL-408', 'CL-502'],
            r0_rationale: 'Explicit exclusion triggered on two independent grounds: Sec 6.8 (Phase II investigational status) and Sec 7.1 (non-Annexure-II OPD biologic infusion without rider).',
            r0_tokens: 139,
            r1_verdict: 'Ineligible',
            r1_clauses: ['CL-408', 'CL-502'],
            r1_critique: 'All agents aligned on exclusion.',
            r1_tokens: 128
          },
          {
            id: 'Agent C',
            role: 'Clinical Coding & Sub-Limit Verifier',
            r0_verdict: 'Ineligible',
            r0_clauses: ['CL-408', 'CL-502'],
            r0_rationale: 'CPT 96413 (4-hour outpatient infusion) fails the 24-hour inpatient threshold of CL-101, and investigational Phase-II status is barred under CL-408.',
            r0_tokens: 141,
            r1_verdict: 'Ineligible',
            r1_clauses: ['CL-408', 'CL-502'],
            r1_critique: 'Confirmed.',
            r1_tokens: 125
          }
        ],
        judges: [
          { judge_id: 'J1 (Clinical Rubric)', raw: [0.93, 0.94, 0.92], rep: [0.02, 0.01, 0.02], ungrd: [0.00, 0.00, 0.00] },
          { judge_id: 'J2 (Policy Legalist)', raw: [0.94, 0.96, 0.93], rep: [0.01, 0.01, 0.02], ungrd: [0.00, 0.00, 0.00] },
          { judge_id: 'J3 (Ground Auditor)', raw: [0.92, 0.95, 0.94], rep: [0.02, 0.01, 0.01], ungrd: [0.00, 0.00, 0.00] }
        ],
        latency_ms: { retrieval: 45, debate_r0: 395, debate_r1: 0, judging: 235 }
      },
      'v3.0 (2026)': {
        retrieval: [
          { clause_id: 'CL-408', sim: 0.95, status: 'Relevant' },
          { clause_id: 'CL-502', sim: 0.92, status: 'Relevant' },
          { clause_id: 'CL-101', sim: 0.69, status: 'Filtered Out' }
        ],
        diversity_r0: 0.56,
        diversity_r1: 0.48,
        agents: [
          {
            id: 'Agent A',
            role: 'Coverage Eligibility Synthesizer',
            r0_verdict: 'Conditional',
            r0_clauses: ['CL-408', 'CL-502'],
            r0_rationale: 'v3.0 CL-408 adds an exception for approved NCCN Category 1 oncology protocols; however, case summary lacks NCCN protocol documentation and OPD rider status (CL-502).',
            r0_tokens: 152,
            r1_verdict: 'Conditional',
            r1_clauses: ['CL-408', 'CL-502'],
            r1_critique: 'Requires clinical documentation verifying whether the Phase II agent holds NCCN Category 1 designation and Annexure-II day-care eligibility.',
            r1_tokens: 158
          },
          {
            id: 'Agent B',
            role: 'Strict Exclusion & Waiting-Period Auditor',
            r0_verdict: 'Ineligible',
            r0_clauses: ['CL-502', 'CL-408'],
            r0_rationale: 'Even if NCCN exception under v3.0 CL-408 were explored, CL-502 still excludes outpatient biologic infusions lacking an active OPD rider.',
            r0_tokens: 144,
            r1_verdict: 'Ineligible',
            r1_clauses: ['CL-502', 'CL-408'],
            r1_critique: 'Maintains Ineligible due to missing OPD rider under CL-502.',
            r1_tokens: 149
          },
          {
            id: 'Agent C',
            role: 'Clinical Coding & Sub-Limit Verifier',
            r0_verdict: 'Conditional',
            r0_clauses: ['CL-408', 'CL-502'],
            r0_rationale: 'Missing NCCN Category 1 evidence and Annexure-II day-care classification code; insufficient evidence for autonomous denial or approval.',
            r0_tokens: 148,
            r1_verdict: 'Conditional',
            r1_clauses: ['CL-408', 'CL-502'],
            r1_critique: 'Recommends human medical underwriter review.',
            r1_tokens: 145
          }
        ],
        judges: [
          { judge_id: 'J1 (Clinical Rubric)', raw: [0.74, 0.79, 0.76], rep: [0.03, 0.03, 0.02], ungrd: [0.00, 0.00, 0.00] },
          { judge_id: 'J2 (Policy Legalist)', raw: [0.71, 0.82, 0.73], rep: [0.04, 0.02, 0.03], ungrd: [0.00, 0.00, 0.00] },
          { judge_id: 'J3 (Ground Auditor)', raw: [0.76, 0.77, 0.78], rep: [0.03, 0.03, 0.02], ungrd: [0.00, 0.00, 0.00] }
        ],
        latency_ms: { retrieval: 47, debate_r0: 420, debate_r1: 405, judging: 270 }
      }
    }
  }
];

// ============================================================================
// 3. BENCHMARK & KL-REGULARIZATION TARGET DATA (Paper Section III-F & IV-B)
// ============================================================================
const ABLATION_DATA = [
  {
    model: '1. Standard RAG',
    accuracy: 71.4,
    macroF1: 68.2,
    clausePrec: 64.5,
    diversity: 0.12,
    bwtRetention: 54.0,
    p95Latency: 420
  },
  {
    model: '2. Vanilla Self-RAG',
    accuracy: 76.8,
    macroF1: 74.1,
    clausePrec: 73.0,
    diversity: 0.15,
    bwtRetention: 58.5,
    p95Latency: 680
  },
  {
    model: '3. Self-RAG + 1 Judge',
    accuracy: 79.2,
    macroF1: 76.9,
    clausePrec: 76.2,
    diversity: 0.18,
    bwtRetention: 61.2,
    p95Latency: 840
  },
  {
    model: '4. AEGIS-RAG (No KL)',
    accuracy: 86.5,
    macroF1: 85.1,
    clausePrec: 88.4,
    diversity: 0.54,
    bwtRetention: 63.8,
    p95Latency: 1140
  },
  {
    model: '5. Full AEGIS-RAG (Target)',
    accuracy: 88.9,
    macroF1: 87.8,
    clausePrec: 91.2,
    diversity: 0.56,
    bwtRetention: 94.6,
    p95Latency: 1180
  }
];

const KL_TRADEOFF_DATA = [
  { beta_kl: '0.00 (No KL)', old_policy_bwt: 61.2, new_policy_acc: 91.5, kl_drift: 1.84 },
  { beta_kl: '0.05', old_policy_bwt: 78.4, new_policy_acc: 90.8, kl_drift: 0.92 },
  { beta_kl: '0.10', old_policy_bwt: 88.9, new_policy_acc: 89.9, kl_drift: 0.45 },
  { beta_kl: '0.20 (Optimal)', old_policy_bwt: 94.6, new_policy_acc: 88.9, kl_drift: 0.21 },
  { beta_kl: '0.50', old_policy_bwt: 96.8, new_policy_acc: 82.1, kl_drift: 0.08 },
  { beta_kl: '1.00 (Frozen)', old_policy_bwt: 97.5, new_policy_acc: 74.3, kl_drift: 0.02 }
];

// ============================================================================
// 4. HELPER FUNCTIONS: MATHEMATICAL FORMULATION & GEMINI LIVE EVALUATION
// ============================================================================
function computeEnsembleScores(runData, params, useRound1) {
  const { alpha, betaRep, betaUngrd, gamma, tauVerdict, tauFallback } = params;
  const agents = runData.agents;
  const judges = runData.judges;

  // Token lengths L(y_m) and mean candidate length \bar{L}
  const lengths = agents.map((a) => (useRound1 ? a.r1_tokens : a.r0_tokens));
  const meanLength = lengths.reduce((sum, l) => sum + l, 0) / lengths.length;

  const candidateResults = agents.map((agent, mIdx) => {
    const L_m = lengths[mIdx];
    const lengthRatio = L_m / meanLength;
    const normFactor = Math.pow(lengthRatio, alpha);

    const perJudge = judges.map((judge) => {
      const s_km = judge.raw[mIdx];
      const p_rep = judge.rep[mIdx];
      const p_ungrd = judge.ungrd[mIdx];
      const calibrated = s_km / normFactor - betaRep * p_rep - betaUngrd * p_ungrd;
      return {
        judge_id: judge.judge_id,
        raw: s_km,
        p_rep,
        p_ungrd,
        calibrated: Number(calibrated.toFixed(4))
      };
    });

    // Equal reliability weights w_k = 1/K
    const K = perJudge.length;
    const weightedMean = perJudge.reduce((acc, j) => acc + j.calibrated, 0) / K;

    // Inter-judge variance \sigma_m^2 = Var_k(\tilde{s}_{k,m})
    const variance =
      perJudge.reduce((acc, j) => acc + Math.pow(j.calibrated - weightedMean, 2), 0) / K;
    const stdDev = Math.sqrt(variance);

    // S(y_m) = \sum w_k \tilde{s}_{k,m} - \gamma \sqrt{\sigma_m^2}
    const finalScore = weightedMean - gamma * stdDev;

    return {
      agent_id: agent.id,
      role: agent.role,
      verdict: useRound1 ? agent.r1_verdict : agent.r0_verdict,
      clauses: useRound1 ? agent.r1_clauses : agent.r0_clauses,
      tokens: L_m,
      lengthRatio: Number(lengthRatio.toFixed(2)),
      perJudge,
      weightedMean: Number(weightedMean.toFixed(4)),
      variance: Number(variance.toFixed(4)),
      stdDev: Number(stdDev.toFixed(4)),
      finalScore: Number(finalScore.toFixed(4))
    };
  });

  // Winning verdict y* = argmax_m S(y_m)
  let winnerIdx = 0;
  candidateResults.forEach((c, idx) => {
    if (c.finalScore > candidateResults[winnerIdx].finalScore) {
      winnerIdx = idx;
    }
  });
  const winner = candidateResults[winnerIdx];

  // Table III Confidence Routing
  let route = '';
  let routeStatus = '';
  let bufferEligible = false;

  if (winner.finalScore >= tauVerdict && winner.variance <= 0.015) {
    route = 'High Consensus -> Issue Claim Decision';
    routeStatus = 'HIGH_CONSENSUS';
    bufferEligible = true;
  } else if (winner.finalScore >= tauFallback) {
    route = 'Moderate / Contested -> Provisional Verdict w/ Clause Caveats';
    routeStatus = 'MODERATE_CONTESTED';
    bufferEligible = false;
  } else {
    route = 'Low Confidence -> Escalate to Human Medical Underwriter';
    routeStatus = 'LOW_CONFIDENCE';
    bufferEligible = false;
  }

  return {
    meanLength: Math.round(meanLength),
    candidates: candidateResults,
    winner,
    route,
    routeStatus,
    bufferEligible
  };
}

// Live Gemini API call for custom patient cases (with exponential backoff)
async function runLiveGeminiAdjudication(customCase, policyVersion) {
  const relevantClauses = POLICY_CLAUSES.filter((c) => c.policy_version === policyVersion);
  const clauseText = relevantClauses
    .map(
      (c) =>
        `[${c.clause_id}] (${c.clause_type} | ${c.section} | Page ${c.page}): ${c.text}`
    )
    .join('\n');

  const prompt = `You are executing the AEGIS-RAG medical insurance claim verification pipeline.
Evaluate the following patient clinical case strictly against the provided versioned policy clauses (${policyVersion}).

PATIENT CLINICAL CASE:
- Diagnosis: ${customCase.diagnosis}
- Requested Procedure: ${customCase.procedure}
- Hospitalization Duration: ${customCase.hospitalization_hours} hours
- Pre-existing Conditions: ${customCase.pre_existing}
- Policy Tenure: ${customCase.policy_tenure_months} months
- Claim Amount: ${customCase.claim_amount}

INDEXED POLICY CLAUSES (${policyVersion}):
${clauseText}

Return a structured JSON simulation of:
1. Retrieval scores (0.0 to 1.0) and Self-RAG relevance status ("Relevant" or "Filtered Out") for each clause ID.
2. Round 0 and Round 1 verdicts ("Eligible", "Ineligible", or "Conditional"), cited clause_ids, and concise rationales/critiques for:
   - Agent A (Coverage Eligibility Synthesizer)
   - Agent B (Strict Exclusion & Waiting-Period Auditor)
   - Agent C (Clinical Coding & Sub-Limit Verifier)
3. Pairwise semantic diversity metrics diversity_r0 and diversity_r1 (between 0.05 and 0.85).
4. Three independent judge raw scores (0.50 to 0.98) for each of the 3 agents, plus small repetition penalties (0.00 to 0.08) and ungrounded citation penalties (0.00 to 0.25 if an agent cites a non-existent clause).`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          retrieval: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                clause_id: { type: 'STRING' },
                sim: { type: 'NUMBER' },
                status: { type: 'STRING' }
              },
              required: ['clause_id', 'sim', 'status']
            }
          },
          diversity_r0: { type: 'NUMBER' },
          diversity_r1: { type: 'NUMBER' },
          agents: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                id: { type: 'STRING' },
                role: { type: 'STRING' },
                r0_verdict: { type: 'STRING' },
                r0_clauses: { type: 'ARRAY', items: { type: 'STRING' } },
                r0_rationale: { type: 'STRING' },
                r0_tokens: { type: 'INTEGER' },
                r1_verdict: { type: 'STRING' },
                r1_clauses: { type: 'ARRAY', items: { type: 'STRING' } },
                r1_critique: { type: 'STRING' },
                r1_tokens: { type: 'INTEGER' }
              },
              required: [
                'id',
                'role',
                'r0_verdict',
                'r0_clauses',
                'r0_rationale',
                'r0_tokens',
                'r1_verdict',
                'r1_clauses',
                'r1_critique',
                'r1_tokens'
              ]
            }
          },
          judges: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                judge_id: { type: 'STRING' },
                raw: { type: 'ARRAY', items: { type: 'NUMBER' } },
                rep: { type: 'ARRAY', items: { type: 'NUMBER' } },
                ungrd: { type: 'ARRAY', items: { type: 'NUMBER' } }
              },
              required: ['judge_id', 'raw', 'rep', 'ungrd']
            }
          }
        },
        required: ['retrieval', 'diversity_r0', 'diversity_r1', 'agents', 'judges']
      }
    }
  };

  const apiKey = '';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  let attempt = 0;
  const maxRetries = 3;
  while (attempt < maxRetries) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty model response');
      const parsed = JSON.parse(rawText);
      return {
        ...parsed,
        latency_ms: { retrieval: 52, debate_r0: 610, debate_r1: 540, judging: 310 }
      };
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) throw err;
      await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 500));
    }
  }
}

// ============================================================================
// 5. UI BADGE & HELPER COMPONENTS
// ============================================================================
function VerdictBadge({ verdict }) {
  const styles = {
    Eligible: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Ineligible: 'bg-rose-100 text-rose-800 border-rose-300',
    Conditional: 'bg-amber-100 text-amber-800 border-amber-300',
    'Human Review': 'bg-indigo-100 text-indigo-800 border-indigo-300'
  };
  const icons = {
    Eligible: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />,
    Ineligible: <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />,
    Conditional: <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />,
    'Human Review': <UserCheck className="w-3.5 h-3.5 mr-1 text-indigo-600" />
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        styles[verdict] || 'bg-slate-100 text-slate-800 border-slate-300'
      }`}
    >
      {icons[verdict]}
      {verdict}
    </span>
  );
}

function ClauseTypeBadge({ type }) {
  const styles = {
    Inclusion: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Exclusion: 'bg-rose-50 text-rose-700 border-rose-200',
    'Waiting Period': 'bg-amber-50 text-amber-700 border-amber-200',
    'Sub-Limit': 'bg-sky-50 text-sky-700 border-sky-200'
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
        styles[type] || 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
    >
      {type}
    </span>
  );
}

// ============================================================================
// 6. MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  const [activeTab, setActiveTab] = useState('workbench');

  // Workbench State
  const [selectedCaseId, setSelectedCaseId] = useState('CASE-2026-0841');
  const [selectedPolicyVersion, setSelectedPolicyVersion] = useState('v2.4 (2025)');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customFacts, setCustomFacts] = useState({
    diagnosis: 'Acute Cholecystitis with Cholelithiasis (ICD-10: K80.00)',
    procedure: 'Laparoscopic Cholecystectomy (CPT: 47562)',
    hospitalization_hours: 48,
    pre_existing: 'Type 2 Diabetes Mellitus (E11.9) declared at inception',
    policy_tenure_months: 15,
    claim_amount: '$8,400'
  });
  const [liveCustomRun, setLiveCustomRun] = useState(null);
  const [isRunningLive, setIsRunningLive] = useState(false);
  const [liveError, setLiveError] = useState(null);

  // Debate & Judging Hyperparameters (Interactive Sliders)
  const [earlyStoppingEnabled, setEarlyStoppingEnabled] = useState(true);
  const [deltaEarly, setDeltaEarly] = useState(0.20);
  const [alpha, setAlpha] = useState(0.5);
  const [betaRep, setBetaRep] = useState(0.6);
  const [betaUngrd, setBetaUngrd] = useState(1.2);
  const [gamma, setGamma] = useState(0.5);
  const [tauVerdict, setTauVerdict] = useState(0.82);
  const [tauFallback, setTauFallback] = useState(0.70);

  // Human Underwriter Review State
  const [reviewerDisposition, setReviewerDisposition] = useState('Approve as Conditional');
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [reviewSubmittedBanner, setReviewSubmittedBanner] = useState(null);

  // Audit Trace & Replay Log State
  const [auditTraces, setAuditTraces] = useState([
    {
      trace_id: 'TRC-9901-A4',
      timestamp: '2026-11-22 18:42:10 UTC',
      case_id: 'CASE-2026-0842',
      case_title: 'Acute Laparoscopic Appendectomy (Clear Approval)',
      policy_version: 'v2.4 (2025)',
      policy_hash: 'sha256:8f94e2c1...34cd',
      verdict: 'Eligible',
      route: 'High Consensus -> Issue Claim Decision',
      score: 0.9467,
      diversity_r0: 0.11,
      latency_total_ms: 626,
      tokens_total: 631,
      human_review: 'Auto-Verified (Buffer Eligible)',
      config_snapshot: { alpha: 0.5, betaRep: 0.6, betaUngrd: 1.2, tauVerdict: 0.82 }
    },
    {
      trace_id: 'TRC-9902-B7',
      timestamp: '2026-11-22 19:15:44 UTC',
      case_id: 'CASE-2026-0841',
      case_title: 'Cardiac PCI Stent w/ Pre-Existing Hypertension Edge Case',
      policy_version: 'v2.4 (2025)',
      policy_hash: 'sha256:8f94e2c1...34cd',
      verdict: 'Conditional',
      route: 'Moderate / Contested -> Provisional Verdict w/ Clause Caveats',
      score: 0.8054,
      diversity_r0: 0.68,
      latency_total_ms: 1113,
      tokens_total: 912,
      human_review: 'Pending Underwriter Sign-off',
      config_snapshot: { alpha: 0.5, betaRep: 0.6, betaUngrd: 1.2, tauVerdict: 0.82 }
    }
  ]);

  // Policy Explorer State
  const [policySearch, setPolicySearch] = useState('');
  const [policyTypeFilter, setPolicyTypeFilter] = useState('All');
  const [showDiffView, setShowDiffView] = useState(false);

  // Adversarial Stress Test State (Lab Tab)
  const [advPaddingWords, setAdvPaddingWords] = useState(0);
  const [advFabricatedCitations, setAdvFabricatedCitations] = useState(0);

  // Active Case & Run Resolution
  const currentCase = useMemo(
    () => SYNTHETIC_CASES.find((c) => c.case_id === selectedCaseId) || SYNTHETIC_CASES[0],
    [selectedCaseId]
  );

  const activeRunData = useMemo(() => {
    if (isCustomMode) {
      if (liveCustomRun) return liveCustomRun;
      // Fallback deterministic structure before live run
      return {
        retrieval: [
          { clause_id: 'CL-101', sim: 0.90, status: 'Relevant' },
          { clause_id: 'CL-204', sim: 0.86, status: 'Relevant' },
          { clause_id: 'CL-209', sim: 0.72, status: 'Relevant' },
          { clause_id: 'CL-601', sim: 0.28, status: 'Filtered Out' }
        ],
        diversity_r0: 0.42,
        diversity_r1: 0.25,
        agents: [
          {
            id: 'Agent A',
            role: 'Coverage Eligibility Synthesizer',
            r0_verdict: 'Eligible',
            r0_clauses: ['CL-101'],
            r0_rationale:
              'Click "Execute Live AEGIS-RAG Pipeline" to run real-time Gemini 3 Flash multi-agent adjudication on your custom clinical facts.',
            r0_tokens: 120,
            r1_verdict: 'Eligible',
            r1_clauses: ['CL-101', 'CL-204'],
            r1_critique: 'Awaiting live execution.',
            r1_tokens: 115
          },
          {
            id: 'Agent B',
            role: 'Strict Exclusion & Waiting-Period Auditor',
            r0_verdict: 'Conditional',
            r0_clauses: ['CL-204'],
            r0_rationale:
              'Awaiting live audit of pre-existing disease waiting period against policy tenure.',
            r0_tokens: 118,
            r1_verdict: 'Conditional',
            r1_clauses: ['CL-204'],
            r1_critique: 'Awaiting live execution.',
            r1_tokens: 112
          },
          {
            id: 'Agent C',
            role: 'Clinical Coding & Sub-Limit Verifier',
            r0_verdict: 'Eligible',
            r0_clauses: ['CL-101'],
            r0_rationale: 'Awaiting live ICD-10 / CPT verification.',
            r0_tokens: 114,
            r1_verdict: 'Eligible',
            r1_clauses: ['CL-101'],
            r1_critique: 'Awaiting live execution.',
            r1_tokens: 110
          }
        ],
        judges: [
          { judge_id: 'J1 (Clinical Rubric)', raw: [0.85, 0.84, 0.85], rep: [0.02, 0.02, 0.02], ungrd: [0.0, 0.0, 0.0] },
          { judge_id: 'J2 (Policy Legalist)', raw: [0.84, 0.86, 0.83], rep: [0.02, 0.02, 0.02], ungrd: [0.0, 0.0, 0.0] },
          { judge_id: 'J3 (Ground Auditor)', raw: [0.86, 0.85, 0.85], rep: [0.01, 0.01, 0.01], ungrd: [0.0, 0.0, 0.0] }
        ],
        latency_ms: { retrieval: 42, debate_r0: 380, debate_r1: 340, judging: 230 }
      };
    }
    return currentCase.runs[selectedPolicyVersion] || currentCase.runs['v2.4 (2025)'];
  }, [isCustomMode, liveCustomRun, currentCase, selectedPolicyVersion]);

  // Determine whether Round 1 Debate ran (Early Stopping logic from Section III-E)
  const didEarlyStop = earlyStoppingEnabled && activeRunData.diversity_r0 < deltaEarly;
  const useRound1 = !didEarlyStop;

  // Compute Ensemble Scores & Routing dynamically whenever sliders change
  const ensembleSummary = useMemo(
    () =>
      computeEnsembleScores(
        activeRunData,
        { alpha, betaRep, betaUngrd, gamma, tauVerdict, tauFallback },
        useRound1
      ),
    [activeRunData, alpha, betaRep, betaUngrd, gamma, tauVerdict, tauFallback, useRound1]
  );

  // Execute Live Gemini Pipeline for Custom Case
  const handleRunLiveCustom = async () => {
    setIsRunningLive(true);
    setLiveError(null);
    try {
      const result = await runLiveGeminiAdjudication(customFacts, selectedPolicyVersion);
      setLiveCustomRun(result);
    } catch (err) {
      setLiveError(
        'Live Gemini API evaluation encountered a network or rate-limit issue. Please retry.'
      );
    } finally {
      setIsRunningLive(false);
    }
  };

  // Submit Human Underwriter Review -> Append to Immutable Decision Trace Log
  const handleRecordUnderwriterReview = () => {
    const policyMeta = POLICY_VERSIONS.find((p) => p.version === selectedPolicyVersion);
    const totalLatency =
      activeRunData.latency_ms.retrieval +
      activeRunData.latency_ms.debate_r0 +
      (useRound1 ? activeRunData.latency_ms.debate_r1 : 0) +
      activeRunData.latency_ms.judging;
    const totalTokens = activeRunData.agents.reduce(
      (acc, a) => acc + a.r0_tokens + (useRound1 ? a.r1_tokens : 0),
      0
    );

    const newTrace = {
      trace_id: `TRC-${Math.floor(1000 + Math.random() * 9000)}-UW`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      case_id: isCustomMode ? 'CASE-CUSTOM-LIVE' : currentCase.case_id,
      case_title: isCustomMode ? customFacts.diagnosis : currentCase.title,
      policy_version: selectedPolicyVersion,
      policy_hash: policyMeta ? policyMeta.source_hash.slice(0, 19) + '...' : 'sha256:custom',
      verdict: ensembleSummary.winner.verdict,
      route: ensembleSummary.route,
      score: ensembleSummary.winner.finalScore,
      diversity_r0: activeRunData.diversity_r0,
      latency_total_ms: totalLatency,
      tokens_total: totalTokens,
      human_review: `${reviewerDisposition}${reviewerNotes ? ` — "${reviewerNotes}"` : ''}`,
      config_snapshot: { alpha, betaRep, betaUngrd, tauVerdict }
    };

    setAuditTraces((prev) => [newTrace, ...prev]);
    setReviewSubmittedBanner(
      `Audit record ${newTrace.trace_id} committed. Human disposition logged; active model weights remain frozen (offline KL-update buffer isolated per Governance Rule 8).`
    );
    setReviewerNotes('');
    setTimeout(() => setReviewSubmittedBanner(null), 6500);
  };

  // Replay trace into Workbench
  const handleReplayTrace = (trace) => {
    const matchedCase = SYNTHETIC_CASES.find((c) => c.case_id === trace.case_id);
    if (matchedCase) {
      setIsCustomMode(false);
      setSelectedCaseId(matchedCase.case_id);
    }
    setSelectedPolicyVersion(trace.policy_version);
    if (trace.config_snapshot) {
      setAlpha(trace.config_snapshot.alpha);
      setBetaRep(trace.config_snapshot.betaRep);
      setBetaUngrd(trace.config_snapshot.betaUngrd);
      setTauVerdict(trace.config_snapshot.tauVerdict);
    }
    setActiveTab('workbench');
  };

  // Adversarial Stress Test Calculations (Eq. 5 & Section III-F \Delta_hack)
  const adversarialMetrics = useMemo(() => {
    const baseRaw = 0.88;
    const baseTokens = 135;
    const meanTokens = 135;

    // Clean calibrated score
    const cleanScore = baseRaw / Math.pow(baseTokens / meanTokens, alpha);

    // Perturbed candidate: verbosity adds tokens & repetition, fabricated citations add P_ungrd
    const perturbedTokens = baseTokens + advPaddingWords * 25;
    const simulatedRawInflation = Math.min(0.08, advPaddingWords * 0.012 + advFabricatedCitations * 0.015);
    const pRep = Math.min(1, advPaddingWords * 0.11);
    const pUngrd = Math.min(1, advFabricatedCitations * 0.34);

    // Uncalibrated Single LLM-as-a-Judge favors verbosity & fake citations
    const singleJudgePerturbed = Math.min(0.99, baseRaw + simulatedRawInflation);
    const singleJudgeDeltaHack = singleJudgePerturbed - baseRaw;

    // AEGIS-RAG Calibrated Judge (Eq. 5)
    const aegisPerturbed =
      singleJudgePerturbed / Math.pow(perturbedTokens / meanTokens, alpha) -
      betaRep * pRep -
      betaUngrd * pUngrd;
    const aegisDeltaHack = aegisPerturbed - cleanScore;

    return {
      cleanScore: Number(cleanScore.toFixed(4)),
      perturbedTokens,
      pRep: Number(pRep.toFixed(2)),
      pUngrd: Number(pUngrd.toFixed(2)),
      singleJudgePerturbed: Number(singleJudgePerturbed.toFixed(4)),
      singleJudgeDeltaHack: Number(singleJudgeDeltaHack.toFixed(4)),
      aegisPerturbed: Number(aegisPerturbed.toFixed(4)),
      aegisDeltaHack: Number(aegisDeltaHack.toFixed(4))
    };
  }, [advPaddingWords, advFabricatedCitations, alpha, betaRep, betaUngrd]);

  // Filtered clauses for Policy Explorer
  const filteredClauses = useMemo(() => {
    return POLICY_CLAUSES.filter((c) => {
      const matchesVersion = c.policy_version === selectedPolicyVersion;
      const matchesType = policyTypeFilter === 'All' || c.clause_type === policyTypeFilter;
      const matchesQuery =
        policySearch.trim() === '' ||
        c.text.toLowerCase().includes(policySearch.toLowerCase()) ||
        c.clause_id.toLowerCase().includes(policySearch.toLowerCase()) ||
        c.section.toLowerCase().includes(policySearch.toLowerCase());
      return matchesVersion && matchesType && matchesQuery;
    });
  }, [selectedPolicyVersion, policyTypeFilter, policySearch]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* =====================================================================
          TOP RESEARCH & GOVERNANCE HEADER
      ===================================================================== */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-inner">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight">AEGIS-RAG</h1>
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Research Prototype v0.9
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Auditable Medical Policy Claim Verification via Multi-Agent Debate &amp; Bias-Penalized Ensemble Judging
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/70 overflow-x-auto">
            {[
              { id: 'workbench', label: 'Claim Workbench', icon: Layers },
              { id: 'policies', label: 'Policy Corpus', icon: BookOpen },
              { id: 'benchmark', label: '5-Axis Evaluation Lab', icon: Activity },
              { id: 'audit', label: 'Audit & Replay Log', icon: History }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Advisory / Governance Notice Bar */}
      <div className="bg-indigo-950/95 text-indigo-100 border-b border-indigo-900/80 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>
              <strong>Research &amp; Underwriting Decision-Support Mode:</strong> Synthetic / de-identified cases only. Policy editions are pinned and immutable; low-confidence or contested claims route to human medical underwriters.
            </span>
          </div>
          <span className="font-mono text-[11px] text-indigo-300">
            Paper Ref: Maheshwari et al. (AKGEC IT)
          </span>
        </div>
      </div>

      {/* =====================================================================
          MAIN WORKSPACE CONTENT
      ===================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ===================================================================
            TAB 1: CLAIM ADJUDICATION WORKBENCH
        =================================================================== */}
        {activeTab === 'workbench' && (
          <div className="space-y-6">
            {/* TOP CONTROL BAR: CASE & VERSIONED POLICY PINNING */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    Layer 1 — Orchestration &amp; Version Pinning
                  </span>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5">
                    Patient Clinical Case &amp; Authoritative Policy Schedule
                  </h2>
                </div>

                {/* Policy Version Selector */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <span className="text-xs font-medium text-slate-600 pl-2">Policy Edition:</span>
                    {POLICY_VERSIONS.map((pv) => (
                      <button
                        key={pv.version}
                        onClick={() => setSelectedPolicyVersion(pv.version)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                          selectedPolicyVersion === pv.version
                            ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        HealthShield Gold {pv.version}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Case Selector Pills */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                {SYNTHETIC_CASES.map((c) => {
                  const selected = !isCustomMode && selectedCaseId === c.case_id;
                  return (
                    <button
                      key={c.case_id}
                      onClick={() => {
                        setIsCustomMode(false);
                        setSelectedCaseId(c.case_id);
                        setSelectedPolicyVersion(c.default_policy);
                      }}
                      className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                        selected
                          ? 'bg-indigo-50/70 border-indigo-500 ring-1 ring-indigo-500'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="font-mono text-[11px] font-semibold text-slate-500">
                          {c.case_id}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            c.badgeColor === 'emerald'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.badgeColor === 'amber'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {c.badge}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 line-clamp-2">{c.title}</p>
                    </button>
                  );
                })}

                {/* Custom Clinical Case Option */}
                <button
                  onClick={() => setIsCustomMode(true)}
                  className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isCustomMode
                      ? 'bg-indigo-50/70 border-indigo-500 ring-1 ring-indigo-500'
                      : 'bg-white border-dashed border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[11px] font-semibold text-indigo-600">
                      CUSTOM CASE
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    Custom Structured Case (Live Gemini Execution)
                  </p>
                </button>
              </div>

              {/* Structured Clinical Facts Display or Editor */}
              {!isCustomMode ? (
                <div className="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-200/80">
                  <p className="text-xs text-slate-700 leading-relaxed mb-3">
                    <strong className="text-slate-900">De-Identified Clinical Summary:</strong>{' '}
                    {currentCase.patient_summary}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] uppercase text-slate-400 block">Diagnosis</span>
                      <span className="font-semibold text-slate-800">{currentCase.facts.diagnosis}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] uppercase text-slate-400 block">Procedure</span>
                      <span className="font-semibold text-slate-800">{currentCase.facts.procedure}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] uppercase text-slate-400 block">Stay Duration</span>
                      <span className="font-semibold text-slate-800">
                        {currentCase.facts.hospitalization_hours} Hours
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] uppercase text-slate-400 block">Pre-Existing</span>
                      <span className="font-semibold text-slate-800">{currentCase.facts.pre_existing}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] uppercase text-slate-400 block">Policy Tenure</span>
                      <span className="font-semibold text-indigo-700">
                        {currentCase.facts.policy_tenure_months} Months
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] uppercase text-slate-400 block">Claim Amount</span>
                      <span className="font-semibold text-slate-800">{currentCase.facts.claim_amount}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 bg-indigo-50/40 rounded-lg p-4 border border-indigo-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Diagnosis &amp; ICD-10 Code
                      </label>
                      <input
                        type="text"
                        value={customFacts.diagnosis}
                        onChange={(e) =>
                          setCustomFacts({ ...customFacts, diagnosis: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Requested Procedure &amp; CPT
                      </label>
                      <input
                        type="text"
                        value={customFacts.procedure}
                        onChange={(e) =>
                          setCustomFacts({ ...customFacts, procedure: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Pre-Existing Conditions (PED)
                      </label>
                      <input
                        type="text"
                        value={customFacts.pre_existing}
                        onChange={(e) =>
                          setCustomFacts({ ...customFacts, pre_existing: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Hospitalization Duration (Hours)
                      </label>
                      <input
                        type="number"
                        value={customFacts.hospitalization_hours}
                        onChange={(e) =>
                          setCustomFacts({
                            ...customFacts,
                            hospitalization_hours: Number(e.target.value)
                          })
                        }
                        className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Continuous Policy Tenure (Months)
                      </label>
                      <input
                        type="number"
                        value={customFacts.policy_tenure_months}
                        onChange={(e) =>
                          setCustomFacts({
                            ...customFacts,
                            policy_tenure_months: Number(e.target.value)
                          })
                        }
                        className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-900"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleRunLiveCustom}
                        disabled={isRunningLive}
                        className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all"
                      >
                        <Play className="w-4 h-4" />
                        <span>
                          {isRunningLive
                            ? 'Running Multi-Agent Debate...'
                            : 'Execute Live AEGIS-RAG Pipeline'}
                        </span>
                      </button>
                    </div>
                  </div>
                  {liveError && (
                    <p className="mt-2 text-xs text-rose-600 font-medium">{liveError}</p>
                  )}
                </div>
              )}
            </div>

            {/* ===============================================================
                LAYER 2: VERSIONED POLICY RETRIEVAL & SELF-RAG SUFFICIENCY GATE
            =============================================================== */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    Layer 2 — Dense Vector Search &amp; Self-RAG Reflection Gate
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Retrieved Policy Clauses ({selectedPolicyVersion})
                  </h3>
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-500 font-mono">
                  <span>Metric: sim(q, d_i) = (e_q^T e_di) / (||e_q|| ||e_di||)</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Latency: {activeRunData.latency_ms.retrieval} ms
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeRunData.retrieval.map((item) => {
                  const clauseObj =
                    POLICY_CLAUSES.find(
                      (c) =>
                        c.clause_id === item.clause_id &&
                        c.policy_version === selectedPolicyVersion
                    ) || POLICY_CLAUSES.find((c) => c.clause_id === item.clause_id);
                  if (!clauseObj) return null;
                  const isRelevant = item.status === 'Relevant';
                  return (
                    <div
                      key={item.clause_id}
                      className={`p-3.5 rounded-lg border transition-all ${
                        isRelevant
                          ? 'bg-white border-slate-200 shadow-2xs'
                          : 'bg-slate-50/70 border-slate-200/70 opacity-65'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            {clauseObj.clause_id}
                          </span>
                          <ClauseTypeBadge type={clauseObj.clause_type} />
                          <span className="text-[11px] text-slate-500">
                            Page {clauseObj.page}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[11px] text-slate-600">
                            cos={item.sim.toFixed(2)}
                          </span>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                              isRelevant
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isRelevant ? '[Relevant]' : '[Filtered Out]'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 mb-1">
                        {clauseObj.section}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">{clauseObj.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ===============================================================
                LAYER 3: STRUCTURED MULTI-AGENT DEBATE (ROUND 0 & ROUND 1)
            =============================================================== */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    Layer 3 — Parallel Heterogeneous Multi-Agent Debate
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Role-Specialized Agents &amp; Epistemic Disagreement Signal
                  </h3>
                </div>

                {/* Diversity Metric & Adaptive Early-Stopping Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                    <span className="text-slate-500 mr-1.5">Round-0 Diversity Δ_div^(0):</span>
                    <span
                      className={`font-mono font-bold ${
                        activeRunData.diversity_r0 >= deltaEarly
                          ? 'text-amber-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      {activeRunData.diversity_r0.toFixed(2)}
                    </span>
                  </div>

                  <label className="flex items-center space-x-2 text-xs bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={earlyStoppingEnabled}
                      onChange={(e) => setEarlyStoppingEnabled(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span className="font-medium text-slate-700">
                      Adaptive Early Stopping (δ_early = {deltaEarly.toFixed(2)})
                    </span>
                  </label>
                </div>
              </div>

              {/* Orchestrator Gate Banner */}
              <div
                className={`mt-4 px-4 py-2.5 rounded-lg border text-xs flex items-center justify-between ${
                  didEarlyStop
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>
                    {didEarlyStop ? (
                      <>
                        <strong>Early Stopping Triggered (Section III-E):</strong>{' '}
                        Δ_div^(0) ({activeRunData.diversity_r0.toFixed(2)}) &lt; δ_early (
                        {deltaEarly.toFixed(2)}). Unanimous Round-0 consensus detected; bypassing Round-1 critique to save latency (~390 ms).
                      </>
                    ) : (
                      <>
                        <strong>Disagreement Threshold Exceeded — Round 1 Critique Active:</strong>{' '}
                        Δ_div^(0) ({activeRunData.diversity_r0.toFixed(2)}) ≥ δ_early (
                        {deltaEarly.toFixed(2)}). Agents exchange anonymized peer assessments while preserving immutable Round-0 proposals (Post-debate Δ_div^(1) ={' '}
                        {activeRunData.diversity_r1.toFixed(2)}).
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* 3 Heterogeneous Agent Cards */}
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                {activeRunData.agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                          {agent.id}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {useRound1 ? agent.r1_tokens : agent.r0_tokens} tok
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-3">{agent.role}</h4>

                      {/* Round 0 Immutable Assessment */}
                      <div className="bg-white rounded-lg p-3 border border-slate-200 mb-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-semibold uppercase text-slate-500">
                            Round 0 (Immutable)
                          </span>
                          <VerdictBadge verdict={agent.r0_verdict} />
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed mb-2">
                          {agent.r0_rationale}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {agent.r0_clauses.map((cid) => (
                            <span
                              key={cid}
                              className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {cid}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Round 1 Cross-Critique (if active) */}
                      {useRound1 && (
                        <div className="bg-indigo-50/50 rounded-lg p-3 border border-indigo-200/80">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-semibold uppercase text-indigo-800">
                              Round 1 Cross-Critique
                            </span>
                            <VerdictBadge verdict={agent.r1_verdict} />
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed mb-2">
                            {agent.r1_critique}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {agent.r1_clauses.map((cid) => (
                              <span
                                key={cid}
                                className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white text-indigo-700 border border-indigo-200"
                              >
                                {cid}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ===============================================================
                LAYER 4: BIAS-PENALIZED ENSEMBLE JUDGING & ROUTING
            =============================================================== */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    Layer 4 — Anti-Reward-Hacking Ensemble Judging &amp; Confidence Routing
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Length-Normalized, Bias-Penalized Rubric Scoring (Eq. 5 &amp; Eq. 6)
                  </h3>
                </div>
                <div className="bg-slate-900 text-slate-100 px-3 py-1.5 rounded-lg font-mono text-xs">
                  S(y_m) = Σ w_k [ s_km / (L_m / L̄)^α − β_rep·P_rep − β_ungrd·P_ungrd ] − γ·√σ_m²
                </div>
              </div>

              {/* Interactive Hyperparameter Sliders */}
              <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Interactive Calibration &amp; Threshold Controls (Live Recalculation)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between font-medium mb-1">
                      <span>Length Norm (α)</span>
                      <span className="font-mono text-indigo-700">{alpha.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={alpha}
                      onChange={(e) => setAlpha(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between font-medium mb-1">
                      <span>Repetition (β_rep)</span>
                      <span className="font-mono text-indigo-700">{betaRep.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1.5"
                      step="0.05"
                      value={betaRep}
                      onChange={(e) => setBetaRep(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between font-medium mb-1">
                      <span>Ungrounded (β_ungrd)</span>
                      <span className="font-mono text-indigo-700">{betaUngrd.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2.5"
                      step="0.1"
                      value={betaUngrd}
                      onChange={(e) => setBetaUngrd(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between font-medium mb-1">
                      <span>Dispersion (γ)</span>
                      <span className="font-mono text-indigo-700">{gamma.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1.5"
                      step="0.05"
                      value={gamma}
                      onChange={(e) => setGamma(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between font-medium mb-1">
                      <span>Consensus (τ_verdict)</span>
                      <span className="font-mono text-emerald-700">{tauVerdict.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.65"
                      max="0.98"
                      step="0.01"
                      value={tauVerdict}
                      onChange={(e) => setTauVerdict(parseFloat(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between font-medium mb-1">
                      <span>Fallback (τ_fallback)</span>
                      <span className="font-mono text-amber-700">{tauFallback.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.50"
                      max="0.85"
                      step="0.01"
                      value={tauFallback}
                      onChange={(e) => setTauFallback(parseFloat(e.target.value))}
                      className="w-full accent-amber-600"
                    />
                  </div>
                </div>
              </div>

              {/* Judge Matrix Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                      <th className="py-2.5 px-3 font-semibold">Candidate Trajectory</th>
                      <th className="py-2.5 px-3 font-semibold">Verdict</th>
                      <th className="py-2.5 px-3 font-semibold">Tokens L(y_m) / L̄</th>
                      <th className="py-2.5 px-3 font-semibold">J1 Calibrated</th>
                      <th className="py-2.5 px-3 font-semibold">J2 Calibrated</th>
                      <th className="py-2.5 px-3 font-semibold">J3 Calibrated</th>
                      <th className="py-2.5 px-3 font-semibold">Spread √σ_m²</th>
                      <th className="py-2.5 px-3 font-semibold text-right">
                        Final Score S(y_m)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ensembleSummary.candidates.map((cand) => {
                      const isWinner = cand.agent_id === ensembleSummary.winner.agent_id;
                      return (
                        <tr
                          key={cand.agent_id}
                          className={isWinner ? 'bg-indigo-50/60 font-medium' : 'bg-white'}
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-900">{cand.agent_id}</span>
                              {isWinner && (
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-600 text-white">
                                  y* Winner
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500">{cand.role}</span>
                          </td>
                          <td className="py-3 px-3">
                            <VerdictBadge verdict={cand.verdict} />
                          </td>
                          <td className="py-3 px-3 font-mono">
                            {cand.tokens} / {ensembleSummary.meanLength} ({cand.lengthRatio}x)
                          </td>
                          {cand.perJudge.map((j) => (
                            <td key={j.judge_id} className="py-3 px-3 font-mono">
                              <div>{j.calibrated.toFixed(3)}</div>
                              <div className="text-[10px] text-slate-400">
                                raw:{j.raw.toFixed(2)} | -p:{(j.p_rep + j.p_ungrd).toFixed(2)}
                              </div>
                            </td>
                          ))}
                          <td className="py-3 px-3 font-mono text-slate-600">
                            {cand.stdDev.toFixed(4)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-sm font-bold text-indigo-700">
                            {cand.finalScore.toFixed(4)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* =============================================================
                  TABLE III ROUTING OUTCOME & HUMAN UNDERWRITER REVIEW PANEL
              ============================================================= */}
              <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Routing Decision Card */}
                <div
                  className={`lg:col-span-6 rounded-xl p-4 border flex flex-col justify-between ${
                    ensembleSummary.routeStatus === 'HIGH_CONSENSUS'
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : ensembleSummary.routeStatus === 'MODERATE_CONTESTED'
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-rose-50/70 border-rose-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Table III Confidence Routing Outcome
                      </span>
                      <VerdictBadge verdict={ensembleSummary.winner.verdict} />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-2">
                      {ensembleSummary.route}
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-xs bg-white/80 p-2.5 rounded-lg border border-slate-200/80 mb-3">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Winning Score S(y*)</span>
                        <span className="font-mono font-bold text-slate-900">
                          {ensembleSummary.winner.finalScore.toFixed(4)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Judge Variance σ²</span>
                        <span className="font-mono font-bold text-slate-900">
                          {ensembleSummary.winner.variance.toFixed(4)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">KL Update Buffer</span>
                        <span
                          className={`font-semibold ${
                            ensembleSummary.bufferEligible ? 'text-emerald-700' : 'text-slate-600'
                          }`}
                        >
                          {ensembleSummary.bufferEligible ? 'Admissible' : 'Excluded'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong>Grounded Citations:</strong>{' '}
                    {ensembleSummary.winner.clauses.join(', ')} (Pinned to{' '}
                    {selectedPolicyVersion})
                  </p>
                </div>

                {/* Human Medical Underwriter Disposition Form */}
                <div className="lg:col-span-6 rounded-xl p-4 border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1.5">
                      <UserCheck className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Human Underwriter Sign-Off &amp; Trace Commit
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      POST /v1/reviews/{'{trace_id}'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">
                    Record an auditable underwriter disposition. Per Design Governance Rule 8, human reviews are logged immutably and never trigger online weight updates.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Final Disposition
                      </label>
                      <select
                        value={reviewerDisposition}
                        onChange={(e) => setReviewerDisposition(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-slate-900"
                      >
                        <option>Approve Claim (Verified Grounding)</option>
                        <option>Approve as Conditional (Request Records)</option>
                        <option>Deny Claim (Policy Exclusion Applies)</option>
                        <option>Escalate to Senior Medical Director</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Reviewer Audit Rationale
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Confirmed CL-204 tenure exception..."
                        value={reviewerNotes}
                        onChange={(e) => setReviewerNotes(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-slate-900"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleRecordUnderwriterReview}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Commit Immutable Decision Trace &amp; Review Record</span>
                  </button>
                  {reviewSubmittedBanner && (
                    <div className="mt-2.5 p-2 rounded bg-emerald-100 border border-emerald-300 text-emerald-900 text-[11px] font-medium">
                      {reviewSubmittedBanner}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: VERSIONED POLICY CORPUS EXPLORER
        =================================================================== */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    FR-01 &amp; FR-02 — Immutable Policy Schedule Governance
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">
                    Versioned Medical Policy Corpus &amp; Clause Provenance
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowDiffView(!showDiffView)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      showDiffView
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>
                      {showDiffView ? 'Hide v2.4 vs v3.0 Diff' : 'Compare v2.4 vs v3.0 Edition Diff'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Policy Edition Metadata Cards */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {POLICY_VERSIONS.map((pv) => {
                  const active = selectedPolicyVersion === pv.version;
                  return (
                    <div
                      key={pv.version}
                      onClick={() => setSelectedPolicyVersion(pv.version)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        active
                          ? 'bg-indigo-50/60 border-indigo-500 ring-1 ring-indigo-500'
                          : 'bg-slate-50 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-slate-900">
                          {pv.name} — {pv.version}
                        </span>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {pv.approval_status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1 mt-2 font-mono">
                        <div>
                          Effective: {pv.effective_from} to {pv.effective_to} | Jurisdiction:{' '}
                          {pv.jurisdiction}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          Source Hash: {pv.source_hash}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Optional Edition Diff View */}
              {showDiffView && (
                <div className="mt-5 bg-amber-50/50 border border-amber-200 rounded-xl p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-3 flex items-center space-x-1.5">
                    <GitCompare className="w-4 h-4" />
                    <span>Material Clause Changes Between v2.4 (2025) and v3.0 (2026)</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-amber-200">
                      <div className="font-mono font-bold text-indigo-700 mb-1">
                        CL-204 — Pre-Existing Disease (PED) Waiting Period
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-2 rounded bg-rose-50/70 border border-rose-200 text-slate-700">
                          <span className="font-semibold text-rose-800 block mb-0.5">
                            v2.4 (2025):
                          </span>
                          Excluded until expiry of <strong>24 months</strong> of continuous coverage.
                        </div>
                        <div className="p-2 rounded bg-emerald-50/70 border border-emerald-200 text-slate-700">
                          <span className="font-semibold text-emerald-800 block mb-0.5">
                            v3.0 (2026):
                          </span>
                          Reduced to <strong>12 months</strong> of continuous coverage if declared at underwriting.
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-amber-200">
                      <div className="font-mono font-bold text-indigo-700 mb-1">
                        CL-408 — Unproven &amp; Experimental Therapies
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-2 rounded bg-rose-50/70 border border-rose-200 text-slate-700">
                          <span className="font-semibold text-rose-800 block mb-0.5">
                            v2.4 (2025):
                          </span>
                          Blanket exclusion for therapies lacking Phase III FDA/CDSCO approval.
                        </div>
                        <div className="p-2 rounded bg-emerald-50/70 border border-emerald-200 text-slate-700">
                          <span className="font-semibold text-emerald-800 block mb-0.5">
                            v3.0 (2026):
                          </span>
                          Adds carve-out exception for <strong>approved NCCN Category 1 oncology protocols</strong>.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Search and Filter Controls */}
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search clause ID, section, or policy text..."
                    value={policySearch}
                    onChange={(e) => setPolicySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div className="flex items-center space-x-1.5">
                  {['All', 'Inclusion', 'Exclusion', 'Waiting Period', 'Sub-Limit'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setPolicyTypeFilter(t)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                        policyTypeFilter === t
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clause Table */}
              <div className="mt-4 space-y-2.5">
                {filteredClauses.map((clause) => (
                  <div
                    key={`${clause.policy_version}-${clause.clause_id}`}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {clause.clause_id}
                        </span>
                        <ClauseTypeBadge type={clause.clause_type} />
                        <span className="text-xs font-bold text-slate-900">{clause.section}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500">
                        Edition: {clause.policy_version} | Source Page: {clause.page}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{clause.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: 5-AXIS EVALUATION & ADVERSARIAL BENCHMARK LAB
        =================================================================== */}
        {activeTab === 'benchmark' && (
          <div className="space-y-6">
            {/* Evidence Status Banner per Design Document */}
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-xs text-amber-950 flex items-start space-x-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-amber-950">
                  Target Benchmark Suite — Paper Phase 2 Empirical Evaluation Protocol
                </h3>
                <p className="mt-1 leading-relaxed">
                  Per Section IV-B of the AEGIS-RAG specification and the Project Design Document, empirical benchmark runs across held-out medical policy datasets remain in the experimental validation phase. The metrics below represent the <strong>five-axis evaluation protocol and target ablation hypotheses</strong> comparing Standard RAG, Vanilla Self-RAG, Single-Judge Self-RAG, AEGIS-RAG (No KL), and Full AEGIS-RAG.
                </p>
              </div>
            </div>

            {/* 5-Axis Ablation Comparison Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Axis 1 &amp; 4: Claim Accuracy, Clause Precision &amp; Prior-Policy Retention (BWT)
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Target ablation trajectories across the 5 baseline architectures (%)
                </p>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ABLATION_DATA} margin={{ top: 10, right: 15, left: -10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="model"
                        tick={{ fontSize: 10 }}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                      />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Bar dataKey="accuracy" name="Eligibility Accuracy (%)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="clausePrec" name="Clause Precision (%)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="bwtRetention" name="Prior Policy Retention BWT (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Layer 5: Offline KL-Divergence Regularization Explorer */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Layer 5: KL-Divergence Regularization Plasticity-Stability Tradeoff (Eq. 7 &amp; 8)
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  L_AEGIS(θ) = E[ S(y*)·L_task + β_KL · D_KL(π_θ || π_ref) ] across policy schedule updates
                </p>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={KL_TRADEOFF_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="beta_kl" tick={{ fontSize: 10 }} />
                      <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Line
                        type="monotone"
                        dataKey="old_policy_bwt"
                        name="Prior Policy Retention (BWT %)"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="new_policy_acc"
                        name="New Policy Edition Accuracy (%)"
                        stroke="#4f46e5"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* ===============================================================
                INTERACTIVE ADVERSARIAL REWARD-HACKING STRESS TEST (Axis 2)
            =============================================================== */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                    Axis 2 — Adversarial Reward-Hacking Stress Test (Section III-F)
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Verbosity Padding &amp; Fabricated Clause Citation Perturbation Simulator
                  </h3>
                </div>
                <span className="font-mono text-xs bg-slate-100 px-3 py-1 rounded border border-slate-200">
                  Target Condition: Δ_hack = E[S(y_perturbed) − S(y_clean)] ≤ 0
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Perturbation Controls */}
                <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Inject Boilerplate Verbosity Padding</span>
                      <span className="font-mono text-indigo-700">
                        +{advPaddingWords * 25} extra tokens
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={advPaddingWords}
                      onChange={(e) => setAdvPaddingWords(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Simulates rhetorical legalistic padding designed to exploit uncalibrated LLM-as-a-judge verbosity bias.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Inject Fabricated Policy Clause Citations</span>
                      <span className="font-mono text-rose-700">
                        {advFabricatedCitations} ungrounded citations
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      step="1"
                      value={advFabricatedCitations}
                      onChange={(e) => setAdvFabricatedCitations(parseInt(e.target.value, 10))}
                      className="w-full accent-rose-600"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Simulates citing plausible-sounding non-existent clauses (e.g., &ldquo;Sec 9.4(b) Emergency Override&rdquo;) absent from C_q.
                    </p>
                  </div>
                </div>

                {/* Comparison Output Cards */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Uncalibrated Single Judge */}
                  <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-rose-900">
                        Uncalibrated Single LLM-as-a-Judge
                      </span>
                      <AlertOctagon className="w-4 h-4 text-rose-600" />
                    </div>
                    <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
                      {adversarialMetrics.singleJudgePerturbed.toFixed(4)}
                    </div>
                    <div className="text-xs font-mono mb-3">
                      Score Inflation Δ_hack:{' '}
                      <span
                        className={`font-bold ${
                          adversarialMetrics.singleJudgeDeltaHack > 0
                            ? 'text-rose-700'
                            : 'text-slate-600'
                        }`}
                      >
                        {adversarialMetrics.singleJudgeDeltaHack >= 0 ? '+' : ''}
                        {adversarialMetrics.singleJudgeDeltaHack.toFixed(4)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">
                      {adversarialMetrics.singleJudgeDeltaHack > 0
                        ? 'VULNERABLE: Reward hacking succeeds! Single critic rewards longer legalistic boilerplate and hallucinated clause authority.'
                        : 'Baseline clean trajectory (no perturbations injected).'}
                    </p>
                  </div>

                  {/* AEGIS-RAG Calibrated Ensemble Judge */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-900">
                        AEGIS-RAG Calibrated Ensemble Judge
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-mono font-bold text-slate-900 mb-1">
                      {adversarialMetrics.aegisPerturbed.toFixed(4)}
                    </div>
                    <div className="text-xs font-mono mb-3">
                      Score Inflation Δ_hack:{' '}
                      <span
                        className={`font-bold ${
                          adversarialMetrics.aegisDeltaHack <= 0
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {adversarialMetrics.aegisDeltaHack >= 0 ? '+' : ''}
                        {adversarialMetrics.aegisDeltaHack.toFixed(4)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">
                      {adversarialMetrics.aegisDeltaHack < 0
                        ? `RESISTANT (Δ_hack ≤ 0): Length normalization (L=${adversarialMetrics.perturbedTokens}) and penalties (P_rep=${adversarialMetrics.pRep}, P_ungrd=${adversarialMetrics.pUngrd}) strictly suppress reward hacking.`
                        : 'Clean trajectory score preserved without artificial inflation.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: IMMUTABLE AUDIT TRACE & REPLAY LOG
        =================================================================== */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  FR-07 — Reproducible Evaluation &amp; Underwriter Audit Trail
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Immutable Decision Traces &amp; One-Click Configuration Replay
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Total Stored Traces: {auditTraces.length}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {auditTraces.map((trace) => (
                <div
                  key={trace.trace_id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {trace.trace_id}
                      </span>
                      <VerdictBadge verdict={trace.verdict} />
                      <span className="text-xs font-bold text-slate-900">{trace.case_title}</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {trace.timestamp}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 font-mono">
                      <span>Policy: {trace.policy_version}</span>
                      <span>Hash: {trace.policy_hash}</span>
                      <span>S(y*): {trace.score.toFixed(4)}</span>
                      <span>Δ_div^(0): {trace.diversity_r0.toFixed(2)}</span>
                      <span>Latency: {trace.latency_total_ms} ms</span>
                      <span>Tokens: {trace.tokens_total}</span>
                    </div>

                    <div className="text-xs text-slate-700">
                      <strong>Route:</strong> {trace.route} &nbsp;|&nbsp;{' '}
                      <strong>Underwriter Status:</strong>{' '}
                      <span className="text-indigo-800 font-medium">{trace.human_review}</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => handleReplayTrace(trace)}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-800 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Replay Trace in Workbench</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}