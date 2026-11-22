# AEGIS-RAG: Medical Policy Claim Verification & Research Evaluation Platform

An interactive React + Vite prototype and research evaluation workbench implementing the **AEGIS-RAG** architecture (*Robust Self-RAG through Multi-Agent Debate and Ensemble Judging*) for auditable medical insurance claim adjudication[cite: 1, 6].

> **Disclaimer:** This application is an academic research prototype and evaluation workbench developed at Ajay Kumar Garg Engineering College (IT Dept.)[cite: 1, 6]. It is not intended for autonomous production insurance adjudication or payment authorization[cite: 6].

---

## Key Features

- **Claim Adjudication Workbench (Layers 1–4)**[cite: 6]
  - **Policy Retrieval & Filtering:** Clause-level cosine similarity retrieval with Self-RAG relevance filtering across immutable policy editions (`HealthShield Gold v2.4` and `v3.0`)[cite: 2, 3, 6].
  - **Multi-Agent Debate:** Parallel Round-0 proposals from three specialized agents (*Coverage Synthesizer*, *Exclusion Auditor*, and *Clinical Coding Verifier*), pairwise semantic diversity ($\Delta_{\text{div}}$) tracking, adaptive early stopping, and Round-1 anonymized cross-critique[cite: 3, 4, 6].
  - **Bias-Penalized Ensemble Judging:** Real-time hyperparameter controls for length normalization ($\alpha$), repetition/ungrounded penalties ($\beta_{\text{rep}}, \beta_{\text{ungrd}}$), judge dispersion ($\gamma$), and confidence routing thresholds ($\tau_{\text{verdict}}, \tau_{\text{fallback}}$)[cite: 3, 4].
  - **Human-in-the-Loop Underwriter Sign-off:** Captures human reviewer dispositions into an immutable audit log without triggering online model updates[cite: 6].
- **Versioned Policy Corpus Explorer**[cite: 6]
  - Inspect extracted policy clauses with source provenance (`clause_id`, `section`, `page`, `source_hash`) and compare differences across policy editions (`v2.4` vs. `v3.0`)[cite: 6].
- **5-Axis Evaluation & Adversarial Benchmark Lab**[cite: 4, 6]
  - Compare the five paper baselines (*Standard RAG*, *Vanilla Self-RAG*, *Single Judge*, *AEGIS without KL*, and *Full AEGIS-RAG*), run adversarial reward-hacking stress tests ($\Delta_{\text{hack}}$), and explore offline KL-divergence regularization ($\beta_{\text{KL}}$) vs. Backward Transfer (BWT) retention[cite: 4, 5, 6].
- **Audit Trace & Replay Log**[cite: 4, 6]
  - View latency/token telemetry and replay previous adjudication runs with exact configuration hashes[cite: 4, 6].

---

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS (`@tailwindcss/vite`)
- **Icons & Charts:** `lucide-react`, `recharts`
- **AI Integration:** Google Gemini API (`gemini-3-flash-preview`) with built-in deterministic simulation fallback

---

## Prerequisites

- **Node.js** (v18 or higher; LTS recommended) — [Download Node.js](https://nodejs.org/)
- **npm** (included with Node.js)
- **Git** — [Download Git](https://git-scm.com/)

Verify your installation by running:
```bash
node -v
npm -v

Local Setup & Installation
Clone the repository

Bash
git clone [https://github.com/g4auransh/aegis-rag-platform.git](https://github.com/g4auransh/aegis-rag-platform.git)
cd aegis-rag-platform

Install dependencies

Bash
npm install

Start the development server

Bash
npm run dev

Open in your browser
Navigate to the local URL printed in your terminal (usually http://localhost:5173/).

Project Structure

Plaintext
├── public/
├── src/
│   ├── aegis_rag_medical_policy_verification_research_platform.tsx  # Main AEGIS-RAG application
│   ├── index.css                                                    # Tailwind CSS entry
│   └── main.jsx                                                     # React root mount
├── index.html
├── package.json
├── vite.config.js
└── README.md

